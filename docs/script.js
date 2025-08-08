function getLocalFonts() {
    const commonFonts = [
        "Arial", "Courier New", "Georgia", "Times New Roman", "Verdana",
        "Tahoma", "Helvetica", "Lucida Sans Unicode",
        "Anuphan", "Chakra Petch", "Kanit", "Sarabun", "Prompt"
    ];
    
    const fontList = document.getElementById('font-list');
    commonFonts.forEach(font => {
        const option = document.createElement('option');
        option.value = font;
        fontList.appendChild(option);
    });
}

function updatePreview() {
    const firstLineText = document.getElementById('first-line').value;
    const namesList = document.getElementById('names-list').value;
    const envelopeSize = document.getElementById('envelope-size').value;
    const fontSize = document.getElementById('font-size').value;
    const fontColor = document.getElementById('font-color').value;
    const fontFamily = document.getElementById('font-family').value;
    
    const livePreview = document.getElementById('live-preview');
    const previewFirstLine = document.getElementById('preview-first-line');
    const previewName = document.getElementById('preview-name');
    
    livePreview.className = `envelope ${envelopeSize}`;
    livePreview.style.fontSize = `${fontSize}px`;
    livePreview.style.color = fontColor;
    livePreview.style.fontFamily = fontFamily;

    previewFirstLine.innerText = firstLineText;
    const namesArray = namesList.split('\n').filter(name => name.trim() !== '');
    previewName.innerText = namesArray[0] || 'ชื่อผู้รับ';
}

document.getElementById('first-line').addEventListener('input', updatePreview);
document.getElementById('names-list').addEventListener('input', updatePreview);
document.getElementById('envelope-size').addEventListener('change', updatePreview);
document.getElementById('font-size').addEventListener('input', updatePreview);
document.getElementById('font-color').addEventListener('input', updatePreview);
document.getElementById('font-family').addEventListener('input', updatePreview);

document.getElementById('generateBtn').addEventListener('click', function() {
    const firstLineText = document.getElementById('first-line').value;
    const namesList = document.getElementById('names-list').value;
    const envelopeSize = document.getElementById('envelope-size').value;
    const fontSize = document.getElementById('font-size').value;
    const fontColor = document.getElementById('font-color').value;
    const fontFamily = document.getElementById('font-family').value;

    if (namesList.trim() === '') {
        alert('กรุณากรอกรายชื่อผู้รับอย่างน้อยหนึ่งชื่อ');
        return;
    }
    
    const namesArray = namesList.split('\n').filter(name => name.trim() !== '');
    
    const printFrame = document.getElementById('print-frame');
    const printDoc = printFrame.contentWindow.document;

    let envelopeStyles = '';
    switch (envelopeSize) {
        case 'A4':
            envelopeStyles = 'width: 21cm; height: 29.7cm;';
            break;
        case 'C5':
            envelopeStyles = 'width: 16.2cm; height: 22.9cm;';
            break;
        case 'DL':
            envelopeStyles = 'width: 11cm; height: 22cm;';
            break;
        case 'Custom18-5x13':
            envelopeStyles = 'width: 18.5cm; height: 13cm;';
            break;
    }

    let printCSS = `
        @page { margin: 0; }
        body { margin: 0; }
        .envelope {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            text-align: center;
            box-sizing: border-box;
            ${envelopeStyles}
            line-height: 2;
            padding: 20px;
            font-size: ${fontSize}px;
            color: ${fontColor};
            font-family: '${fontFamily}';
        }
        .envelope p { margin: 0; }
        .first-line-text { font-size: ${parseInt(fontSize) * 0.75}px; margin-bottom: 10px; }
    `;

    let printContentHTML = '';
    namesArray.forEach((name, index) => {
        let contentHTML = `<div class="envelope">`;
        if (firstLineText) {
            contentHTML += `<p class="first-line-text">${firstLineText}</p>`;
        }
        contentHTML += `<p>${name}</p></div>`;

        // เพิ่มคำสั่งแบ่งหน้าสำหรับทุกซองยกเว้นซองสุดท้าย
        if (index < namesArray.length - 1) {
            contentHTML += `<div style="page-break-after: always;"></div>`;
        }
        printContentHTML += contentHTML;
    });

    printDoc.open();
    printDoc.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Print</title>
            <style>${printCSS}</style>
        </head>
        <body>
            ${printContentHTML}
        </body>
        </html>
    `);
    printDoc.close();

    printFrame.contentWindow.focus();
    printFrame.contentWindow.print();
});

window.onload = function() {
    getLocalFonts();
    updatePreview();
};
