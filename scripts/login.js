/* Evaluar si hay un token */
// const jwt = cargarToken();
const jwt = localStorage.getItem('jwt');


if(jwt){
    location.replace('/mis-tareas.html');
}

window.addEventListener('load', function () {
    /* ---------------------- obtenemos variables globales ---------------------- */
   const form = document.querySelector('form');
   const inputEmail = document.getElementById('inputEmail');
   const inputPassword = document.getElementById('inputPassword');
   let small = document.createElement('small');
   small.style.textAlign = 'center';
   small.innerHTML = '';
    
   const renderError = function(msg) {
    small.innerHTML = `${msg}`;
    form.insertAdjacentElement('beforeend', small);
    
   }



    /* -------------------------------------------------------------------------- */
    /*            FUNCIÓN 1: Escuchamos el submit y preparamos el envío           */
    /* -------------------------------------------------------------------------- */
    form.addEventListener('submit', (event) => {
        event.preventDefault();

        // const usuario = {
        //     email: normalizarEmail(inputEmail.value),
        //     password: inputPassword.value,
        // }
        const usuario = {
            email: inputEmail.value,
            password: inputPassword.value,
        }
        realizarLogin(usuario);
        // const mensajeError = validarLogin(usuario);
        // if(!mensajeError) { 
        //     console.log(usuario);
        //     const config = {
        //         method: 'POST',
        //         headers: {
        //             'Content-Type' : "application/json; charset=UTF-8"
        //         },
        //         body: JSON.stringify(usuario)
        //     }

        //     realizarLogin(config)
        // } else {
        //     console.log('NO HACEMOS EL LOGIN', mensajeError);
        // }
    });


    /* -------------------------------------------------------------------------- */
    /*                     FUNCIÓN 2: Realizar el login [POST]                    */
    /* -------------------------------------------------------------------------- */
    function realizarLogin(user) {
       const URL = 'https://ctd-todo-api.herokuapp.com/v1/users/login'

       const configuraciones = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
       };

       fetch(URL, configuraciones)
       .then( response => {
        console.log(response);
        if(!response.ok) {
            if(response.status === 400) {
                throw new Error(`${response.status} Contraseña Incorrecta `);
            }
            if(response.status === 404) {
                throw new Error(`${response.status} El usuario no existe`);
            }
            if(response.status === 500) {
                throw new Error(`${response.status} Error del servidor`);
            }
            
        }
        return response.json();
       })
       
       .then (response => {
        if(response.jwt) {
            localStorage.setItem("jwt", response.jwt);
            location.replace("/mis-tareas.html");
        }
        }) 
        .catch(err => {
            
            renderError(`🤡🤡 Error = ${err.message}<br> Intenta nuevamente`)
        })
        // .finally(() => {

        // })
    };


});