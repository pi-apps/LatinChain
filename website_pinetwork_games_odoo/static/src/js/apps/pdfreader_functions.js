// Configurar el worker de PDF.js
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

// Variables de estado
let pdfDoc = null;
let pageNum = 1;
let pageIsRendering = false;
let pageNumPending = null;
let baseScale = 1.0; 
let currentZoom = 0.75;
let isPageTransitioning = false; // Bloqueo para evitar scrolls locos

// Referencias al DOM
const canvas = document.getElementById('pdf-canvas');
const ctx = canvas.getContext('2d');
const canvasWrapper = document.getElementById('canvas-wrapper');
const emptyState = document.getElementById('empty-state');
const loadingSpinner = document.getElementById('loading-spinner');
const pageNumInput = document.getElementById('page-num-input');
const pageCount = document.getElementById('page-count');
const spanZoomLevel = document.getElementById('zoom-level');
const btnPrev = document.getElementById('prev-page');
const btnNext = document.getElementById('next-page');
const btnZoomIn = document.getElementById('zoom-in');
const btnZoomOut = document.getElementById('zoom-out');

// Initialize zoom from localStorage immediately on page load
const initialSavedZoom = localStorage.getItem('pdfReaderZoom');
if (initialSavedZoom !== null) {
    currentZoom = parseFloat(initialSavedZoom);
    spanZoomLevel.textContent = `${Math.round(currentZoom * 100)}%`;
}

const renderPage = (num) => {
    pageIsRendering = true;
    
    pdfDoc.getPage(num).then((page) => {
        // Calcular escala responsiva base (para ajustar a la pantalla inicialmente)
        const containerWidth = canvasWrapper.clientWidth - 32; // 32px de margen seguro
        const unscaledViewport = page.getViewport({ scale: 1 });
        baseScale = containerWidth / unscaledViewport.width;
        
        // Aplicar el zoom actual del usuario
        const scale = baseScale * currentZoom;
        const viewport = page.getViewport({ scale });

        // Manejo de alta densidad de píxeles (High DPI / Retina)
        const outputScale = window.devicePixelRatio || 1;
        canvas.width = Math.floor(viewport.width * outputScale);
        canvas.height = Math.floor(viewport.height * outputScale);
        
        // Tamaño visual usando CSS
        canvas.style.width = Math.floor(viewport.width) + "px";
        canvas.style.height = Math.floor(viewport.height) + "px";

        // Permitir o quitar el centrado si la imagen es más grande que el contenedor
        if (viewport.width > canvasWrapper.clientWidth) {
            canvasWrapper.classList.remove('justify-center');
        } else {
            canvasWrapper.classList.add('justify-center');
        }

        const transform = outputScale !== 1 ? [outputScale, 0, 0, outputScale, 0, 0] : null;

        const renderContext = {
            canvasContext: ctx,
            transform: transform,
            viewport: viewport
        };

        page.render(renderContext).promise.then(() => {
            pageIsRendering = false;
            
            if (pageNumPending !== null) {
                renderPage(pageNumPending);
                pageNumPending = null;
            }
        });

        pageNumInput.value = num;
        updateButtonStates();
    });
};

const queueRenderPage = (num) => {
    if (pageIsRendering) {
        pageNumPending = num;
    } else {
        renderPage(num);
    }
};

const updateButtonStates = () => {
    const hasDoc = pdfDoc !== null;
    btnPrev.disabled = !hasDoc || pageNum <= 1;
    btnNext.disabled = !hasDoc || pageNum >= pdfDoc.numPages;
    btnZoomIn.disabled = !hasDoc || currentZoom >= 3.0;
    btnZoomOut.disabled = !hasDoc || currentZoom <= 0.5;
    pageNumInput.disabled = !hasDoc;
};

const onPrevPage = () => {
    if (pageNum <= 1 || isPageTransitioning) return;
    pageNum--;
    queueRenderPage(pageNum);
    canvasWrapper.scrollTop = 0;
    canvasWrapper.scrollLeft = 0;
};

const onNextPage = () => {
    if (pageNum >= pdfDoc.numPages || isPageTransitioning) return;
    pageNum++;
    queueRenderPage(pageNum);
    canvasWrapper.scrollTop = 0;
    canvasWrapper.scrollLeft = 0;
};

// Navegar a página específica usando el input
const goToSpecificPage = (e) => {
    if (e.type === 'keydown' && e.key !== 'Enter') return;
    if (!pdfDoc) return;
    
    let desiredPage = parseInt(pageNumInput.value, 10);
    
    // Validaciones
    if (isNaN(desiredPage)) {
        pageNumInput.value = pageNum;
        return;
    }
    if (desiredPage < 1) desiredPage = 1;
    if (desiredPage > pdfDoc.numPages) desiredPage = pdfDoc.numPages;
    
    // Solo renderizar si la página es diferente
    if (desiredPage !== pageNum) {
        pageNum = desiredPage;
        queueRenderPage(pageNum);
        canvasWrapper.scrollTop = 0;
        canvasWrapper.scrollLeft = 0;
    } else {
        pageNumInput.value = pageNum; // Corregir si el usuario puso un número inválido
    }
};

pageNumInput.addEventListener('keydown', goToSpecificPage);
pageNumInput.addEventListener('blur', goToSpecificPage);

// Save Zoom utility
const saveZoomLevel = (zoom) => {
    localStorage.setItem('pdfReaderZoom', zoom.toString());
};

const onZoomIn = () => {
    if (currentZoom >= 3.0) return;
    currentZoom += 0.25;
    spanZoomLevel.textContent = `${Math.round(currentZoom * 100)}%`;
    saveZoomLevel(currentZoom);
    queueRenderPage(pageNum);
};

const onZoomOut = () => {
    if (currentZoom <= 0.5) return;
    currentZoom -= 0.25;
    spanZoomLevel.textContent = `${Math.round(currentZoom * 100)}%`;
    saveZoomLevel(currentZoom);
    queueRenderPage(pageNum);
};

btnPrev.addEventListener('click', onPrevPage);
btnNext.addEventListener('click', onNextPage);
btnZoomIn.addEventListener('click', onZoomIn);
btnZoomOut.addEventListener('click', onZoomOut);

const loadPDF = async (fileUrl) => {
    loadingSpinner.classList.remove('hidden');
    
    try {
        const loadingTask = pdfjsLib.getDocument(fileUrl);
        pdfDoc = await loadingTask.promise;
        
        pageCount.textContent = pdfDoc.numPages;
        pageNum = 1;
        
        // Retrieve saved zoom or default to 0.75
        const savedZoom = localStorage.getItem('pdfReaderZoom');
        if (savedZoom !== null) {
            currentZoom = parseFloat(savedZoom);
        } else {
            currentZoom = 0.75;
        }
        spanZoomLevel.textContent = `${Math.round(currentZoom * 100)}%`;
        
        emptyState.classList.add('hidden');
        canvasWrapper.classList.remove('hidden');
        
        renderPage(pageNum);
        canvasWrapper.focus(); // Dar foco para que funcionen las flechas

    } catch (error) {
        alert('Error opening PDF. Please verify it is a valid file.');
        console.error(error);
    } finally {
        loadingSpinner.classList.add('hidden');
    }
};

const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'application/pdf') {
        const fileUrl = URL.createObjectURL(file);
        loadPDF(fileUrl);
    } else if (file) {
        alert('Please select a valid PDF file.');
    }
};

document.getElementById('file-upload-desktop').addEventListener('change', handleFileUpload);
document.getElementById('file-upload-mobile').addEventListener('change', handleFileUpload);
document.getElementById('file-upload-main').addEventListener('change', handleFileUpload);

// --- Funciones para cambiar de página desde los bordes ---
const goToNextPageFromEdge = () => {
    if (!pdfDoc || pageIsRendering || isPageTransitioning || pageNum >= pdfDoc.numPages) return;
    isPageTransitioning = true;
    pageNum++;
    queueRenderPage(pageNum);
    
    const checkRender = setInterval(() => {
        if (!pageIsRendering) {
            clearInterval(checkRender);
            canvasWrapper.scrollTop = 0; // Siguiente página empieza arriba
            setTimeout(() => isPageTransitioning = false, 250);
        }
    }, 50);
};

const goToPrevPageFromEdge = () => {
    if (!pdfDoc || pageIsRendering || isPageTransitioning || pageNum <= 1) return;
    isPageTransitioning = true;
    pageNum--;
    queueRenderPage(pageNum);
    
    const checkRender = setInterval(() => {
        if (!pageIsRendering) {
            clearInterval(checkRender);
            canvasWrapper.scrollTop = canvasWrapper.scrollHeight; // Anterior página empieza abajo
            setTimeout(() => isPageTransitioning = false, 250);
        }
    }, 50);
};

// --- Lógica de Overscroll (Requiere esfuerzo extra para cambiar de página) ---
let edgeScrollAccumulator = 0;
const EDGE_THRESHOLD = 120; // Píxeles de "esfuerzo" requeridos para cambiar

// Rueda del ratón / Trackpad
canvasWrapper.addEventListener('wheel', (e) => {
    if (!pdfDoc || pageIsRendering || isPageTransitioning) return;

    const isAtTop = canvasWrapper.scrollTop <= 2;
    const isAtBottom = Math.abs(canvasWrapper.scrollHeight - canvasWrapper.scrollTop - canvasWrapper.clientHeight) <= 2;

    if (e.deltaY < 0 && isAtTop && pageNum > 1) {
        e.preventDefault(); // Previene el rebote del navegador
        edgeScrollAccumulator += Math.abs(e.deltaY);
        if (edgeScrollAccumulator > EDGE_THRESHOLD) {
            edgeScrollAccumulator = 0;
            goToPrevPageFromEdge();
        }
    }
    else if (e.deltaY > 0 && isAtBottom && pageNum < pdfDoc.numPages) {
        e.preventDefault();
        edgeScrollAccumulator += Math.abs(e.deltaY);
        if (edgeScrollAccumulator > EDGE_THRESHOLD) {
            edgeScrollAccumulator = 0;
            goToNextPageFromEdge();
        }
    } else {
        // Reseteamos si el usuario hace scroll normal por el medio de la página
        edgeScrollAccumulator = 0;
    }
}, { passive: false });

// Arrastrar con el mouse
let isDragging = false;
let startX, startY, scrollLeftStart, scrollTopStart;

canvas.addEventListener('mousedown', (e) => {
    isDragging = true;
    canvas.classList.add('grabbing-cursor');
    startX = e.pageX - canvasWrapper.offsetLeft;
    startY = e.pageY - canvasWrapper.offsetTop;
    scrollLeftStart = canvasWrapper.scrollLeft;
    scrollTopStart = canvasWrapper.scrollTop;
});

window.addEventListener('mouseup', () => {
    isDragging = false;
    canvas.classList.remove('grabbing-cursor');
});

canvasWrapper.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - canvasWrapper.offsetLeft;
    const y = e.pageY - canvasWrapper.offsetTop;
    canvasWrapper.scrollLeft = scrollLeftStart - (x - startX);
    canvasWrapper.scrollTop = scrollTopStart - (y - startY);
});

// Keyboard controls
window.addEventListener('keydown', (e) => {
    if (!pdfDoc || document.activeElement === pageNumInput || isPageTransitioning) return;

    const isAtTop = canvasWrapper.scrollTop <= 2;
    const isAtBottom = Math.abs(canvasWrapper.scrollHeight - canvasWrapper.scrollTop - canvasWrapper.clientHeight) <= 2;
    const isAtLeft = canvasWrapper.scrollLeft <= 2;
    const isAtRight = Math.abs(canvasWrapper.scrollWidth - canvasWrapper.scrollLeft - canvasWrapper.clientWidth) <= 2;

    // Left / Right
    if (e.key === 'ArrowRight') {
        if (isAtRight) {
            onNextPage();
        } else {
            canvasWrapper.scrollBy({ left: 50, behavior: 'auto' });
        }
    } else if (e.key === 'ArrowLeft') {
        if (isAtLeft) {
            onPrevPage();
        } else {
            canvasWrapper.scrollBy({ left: -50, behavior: 'auto' });
        }
    } 
    // Up / Down
    else if (e.key === 'ArrowDown') {
        if (isAtBottom) {
            goToNextPageFromEdge();
        } else {
            canvasWrapper.scrollBy({ top: 50, behavior: 'auto' });
        }
    } else if (e.key === 'ArrowUp') {
        if (isAtTop) {
            goToPrevPageFromEdge();
        } else {
            canvasWrapper.scrollBy({ top: -50, behavior: 'auto' });
        }
    }
});

let touchStartX = 0;
let touchEndX = 0;
let touchStartY = 0;
let touchCurrentY = 0;
let initialPinchDistance = null; // Added to track pinch-to-zoom distance

canvasWrapper.addEventListener('touchstart', e => {
    // Check for pinch-to-zoom gesture (2 fingers)
    if (e.touches.length === 2) {
        initialPinchDistance = Math.hypot(
            e.touches[0].clientX - e.touches[1].clientX,
            e.touches[0].clientY - e.touches[1].clientY
        );
        return;
    }

    // Single finger handling
    touchStartX = e.changedTouches[0].screenX;
    touchStartY = e.changedTouches[0].screenY;
    edgeScrollAccumulator = 0; 
}, { passive: false });

canvasWrapper.addEventListener('touchmove', e => {
    if (!pdfDoc || pageIsRendering || isPageTransitioning) return;
    
    // Handle pinch-to-zoom
    if (e.touches.length === 2 && initialPinchDistance !== null) {
        e.preventDefault(); // Prevent the native browser from zooming the entire webpage layout
        
        const currentDistance = Math.hypot(
            e.touches[0].clientX - e.touches[1].clientX,
            e.touches[0].clientY - e.touches[1].clientY
        );
        
        const diff = currentDistance - initialPinchDistance;
        const PINCH_THRESHOLD = 50; // The pixel distance needed to trigger a zoom step

        if (diff > PINCH_THRESHOLD) {
            onZoomIn();
            initialPinchDistance = currentDistance; // Reset baseline
        } else if (diff < -PINCH_THRESHOLD) {
            onZoomOut();
            initialPinchDistance = currentDistance; // Reset baseline
        }
        return;
    }

    // Handle edge scrolling (1 finger)
    if (e.touches.length === 1) {
        touchCurrentY = e.changedTouches[0].screenY;
        
        const isAtTop = canvasWrapper.scrollTop <= 2;
        const isAtBottom = Math.abs(canvasWrapper.scrollHeight - canvasWrapper.scrollTop - canvasWrapper.clientHeight) <= 2;
        
        const deltaY = touchStartY - touchCurrentY;

        if (deltaY < 0 && isAtTop && pageNum > 1) { 
            if (Math.abs(deltaY) > EDGE_THRESHOLD) {
                touchStartY = touchCurrentY; 
                goToPrevPageFromEdge();
            }
        } else if (deltaY > 0 && isAtBottom && pageNum < pdfDoc.numPages) { 
            if (Math.abs(deltaY) > EDGE_THRESHOLD) {
                touchStartY = touchCurrentY;
                goToNextPageFromEdge();
            }
        }
    }
}, { passive: false });

canvasWrapper.addEventListener('touchend', e => {
    // Reset pinch calculation if fingers are lifted
    if (e.touches.length < 2) {
        initialPinchDistance = null;
    }

    if (e.changedTouches.length > 0) {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }
}, { passive: true });

function handleSwipe() {
    const isAtLeft = canvasWrapper.scrollLeft <= 2;
    const isAtRight = Math.abs(canvasWrapper.scrollWidth - canvasWrapper.scrollLeft - canvasWrapper.clientWidth) <= 2;
    
    const swipeDistance = touchEndX - touchStartX;
    const threshold = 60; 
    
    if (swipeDistance < -threshold && isAtRight) {
        onNextPage(); 
    } else if (swipeDistance > threshold && isAtLeft) {
        onPrevPage(); 
    }
}

updateButtonStates();
