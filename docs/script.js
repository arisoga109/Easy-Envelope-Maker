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

    // กำหนดขนาดซองให้ถูกต้องเมื่อนำไปใช้ในหน้าจอสั่งพิมพ์
    let envelopeStyle = '';
    switch (envelopeSize) {
        case 'A4':
            envelopeStyle = 'width: 21cm; height: 29.7cm;';
            break;
        case 'C5':
            envelopeStyle = 'width: 16.2cm; height: 22.9cm;';
            break;
        case 'DL':
            envelopeStyle = 'width: 11cm; height: 22cm;';
            break;
        case 'Custom18-5x13':
            envelopeStyle = 'width: 18.5cm; height: 13cm;';
            break;
    }

    let printContentHTML = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Print</title>
            <style>
                @media print {
                    @page { margin: 0; size: auto; }
                    body { margin: 0; }
                    .envelope {
                        display: flex;
                        flex-direction: column;
                        justify-content: center; /* จัดให้อยู่กึ่งกลางในแนวตั้ง */
                        align-items: center;    /* จัดให้อยู่กึ่งกลางในแนวนอน */
                        text-align: center;
                        page-break-after: always;
                        ${envelopeStyle}
                        line-height: 2;
                        padding: 0;
                        box-sizing: border-box;
                        font-size: ${fontSize}px;
                        color: ${fontColor};
                        font-family: '${fontFamily}';
                    }
                    .envelope:last-child { page-break-after: avoid; }
                    .envelope p { margin: 0; }
                    .first-line-text { font-size: ${parseInt(fontSize) * 0.75}px; margin-bottom: 10px; }
                }
            </style>
        </head>
        <body>
    `;

    namesArray.forEach(name => {
        const envelopeDiv = `<div class="envelope">`;
        let contentHTML = '';
        if (firstLineText) {
            contentHTML += `<p class="first-line-text">${firstLineText}</p>`;
        }
        contentHTML += `<p>${name}</p>`;
        printContentHTML += `${envelopeDiv}${contentHTML}</div>`;
    });

    printContentHTML += `</body></html>`;
    
    printDoc.open();
    printDoc.write(printContentHTML);
    printDoc.close();

    printFrame.contentWindow.focus();
    printFrame.contentWindow.print();
});

window.onload = function() {
    getLocalFonts();
    updatePreview();
};