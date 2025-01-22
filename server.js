const express = require('express');
const fileUpload = require('express-fileupload');
const heicConvert = require('heic-convert');
const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');

const app = express();
const port = 3000;

// Middleware
app.use(fileUpload());
app.use(express.static('../frontend')); // Servir archivos estáticos de frontend

// Ruta para subir y convertir imágenes
app.post('/upload', async (req, res) => {
    console.log('Ruta /upload alcanzada');

    if (!req.files || !req.files.images) {
        return res.status(400).send('No se han subido imágenes.');
    }

    const images = Array.isArray(req.files.images) ? req.files.images : [req.files.images];
    const outputPaths = [];
    const pdfPath = path.join(__dirname, '../upload', `${Date.now()}_images.pdf`);
    const doc = new PDFDocument();

    // Crear el archivo PDF
    doc.pipe(fs.createWriteStream(pdfPath));

    // Define márgenes
    const margin = 10;
    const pageWidth = doc.page.width;
    const pageHeight = doc.page.height;
    const imageWidth = pageWidth - 2 * margin;
    const imageHeight = pageHeight - 2 * margin;

    try {
        for (let image of images) {
            let imageBuffer;

            // Si es HEIC, convertirlo a JPG
            if (image.mimetype === 'image/heic' || image.name.toLowerCase().endsWith('.heic')) {
                console.log('Convirtiendo imagen HEIC a JPG');
                imageBuffer = await heicConvert({
                    buffer: image.data,
                    format: 'JPEG',
                    quality: 1
                });
            } else {
                imageBuffer = image.data;
            }

            const outputFilePath = path.join(__dirname, '../upload', `${Date.now()}_converted.jpg`);
            fs.writeFileSync(outputFilePath, imageBuffer);
            outputPaths.push(outputFilePath);

            // Añadir imagen al PDF
            doc.image(outputFilePath, margin, margin, { fit: [imageWidth, imageHeight] });

            // Crear nueva página si no es la última imagen
            if (image !== images[images.length - 1]) {
                doc.addPage();
            }
        }

        doc.end(); // Finalizar el documento PDF

        // Enviar la URL del PDF generado
        res.json({
            pdf: `http://localhost:${port}/download/pdf/${path.basename(pdfPath)}`
        });
    } catch (error) {
        console.error('Error al convertir las imágenes:', error);
        res.status(500).send('Error en la conversión de las imágenes.');
    }
});

// Ruta para descargar el PDF
app.get('/download/pdf/:filename', (req, res) => {
    const filePath = path.join(__dirname, '../upload', req.params.filename);
    res.setHeader('Content-Disposition', 'attachment; filename=' + req.params.filename);
    res.download(filePath, (err) => {
        if (err) {
            console.error('Error al descargar el archivo PDF:', err);
            res.status(500).send('Error al descargar el archivo PDF.');
        }
    });
});

// Iniciar servidor
app.listen(port, 'localhost', () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});
