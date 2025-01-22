

  var dropArea = document.getElementById('drop-area');
  var imagePreview = document.getElementById('image-preview');
  var fileInput = document.getElementById('input_imagen');
  var cerrar=document.getElementById('close')
  var  modal=document.getElementById('myModal')

  var input=document.getElementById('input_imagen')






// Permitir clic en cualquier parte del área de drop
dropArea.addEventListener('click', function(event) {
    fileInput.click();
  });





  dropArea.addEventListener('dragover', function(event) {
    event.preventDefault();
    dropArea.style.backgroundColor = '#f0f0f0';
  });

  dropArea.addEventListener('dragleave', function(event) {
    event.preventDefault();
    dropArea.style.backgroundColor = '';
  });

  dropArea.addEventListener('drop', function(event) {
    event.preventDefault();
    dropArea.style.backgroundColor = '';

    var files = event.dataTransfer.files;
    handleFiles(files);
  });

  fileInput.addEventListener('change', function(event) {
    var files = event.target.files;
    handleFiles(files);
  });


  //adaptarlo para que lo haga con la imagen recortada 
  function handleFiles(files) {
    imagePreview.innerHTML = '';
    for (var i = 0; i < files.length; i++) {
      var file = files[i];
      if (file.type.startsWith('image/')) {
        var img = document.createElement('img');
        img.src = URL.createObjectURL(file);
        img.width = 100;
        img.height = 100;
        imagePreview.appendChild(img);
      }
    }
  }




  //cerrar el modal


cerrar.addEventListener('click',function(event){

  modal.style.display='none'

  input.value="";



})

prueba.addEventListener('click', function(event){

  modal.style.display='block'
  })
