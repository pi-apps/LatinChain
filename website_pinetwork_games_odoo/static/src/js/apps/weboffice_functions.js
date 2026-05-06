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
        if(currentApp === 'slide') { 
            title = 'Presentation'; 
            colorClass = 'bg-red-600'; 
            // Inicializar miniaturas asegurando que pinte la que corresponde
            renderSlideThumbnails();
            loadSlide(currentSlideIdx);
        }
        
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
        $('#app-title').text('WebOffice (Testing Phase)');
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
        const isTextBased = ['txt', 'html'].includes(ext);
        const isSheet = ['csv', 'xls', 'xlsx'].includes(ext);
        const isWord = ['doc', 'docx'].includes(ext);
        const isPresentation = ['pptx'].includes(ext);

        if (!isTextBased && !isSheet && !isWord && !isPresentation) {
            showAlert('File format not supported.');
            $(this).val('');
            return;
        }

        const reader = new FileReader();

        reader.onload = function(evt) {
            const result = evt.target.result;

            if (ext === 'txt') {
                $('#doc-content').html(`<p>${result.replace(/\n/g, '<br>')}</p>`);
                openApp('doc');
            } 
            else if (ext === 'html') {
                const parser = new DOMParser();
                const doc = parser.parseFromString(result, 'text/html');
                $('#doc-content').html(doc.body.innerHTML || result);
                openApp('doc');
            } 
            else if (ext === 'docx') {
                // Utilizar Mammoth para leer archivos DOCX binarios
                mammoth.convertToHtml({arrayBuffer: result})
                    .then(function(res) {
                        $('#doc-content').html(res.value || '<p></p>');
                        openApp('doc');
                    })
                    .catch(function(err) {
                        showAlert('Error importing DOCX: ' + err.message);
                    });
            }
            else if (ext === 'doc') {
                const decoder = new TextDecoder('utf-8');
                const text = decoder.decode(result);
                if (text.includes('<html')) {
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(text, 'text/html');
                    $('#doc-content').html(doc.body.innerHTML || text);
                    openApp('doc');
                } else {
                    showAlert('Legacy binary .doc files are not fully supported. Please use .docx or .html');
                }
            }
            else if (isSheet) {
                // Utilizar SheetJS para procesar XLSX, XLS y CSV nativamente a partir del ArrayBuffer
                try {
                    const workbook = XLSX.read(result, {type: 'array'});
                    const firstSheetName = workbook.SheetNames[0];
                    const worksheet = workbook.Sheets[firstSheetName];
                    
                    // Convertir a matriz bidimensional (arreglo de arreglos)
                    const sheetData = XLSX.utils.sheet_to_json(worksheet, {header: 1});
                    
                    let rCount = Math.max(10, sheetData.length);
                    let cCount = 4;
                    
                    // Encontrar la fila más larga para columnas
                    sheetData.forEach(row => {
                        if (row.length > cCount) cCount = row.length;
                    });
                    
                    renderEmptySheet(rCount, cCount);
                    
                    // Poblar la tabla visual
                    sheetData.forEach((row, r) => {
                        row.forEach((val, c) => {
                            if(val !== undefined && val !== null && c < cols) {
                                $(`#sheet-content tbody tr:eq(${r}) td:eq(${c+1})`).text(val);
                            }
                        });
                    });
                    openApp('sheet');
                } catch (e) {
                    showAlert('Error importing spreadsheet: ' + e.message);
                }
            }
            else if (ext === 'pptx') {
                // Importación de texto de PPTX desempaquetando el ZIP XML nativo
                JSZip.loadAsync(result).then(function(zip) {
                    let slidePromises = [];
                    
                    // Buscar todos los XML de las diapositivas (slide1.xml, slide2.xml...)
                    let slideFiles = Object.keys(zip.files).filter(fileName => /^ppt\/slides\/slide\d+\.xml$/.test(fileName));
                    
                    // Ordenar alfabéticamente/numéricamente
                    slideFiles.sort((a, b) => {
                        let numA = parseInt(a.match(/slide(\d+)\.xml/)[1]);
                        let numB = parseInt(b.match(/slide(\d+)\.xml/)[1]);
                        return numA - numB;
                    });

                    if (slideFiles.length === 0) {
                        showAlert('No slides found in this PPTX.');
                        return;
                    }

                    // Leer el contenido XML de cada archivo asíncronamente
                    slideFiles.forEach(fileName => {
                        slidePromises.push(zip.files[fileName].async("string"));
                    });

                    Promise.all(slidePromises).then(function(slideContents) {
                        slides = []; // Limpiar las diapos previas
                        
                        slideContents.forEach(content => {
                            let textBlocks = [];
                            // Parsear el XML con Regex para buscar texto en las etiquetas <a:t>
                            let regex = /<a:t[^>]*>([\s\S]*?)<\/a:t>/g;
                            let match;
                            while ((match = regex.exec(content)) !== null) {
                                let text = match[1].trim();
                                if (text !== "") {
                                    textBlocks.push(text);
                                }
                            }
                            
                            let slideHtml = '';
                            if (textBlocks.length > 0) {
                                slideHtml += `<h1>${textBlocks[0]}</h1>`;
                                for(let i=1; i<textBlocks.length; i++) {
                                    slideHtml += `<p>${textBlocks[i]}</p>`;
                                }
                            } else {
                                slideHtml = '<h2 class="text-gray-400 italic">[Slide with Images / No Text]</h2>';
                            }
                            slides.push(slideHtml);
                        });
                        
                        currentSlideIdx = 0;
                        openApp('slide');
                        showAlert('PPTX Loaded! Note: Only text is extracted. Layouts, shapes, and images are ignored to keep the app lightweight client-side. (PPTX exported directly by this app are saved as images and cannot be text-edited).');
                    }).catch(function(e) {
                        showAlert('Error reading slide data: ' + e.message);
                    });
                }).catch(function(e) {
                    showAlert('Error unzipping PPTX format: ' + e.message);
                });
            }
        };

        // Lectura inteligente dependiendo del tipo de archivo
        if (isTextBased) {
            reader.readAsText(file);
        } else {
            // Archivos Word, Excel y PPTX requieren leerse como ArrayBuffer (Binario)
            reader.readAsArrayBuffer(file);
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
        // Prevenir sobre-escritura si ya se cargaron slides (como por el import)
        if (slides.length === 0) {
            slides = ["<h1>Presentation Title</h1><p>Subtitle or text</p>"];
        }
        renderSlideThumbnails();
        loadSlide(currentSlideIdx);
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
        if (slides[idx] !== undefined) {
            $('#slide-content').html(slides[idx]);
        }
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
        let currentAppId = currentApp;

        if (currentAppId === 'doc') {
            // Exportar a DOCX real nativo usando docx.js
            let $btn = $(this);
            let originalBtnHTML = $btn.html();
            $btn.html('<i class="fas fa-spinner fa-spin mr-1"></i> Exporting...');
            $btn.prop('disabled', true);

            try {
                const { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } = docx;
                const paragraphs = [];

                // Función recursiva para leer formato HTML a formato DOCX
                function parseNode(node, formatting) {
                    let runs = [];
                    node.childNodes.forEach(child => {
                        if (child.nodeType === 3) { // Nodo de texto
                            let text = child.textContent.replace(/[\n\r]/g, '');
                            if (text) {
                                 runs.push(new TextRun({
                                     text: text,
                                     bold: formatting.bold,
                                     italics: formatting.italics,
                                     underline: formatting.underline ? { type: "single" } : undefined
                                 }));
                            }
                        } else if (child.nodeType === 1) { // Nodo de elemento
                            let tag = child.tagName.toLowerCase();
                            if (tag === 'br') {
                                runs.push(new TextRun({ break: 1 }));
                            } else {
                                let newFormatting = { ...formatting };
                                if (tag === 'b' || tag === 'strong') newFormatting.bold = true;
                                if (tag === 'i' || tag === 'em') newFormatting.italics = true;
                                if (tag === 'u') newFormatting.underline = true;
                                runs = runs.concat(parseNode(child, newFormatting));
                            }
                        }
                    });
                    return runs;
                }

                // Iterar sobre los elementos principales del editor
                $('#doc-content').contents().each(function() {
                    if (this.nodeType === 3) { 
                        let text = this.textContent.trim();
                        if (text) paragraphs.push(new Paragraph({ children: [new TextRun(text)] }));
                        return;
                    }
                    
                    let tag = $(this).prop("tagName").toLowerCase();
                    let runs = parseNode(this, {bold: false, italics: false, underline: false});
                    
                    if (runs.length === 0) runs.push(new TextRun(""));
                    
                    let pAttrs = { children: runs };
                    
                    // Alineación
                    let align = $(this).css('text-align');
                    if (align === 'center') pAttrs.alignment = AlignmentType.CENTER;
                    else if (align === 'right') pAttrs.alignment = AlignmentType.RIGHT;
                    else if (align === 'justify') pAttrs.alignment = AlignmentType.JUSTIFIED;

                    if (tag === 'h1') { pAttrs.heading = HeadingLevel.HEADING_1; paragraphs.push(new Paragraph(pAttrs)); }
                    else if (tag === 'h2') { pAttrs.heading = HeadingLevel.HEADING_2; paragraphs.push(new Paragraph(pAttrs)); }
                    else if (tag === 'h3') { pAttrs.heading = HeadingLevel.HEADING_3; paragraphs.push(new Paragraph(pAttrs)); }
                    else if (tag === 'ul' || tag === 'ol') {
                        $(this).children('li').each(function() {
                            let liRuns = parseNode(this, {bold: false, italics: false, underline: false});
                            if (liRuns.length === 0) liRuns.push(new TextRun(""));
                            paragraphs.push(new Paragraph({
                                children: liRuns,
                                bullet: tag === 'ul' ? { level: 0 } : undefined,
                                numbering: tag === 'ol' ? { reference: "numRef", level: 0 } : undefined
                            }));
                        });
                    }
                    else {
                        paragraphs.push(new Paragraph(pAttrs));
                    }
                });

                const doc = new Document({
                    sections: [{
                        properties: {},
                        children: paragraphs
                    }],
                    numbering: {
                        config: [
                            {
                                reference: "numRef",
                                levels: [
                                    {
                                        level: 0,
                                        format: "decimal",
                                        text: "%1.",
                                        alignment: "start",
                                        style: { paragraph: { indent: { left: 720, hanging: 360 } } }
                                    }
                                ]
                            }
                        ]
                    }
                });

                Packer.toBase64String(doc).then((base64Data) => {
                    let dataUri = 'data:application/vnd.openxmlformats-officedocument.wordprocessingml.document;base64,' + base64Data;
                    let a = document.createElement('a');
                    a.href = dataUri;
                    a.download = 'Document.docx';
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    
                    $btn.html(originalBtnHTML);
                    $btn.prop('disabled', false);
                });

            } catch (err) {
                showAlert("Error generating DOCX: " + err.message);
                $btn.html(originalBtnHTML);
                $btn.prop('disabled', false);
            }
        } 
        else if (currentAppId === 'sheet') {
            // Exportar a XLSX real usando SheetJS
            let sheetHTML = $('#sheet-content').clone();
            sheetHTML.find('td[contenteditable]').removeAttr('contenteditable');
            
            // Remover la cabecera (A, B, C...) y la primera columna (1, 2, 3...)
            sheetHTML.find('thead').remove();
            sheetHTML.find('tbody tr').each(function() {
                $(this).find('td:first').remove();
            });

            // Generar libro de Excel desde la tabla HTML limpia
            let wb = XLSX.utils.table_to_book(sheetHTML[0]);
            
            // Escribir el archivo a base64
            let base64Data = XLSX.write(wb, { bookType: 'xlsx', type: 'base64' });
            let dataUri = 'data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,' + base64Data;
            
            // Descargar en Pi Browser vía Data URI
            let a = document.createElement('a');
            a.href = dataUri;
            a.download = 'Spreadsheet.xlsx';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        }
        else if (currentAppId === 'slide') {
            // Exportar a PPTX real usando PptxGenJS y html2canvas
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
                
                // FIX PI BROWSER: Forzar salida de PPTX a Base64 en vez de Blob
                pptx.write('base64').then((base64Data) => {
                    let dataUri = 'data:application/vnd.openxmlformats-officedocument.presentationml.presentation;base64,' + base64Data;
                    
                    let a = document.createElement('a');
                    a.href = dataUri;
                    a.download = 'Presentation.pptx';
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    
                    $btn.html(originalBtnHTML);
                    $btn.prop('disabled', false);
                }).catch((err) => {
                    showAlert("Error saving presentation: " + err);
                    $btn.html(originalBtnHTML);
                    $btn.prop('disabled', false);
                });
            }
            
            generatePPTX();
        }
    });
});
