buttonComvertirIMG = document.getElementById("convertirPDF");
contenedor = document.getElementById("input_imagen");
AlertNoImg = document.getElementById("AlertNoImg");
ImputVoid = document.getElementById("AlertImputVoid");
modal_close = document.getElementById("modal_close");

extensionValida = ['image/png', 'image/jpeg', 'image/heic','image/JPEG', 'image/HEIC',""];

buttonComvertirIMG.addEventListener('click', () => {

    ImputVoid.classList.remove('modal_show', 'modal_close'); // Limpiar alertas anteriores
    imputVoid(contenedor.files);
    
});

// Manejar el formulario de envío
document.getElementById('uploadForm').onsubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    // Obtener todas las imágenes seleccionadas
    const imageFiles = document.getElementById('input_imagen').files;

    AlertNoImg.classList.remove('modal_show', 'modal_close');


    
    if(comprobarImputImgONo(imageFiles) == true){
        // Mostrar barra de carga
         showLoadingBar();

            // Añadir todas las imágenes al FormData
            for (let i = 0; i < imageFiles.length; i++) {
                formData.append('images', imageFiles[i]);
             }

    


         

    try {
        await simulateProgress();

        const response = await fetch('http://localhost:3000/upload', {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            throw new Error('Error en la conversión de las imágenes');
        }

        const data = await response.json();

        // Mostrar enlaces para descargar la imagen convertida y el PDF
        document.getElementById('downloadLinks').innerHTML = `
            <a id="DescargarPDF" class="button is-focused is-centered enlace-descarga" href="${data.pdf}" download>Descargar PDF</a>
        `;

        //destruimos elemento
        document.getElementById('DescargarPDF').addEventListener('click', () => {
            // Eliminar el enlace después de 5 segundos
            setTimeout(() => {
                const link = document.getElementById('DescargarPDF');
                if (link) link.remove(); // Eliminar el enlace del DOM
            }, 5000); // 5000ms = 5 segundos
        });


       
    } catch (error) {
        console.error('Error:', error);
    } finally {
        hideLoadingBar();
    }
    

    contenedor.value = ''; // Limpiar input

}else{

    console.log("archivos no aptos, fin del programa")
} 
};

// Función para comprobar si el input tiene imágenes válidas
function comprobarImputImgONo(imput_array) {
    Array.from(imput_array).forEach(file => {
        console.log(file.name + " : " + file.type);  // Para ver el tipo MIME
    });

    if ( Array.from(imput_array).some(file => !extensionValida.includes(file.type))) {
        console.log("los archivos  no son imagenes");
        showModalAlert(AlertNoImg);
        return false;
      
    } else {
        console.log("Imágenes aceptadas");
        return true;
    }

   
}

function imputVoid(imput_array) {
console.log(imput_array)

    if (imput_array.length == 0) {
        console.log("Imput vacío sin ninguna imagen");
        showModalAlert(ImputVoid);
    } else {
        console.log("No vacío");
    }
}

// Mostrar alerta modal
function showModalAlert(modalAlert) {
    modalAlert.classList.add("modal_show");
}

// Ocultar alerta modal
function closeModalAlert(modalToClose) {
    modalToClose.classList.add("modal_close");
}

// Mostrar barra de carga
function showLoadingBar() {
    const loadingContainer = document.getElementById('loadingContainer');
    const loadingBar = document.getElementById('loadingBar');
    loadingContainer.classList.add('is-active');
    loadingBar.value = 0;
}

// Ocultar barra de carga
function hideLoadingBar() {
    const loadingContainer = document.getElementById('loadingContainer');
    loadingContainer.classList.remove('is-active');
}

// Simular el progreso de carga
function simulateProgress() {
    const loadingBar = document.getElementById('loadingBar');
    let progress = 0;

    return new Promise((resolve) => {
        const interval = setInterval(() => {
            progress += 25;
            loadingBar.value = progress;
            if (progress >= 100) {
                clearInterval(interval);
                resolve();
            }
        }, 500);
    });
}



//      errores







