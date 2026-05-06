$(document).ready(function() {
    let currentApp = ''; // 'doc', 'sheet', o 'slide'
    
    // --- UTILIDADES ---
    function showAlert(msg) {
        $('#alert-message').text(msg);
        $('#alert-modal').removeClass('hidden');
    }

    // --- NAVEGACIÓN PRINCIPAL ---
    function openApp(appType) {
        currentApp = appType;
        let targetId = 'view-' + appType;
        
        // Actualizar UI del Navbar y Views
        $('.view-content').addClass('hidden');
        $('#' + targetId).removeClass('hidden');
        $('#btn-back, #btn-export').removeClass('hidden');
        
        // Cambiar título y color
        let title = '';
        let colorClass = '';
        if(currentApp === 'doc') { title = 'Document'; colorClass = 'bg-blue-600'; }
        if(currentApp === 'sheet') { 
            title = 'Spreadsheet'; 
            colorClass = 'bg-green-600'; 
            if ($('#sheet-content tbody tr').length === 0) initSheet(); 
        }
        if(currentApp === 'slide') { title = 'Presentation'; colorClass = 'bg-red-600'; initSlides(); }
        
        $('#app-title').text(title);
        
        // Modificando las clases de Tailwind del nav
        $('nav').removeClass('bg-indigo-600 bg-blue-600 bg-green-600 bg-red-600 text-indigo-600').addClass(colorClass);
        $('#btn-export').removeClass('text-indigo-600 text-blue-600 text-green-600 text-red-600').addClass('text-' + colorClass.replace('bg-', ''));
    }

    $('.app-card').click(function() {
        openApp($(this).data('target'));
    });

    $('#btn-back').click(function() {
        $('.view-content').addClass('hidden');
        $('#view-dashboard').removeClass('hidden');
        $('#btn-back, #btn-export').addClass('hidden');
        $('#app-title').text('WebOffice Free');
        $('nav').removeClass('bg-blue-600 bg-green-600 bg-red-600').addClass('bg-indigo-600');
        currentApp = '';
    });

    // --- IMPORTACIÓN / CARGA DE ARCHIVOS ---
    $('#btn-import').click(function() {
        $('#file-import').click();
    });

    $('#file-import').change(function(e) {
        const file = e.target.files[0];
        if (!file) return;

        const ext = file.name.split('.').pop().toLowerCase();
        const reader = new FileReader();

        reader.onload = function(evt) {
            const text = evt.target.result;

            if (ext === 'txt') {
                $('#doc-content').html(`<p>${text.replace(/\n/g, '<br>')}</p>`);
                openApp('doc');
            } 
            else if (ext === 'html' || ext === 'doc') {
                const parser = new DOMParser();
                const doc = parser.parseFromString(text, 'text/html');
                // Extraer el contenido del body para limpiar tags de cabecera html
                $('#doc-content').html(doc.body.innerHTML || text);
                openApp('doc');
            } 
            else if (ext === 'csv') {
                // Importación rudimentaria de CSV
                const lines = text.split('\n').filter(l => l.trim() !== '');
                let cCount = 4;
                if(lines.length > 0) cCount = Math.max(4, lines[0].split(',').length);
                let rCount = Math.max(10, lines.length);
                
                renderEmptySheet(rCount, cCount);
                
                lines.forEach((line, r) => {
                    const cells = line.split(',');
                    cells.forEach((val, c) => {
                        if(c < cols) {
                            $(`#sheet-content tbody tr:eq(${r}) td:eq(${c+1})`).text(val.trim());
                        }
                    });
                });
                openApp('sheet');
            } 
            else if (ext === 'xls') {
                const parser = new DOMParser();
                const doc = parser.parseFromString(text, 'text/html');
                const table = doc.querySelector('table');
                
                if (table) {
                    const trs = Array.from(table.querySelectorAll('tr'));
                    let rCount = trs.length;
                    let cCount = 4;
                    if(trs.length > 0) {
                        cCount = Math.max(4, trs[0].querySelectorAll('td, th').length);
                    }
                    
                    renderEmptySheet(rCount, cCount);
                    
                    trs.forEach((tr, r) => {
                        const tds = tr.querySelectorAll('td'); // Como limpiamos los headers al exportar
                        tds.forEach((td, c) => {
                            if(c < cols) {
                                $(`#sheet-content tbody tr:eq(${r}) td:eq(${c+1})`).html(td.innerHTML);
                            }
                        });
                    });
                }
                openApp('sheet');
            }
        };

        // Formatos válidos que podemos leer vía texto en cliente puro
        if (['txt', 'html', 'doc', 'csv', 'xls'].includes(ext)) {
            reader.readAsText(file);
        } else {
            showAlert('File format not supported. Please select a .txt, .html, .doc, .csv, or .xls file.');
        }
        
        $(this).val(''); // Limpiar el input file
    });

    // --- FORMATO DE TEXTO GENERAL ---
    $('.format-btn').click(function(e) {
        e.preventDefault();
        const cmd = $(this).data('cmd');
        const val = $(this).data('val') || null;
        document.execCommand(cmd, false, val);
        
        // Mantener foco
        if(currentApp === 'doc') $('#doc-content').focus();
        if(currentApp === 'slide') $('#slide-content').focus();
    });

    $('#heading-select').change(function() {
        const val = $(this).val();
        document.execCommand('formatBlock', false, val);
        $('#doc-content').focus();
    });

    // --- LÓGICA DE HOJA DE CÁLCULO ---
    let cols = 4;
    let rows = 10;
    let focusedSheetCell = null;

    // Track focused cell for targeted deletion
    $(document).on('focus', '#sheet-content td[contenteditable="true"]', function() {
        focusedSheetCell = $(this);
    });
    
    function renderEmptySheet(rCount, cCount) {
        cols = cCount;
        rows = rCount;
        $('#sheet-content thead tr').empty().append('<th></th>');
        $('#sheet-content tbody').empty();
        
        for(let i=0; i<cols; i++) {
            $('#sheet-content thead tr').append(`<th>${getColName(i)}</th>`);
        }
        for(let i=1; i<=rows; i++) {
            addSheetRow(i);
        }
    }

    function initSheet() {
        if ($('#sheet-content tbody tr').length === 0) {
            renderEmptySheet(10, 4);
        }
    }

    function getColName(n) {
        let ordA = 'A'.charCodeAt(0);
        let ordZ = 'Z'.charCodeAt(0);
        let len = ordZ - ordA + 1;
        let s = "";
        while(n >= 0) {
            s = String.fromCharCode(n % len + ordA) + s;
            n = Math.floor(n / len) - 1;
        }
        return s;
    }

    function addSheetRow(index) {
        let tr = $('<tr></tr>');
        tr.append(`<td class="bg-gray-100 text-center text-gray-500 text-sm font-bold w-10 cursor-default select-none">${index}</td>`);
        for(let c=0; c<cols; c++) {
            tr.append(`<td contenteditable="true"></td>`);
        }
        $('#sheet-content tbody').append(tr);
    }

    $('#add-row').click(function() {
        rows++;
        addSheetRow(rows);
    });

    $('#add-col').click(function() {
        cols++;
        let colName = getColName(cols-1);
        $('#sheet-content thead tr').append(`<th>${colName}</th>`);
        $('#sheet-content tbody tr').each(function() {
            $(this).append(`<td contenteditable="true"></td>`);
        });
    });

    $('#del-row').click(function() {
        if ($('#sheet-content tbody tr').length <= 1) return; // Keep at least one row
        if (focusedSheetCell && focusedSheetCell.closest('table').attr('id') === 'sheet-content') {
            focusedSheetCell.closest('tr').remove();
            focusedSheetCell = null;
        } else {
            $('#sheet-content tbody tr:last-child').remove();
        }
        
        // Sync variable and Re-calculate row numbers
        rows = $('#sheet-content tbody tr').length;
        $('#sheet-content tbody tr').each(function(index) {
            $(this).find('td:first').text(index + 1);
        });
    });

    $('#del-col').click(function() {
        if (cols <= 1) return; // Keep at least one column
        let colIndexToRemove = cols; // Default to last column
        
        if (focusedSheetCell && focusedSheetCell.closest('table').attr('id') === 'sheet-content') {
            let cellIndex = focusedSheetCell.index();
            if (cellIndex > 0) { // Don't delete the row number column
                colIndexToRemove = cellIndex;
            }
            focusedSheetCell = null;
        }

        $('#sheet-content tr').each(function() {
            $(this).children().eq(colIndexToRemove).remove();
        });
        
        // Sync variable and Re-calculate headers
        cols = $('#sheet-content thead th').length - 1;
        $('#sheet-content thead th:not(:first-child)').each(function(index) {
            $(this).text(getColName(index));
        });
    });

    // --- LÓGICA DE PRESENTACIONES ---
    let slides = ["<h1>Presentation Title</h1><p>Subtitle or text</p>"];
    let currentSlideIdx = 0;

    function initSlides() {
        renderSlideThumbnails();
        loadSlide(0);
    }

    function renderSlideThumbnails() {
        $('#slide-thumbnails').empty();
        slides.forEach((_, index) => {
            let activeClass = index === currentSlideIdx ? 'border-red-500 bg-red-100' : 'border-gray-300 bg-white hover:bg-gray-100';
            let thumb = $(`
                <div class="cursor-pointer border-2 p-2 rounded text-center text-sm font-bold text-gray-600 min-w-[80px] md:min-w-0 transition ${activeClass}" data-idx="${index}">
                    ${index + 1}
                </div>
            `);
            thumb.click(function() {
                saveCurrentSlide();
                currentSlideIdx = $(this).data('idx');
                loadSlide(currentSlideIdx);
                renderSlideThumbnails();
            });
            $('#slide-thumbnails').append(thumb);
        });
    }

    function saveCurrentSlide() {
        slides[currentSlideIdx] = $('#slide-content').html();
    }

    function loadSlide(idx) {
        $('#slide-content').html(slides[idx]);
    }

    $('#add-slide').click(function() {
        saveCurrentSlide();
        slides.push("<h2>New Slide</h2><p>Text here...</p>");
        currentSlideIdx = slides.length - 1;
        loadSlide(currentSlideIdx);
        renderSlideThumbnails();
    });

    $('#del-slide').click(function() {
        if (slides.length <= 1) {
            // Temporarily show warning on the button
            let btn = $(this);
            let originalHTML = btn.html();
            btn.html('<i class="fas fa-exclamation-triangle"></i> Cannot delete last slide').addClass('bg-red-200 text-red-800');
            setTimeout(() => btn.html(originalHTML).removeClass('bg-red-200 text-red-800'), 2000);
            return;
        }
        slides.splice(currentSlideIdx, 1);
        currentSlideIdx = Math.max(0, currentSlideIdx - 1);
        loadSlide(currentSlideIdx);
        renderSlideThumbnails();
    });

    $('#slide-content').on('keyup', function() {
        saveCurrentSlide();
    });


    // --- EXPORTACIÓN DE ARCHIVOS ---
    $('#btn-export').click(function() {
        let content = '';
        let filename = '';
        let mimeType = '';

        if (currentApp === 'doc') {
            // Exportar Documento tipo Word (HTML con mime type específico)
            let docHTML = $('#doc-content').html();
            content = `
                <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">
                <head><meta charset="utf-8"><title>Document</title></head>
                <body>${docHTML}</body></html>
            `;
            filename = 'Document.doc';
            mimeType = 'application/msword';
        } 
        else if (currentApp === 'sheet') {
            // Exportar a Excel (Tabla HTML con mime type de excel)
            let sheetHTML = $('#sheet-content').clone();
            sheetHTML.find('td[contenteditable]').removeAttr('contenteditable');
            
            // SOLUCIÓN 1: Remover la cabecera (A, B, C...) y la primera columna (1, 2, 3...)
            sheetHTML.find('thead').remove();
            sheetHTML.find('tbody tr').each(function() {
                $(this).find('td:first').remove();
            });

            content = `
                <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
                <head><meta charset="utf-8"></head>
                <body>${sheetHTML.prop('outerHTML')}</body></html>
            `;
            filename = 'Spreadsheet.xls';
            mimeType = 'application/vnd.ms-excel';
        }
        else if (currentApp === 'slide') {
            // SOLUCIÓN 2: Exportar a PPTX real usando PptxGenJS y html2canvas
            saveCurrentSlide();
            
            let $btn = $(this);
            let originalBtnHTML = $btn.html();
            
            // Mostrar estado de carga ya que toma un par de segundos
            $btn.html('<i class="fas fa-spinner fa-spin mr-1"></i> Exporting...');
            $btn.prop('disabled', true);

            let pptx = new PptxGenJS();
            pptx.layout = 'LAYOUT_16x9';

            async function generatePPTX() {
                let originalIdx = currentSlideIdx;
                
                // Iterar y renderizar cada diapositiva
                for (let i = 0; i < slides.length; i++) {
                    loadSlide(i);
                    
                    // Pequeña pausa para asegurar que el DOM se actualizó visualmente
                    await new Promise(r => setTimeout(r, 100)); 
                    
                    let canvas = await html2canvas(document.querySelector("#slide-content"), {
                        scale: 2, // Mejor resolución
                        backgroundColor: "#ffffff",
                        useCORS: true
                    });
                    
                    let slide = pptx.addSlide();
                    let imgData = canvas.toDataURL("image/png");
                    slide.addImage({ data: imgData, x: 0, y: 0, w: '100%', h: '100%' });
                }
                
                // Restaurar a la diapositiva en la que estaba el usuario
                loadSlide(originalIdx);
                
                // Descargar el archivo PPTX
                pptx.writeFile({ fileName: "Presentation.pptx" }).then(() => {
                    $btn.html(originalBtnHTML);
                    $btn.prop('disabled', false);
                });
            }
            
            generatePPTX();
            return; // Retornamos para evitar ejecutar la descarga tradicional de Blob (solo para word/excel)
        }

        // Disparar descarga estándar (Word y Excel)
        let blob = new Blob(['\ufeff', content], { type: mimeType });
        let url = URL.createObjectURL(blob);
        let a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    });
});
