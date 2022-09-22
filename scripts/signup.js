window.addEventListener('load', function () {
    /* ---------------------- obtenemos variables globales ---------------------- */
   const form = document.querySelector('form');
   const nombre = document.querySelector('#inputNombre');
   const apellido = document.querySelector('#inputApellido');
   const emailUser = document.querySelector('#inputEmail');
   const contrasena = document.querySelector('#inputPassword');
   const repeatContrasena = document.querySelector('#inputPasswordRepetida');
   


    

    /* -------------------------------------------------------------------------- */
    /*            FUNCIÓN 1: Escuchamos el submit y preparamos el envío           */
    /* -------------------------------------------------------------------------- */
    form.addEventListener('submit', function (event) {
        event.preventDefault();

        if(contrasena.value === repeatContrasena.value) {
            const data = {
                firstName : nombre.value,
                lastName : apellido.value,
                email : emailUser.value,
                password : contrasena.value,
            }
            
            realizarRegister(data);
        }
        else {
            let html = `<span style.color='red'>La contraseña no coincide</span>`;
            repeatContrasena.insertAdjacentHTML('beforeend', html);
        }
       
        




    });

    /* -------------------------------------------------------------------------- */
    /*                    FUNCIÓN 2: Realizar el signup [POST]                    */
    /* -------------------------------------------------------------------------- */
    function realizarRegister(settings) {
        
        const apiURL = 'https://ctd-todo-api.herokuapp.com/v1/users';

        const configuraciones = {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(settings),
            
          };
        fetch(apiURL, configuraciones)
        .then(response => response.json())
        .then(response => {
            if(response.jwt) {
                localStorage.setItem('jwt', response.jwt);
                location.replace('/mis-tareas.html');
                console.log(response.jwt);
            }
            
        })




    };


});