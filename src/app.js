
document.addEventListener('DOMContentLoaded', () => {
    const video = document.getElementById('video');
    const fullNameElement = document.getElementById('fullName');
    const addressElement = document.getElementById('address');
    const issuedElement = document.getElementById('issued');
    const expiresElement = document.getElementById('expires');

    // Check if the browser supports getUserMedia
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ video: true })
            .then((stream) => {
                video: {
                    width: { ideal: 1280 }
                    height: { ideal: 960 }
                }
                video.srcObject = stream;

                const captureButton = document.createElement('button');
                captureButton.textContent = 'Capture Image';
                captureButton.addEventListener('click', captureImage);
                document.body.appendChild(captureButton);
            })
            .catch((error) => {
                console.error('Error accessing webcam:', error);
            });
    } else {
        console.error('getUserMedia is not supported in this browser');
    }
    
    function captureImage() {

        if (typeof Tesseract === 'undefined') {
            console.error('Tesseract.js is not defined. Please make sure it is loaded.');
            return;
        }

        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        const imageData = context.getImageData(0, 0, canvas.width, canvas.height);

        const imageDataUrl = canvas.toDataURL('image/png');

        // Use Tesseract.js for OCR
        Tesseract.recognize(
            imageData,
            'eng', // language: English
            {
                logger: (info) => {
                    console.log(info);
                }
            }
        ).then(({ data: { text } }) => {
            // Extracted text contains the information, you may need to parse it accordingly
            console.log('OCR Result:', text);

            // Example: Parse the text and update UI
            const extractedData = parseExtractedText(text);
            updateUI(extractedData);
        });
    }

    function parseExtractedText(text) {
        const lines = text.split('\n');
    
        // Placeholder variables to store parsed data
        let fullName = '';
        let address = '';
        let issued = '';
        let expires = '';
    
        // Loop through each line and extract relevant information
        lines.forEach((line) => {
            // Check for patterns in the text and extract information accordingly
            if (line.includes('Name:')) {
                fullName = line.replace('Name:', '').trim();
            } else if (line.includes('Address:')) {
                address = line.replace('Address:', '').trim();
            } else if (line.includes('Issued:')) {
                issued = line.replace('Issued:', '').trim();
            } else if (line.includes('Expires:')) {
                expires = line.replace('Expires:', '').trim();
            }
        });
    
        // Return the parsed data as an object
        return {
            fullName,
            address,
            issued,
            expires
        };
    }
    

    function updateUI(data) {
        // Update the UI with the extracted information
        fullNameElement.textContent = `Full Name: ${data.fullName}`;
        addressElement.textContent = `Address: ${data.address}`;
        issuedElement.textContent = `Issuance Date: ${data.issued}`;
        expiresElement.textContent = `Expiration Date: ${data.expires}`;
    }
});
