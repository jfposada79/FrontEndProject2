// SEGURIDAD: Si no se encuentra en localStorage info del usuario
// no lo deja acceder a la página, redirigiendo al login inmediatamente.


const jwt = localStorage.getItem("jwt");


if(!jwt) {
  location.replace('/');
}

/* ------ comienzan las funcionalidades una vez que carga el documento ------ */
 window.addEventListener('load', function () {
 
  /* ---------------- variables globales y llamado a funciones ---------------- */
  urlTasks = 'https://ctd-todo-api.herokuapp.com/v1/tasks';
  const btnCerrarSesion = document.querySelector('#closeApp');
  const formCrearTarea = document.querySelector('.nueva-tarea');
  const inputTask = document.querySelector('#nuevaTarea');
  const ulPending = document.querySelector('.tareas-pendientes');
  const ulCompleted = document.querySelector('.tareas-terminadas');
  const cantCompleted = this.document.querySelector('#cantidad-finalizadas');
  let h2 = '';
  const divName = document.querySelector('.user-info p');
  
  

  obtenerNombreUsuario();
  
  consultarTareas();

  

  
  

  /* -------------------------------------------------------------------------- */
  /*                          FUNCIÓN 1 - Cerrar sesión                         */
  /* -------------------------------------------------------------------------- */

  btnCerrarSesion.addEventListener('click', function () {
    Swal.fire({
      title: 'Desea cerrar sesión?',
      // text: "You won't be able to revert this!",
      // icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3333FF',
      cancelButtonColor: '#d33',
      confirmButtonText: 'SI',
      cancelButtonText: "Mmm... mejor no",
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem('jwt');
        location.replace('./');
        // Swal.fire(
        //   'Deleted!',
        //   'Your file has been deleted.',
        //   'success'
        // )
      }
    })
    // const confirmacionCerrarSesion = confirm('Desea cerrar sesión?')
    // if(confirmacionCerrarSesion) {
    //   localStorage.removeItem('jwt');
    //   location.replace('./');
    // }
   

    

   });

  /* -------------------------------------------------------------------------- */
  /*                 FUNCIÓN 2 - Obtener nombre de usuario [GET]                */
  /* -------------------------------------------------------------------------- */

  function obtenerNombreUsuario() {
    urlAPI = 'https://ctd-todo-api.herokuapp.com/v1/users/getMe';
      configuraciones = {
        method: "GET",
        headers: {
          authorization: jwt
        },
    
  };

   fetch(urlAPI, configuraciones)
   .then( response => {
    
    return response.json()
   } )
   .then(data => {
      let userName = data.firstName;
      divName.textContent = userName;
      
   } )



  };


  /* -------------------------------------------------------------------------- */
  /*                 FUNCIÓN 3 - Obtener listado de tareas [GET]                */
  /* -------------------------------------------------------------------------- */

  function consultarTareas() {
    
    const configuraciones = {
      method: "GET",
      headers: {
        authorization: jwt
      },
      
    };
  
     fetch(urlTasks, configuraciones)
     .then(response => {
      return response.json();
     })
     .then(data =>  {
      
      
      renderizarTareas(data);

    })



  };


  /* -------------------------------------------------------------------------- */
  /*                    FUNCIÓN 4 - Crear nueva tarea [POST]                    */
  /* -------------------------------------------------------------------------- */

  formCrearTarea.addEventListener('submit', e => {
    e.preventDefault();

    if(inputTask.value) {
      const newTask = {
        "description": inputTask.value,
        "completed": false
      }
      const configuraciones = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: jwt
        },
        body: JSON.stringify(newTask)
      
      };
      
  
      fetch(urlTasks, configuraciones)
      .then(response => {
        
        return response.json()
      })
      .then(data => {
        
        
        consultarTareas();
      })
      
      
      

    } else {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'No se puede crear una tarea sin descripción!',
        
      })
      
    }
    inputTask.value = '';
 });


  /* -------------------------------------------------------------------------- */
  /*                  FUNCIÓN 5 - Renderizar tareas en pantalla                 */
  /* -------------------------------------------------------------------------- */
  function renderizarTareas(tasks) {
    
    getCompletedTaksNumber(tasks)
    
    
    ulPending.innerHTML = '';
    ulCompleted.innerHTML = '';
    
    
    tasks.forEach(task => {
      let dateTask = getDate(task.createdAt);
      if(!task.completed) {
        const template = `
          <li class='tarea'>
                <button class="change" id="${task.id}">
                  <i class="fa-regular fa-circle"></i>
                </button>
                <div class="descripcion">
                  <p class="nombre">${task.description}</p>
                  <p class="timestamp">Creada el: ${dateTask}</p>
                  <button class="borrar" id="${task.id}">
                      <i class="fa-regular fa-trash-can" id="${task.id}"></i>
                  </button>
                </div>
          </li>`
        ulPending.insertAdjacentHTML('afterbegin', template)
        botonesCambioEstado();
        botonBorrarTarea();
        
      } else {
        const template = `
          <li class='tarea'>
                <div class="hecha" id="">
                  <i class="fa-regular fa-circle-check"></i>
                </div>
                <div class="descripcion">
                  <p class="nombre">${task.description}</p>
                  <p class="timestamp">Creada el: ${dateTask}</p>
                  <div clase="cambios-estados">
                    <button class="incompleta" id="${task.id}">
                      <i class="fa-solid fa-rotate-left" id="${task.id}"></i>
                    </button>
                    <button class="borrar" id="${task.id}">
                      <i class="fa-regular fa-trash-can" id="${task.id}"></i>
                    </button>
                  </div>
                </div>
          </li>`
          ulCompleted.insertAdjacentHTML('afterbegin', template);
          botonBorrarTarea();
          underCompleted();
      } 
      
      
    })  
    
   

  };

  /* -------------------------------------------------------------------------- */
  /*                  FUNCIÓN 6 - Cambiar estado de tarea [PUT]                 */
  /* -------------------------------------------------------------------------- */
  function botonesCambioEstado() {
    let task = document.querySelector('.change');
    task.addEventListener('click', (e) => {
      
      ulrPut = `https://ctd-todo-api.herokuapp.com/v1/tasks/${e.target.id}`;

      const changeStatus = {
        // "description": 'description',
        "completed": true
      }
      const configuraciones = {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          authorization: jwt
        },
        body: JSON.stringify(changeStatus)
      
      };

      fetch(ulrPut, configuraciones)
      .then(response => {
        return response.json()
      })
      .then(data => {
        consultarTareas();
        
        
      })
    })
    



  }


  /* -------------------------------------------------------------------------- */
  /*                     FUNCIÓN 7 - Eliminar tarea [DELETE]                    */
  /* -------------------------------------------------------------------------- */
  function botonBorrarTarea() {
   let deleteBtn = document.querySelector(`.borrar`);
 
   deleteBtn.addEventListener('click', (e) => {
    
    ulrPut = `https://ctd-todo-api.herokuapp.com/v1/tasks/${e.target.id}`;

    Swal.fire({
      title: 'Está seguro que desea eliminar la tarea?',
      text: "No podrás deshacer este paso...!",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3333FF',
      cancelButtonColor: '#d33',
      confirmButtonText: '¡Adelante!',
      cancelButtonText: "Mmm... mejor no"
    }).then((result) => {
      if (result.isConfirmed) {
        const changeStatus = {
          // "description": 'description',
          // "completed": true
        }
        const configuraciones = {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            authorization: jwt
          },
          body: JSON.stringify(changeStatus)
        
        };
  
        fetch(ulrPut, configuraciones)
        .then(response => {
          return response.json()
        })
        .then(data => {
          consultarTareas();
          
          
        })
        Swal.fire(
          'Hecho!',
          'Tarea borrada exitosamente.',
          'success'
        )
      }
    })

      
   })
    

    

  };

  function getDate(date) {
    const dateTask = new Date(date);
    let day = dateTask.getDate();
    let month = +(dateTask.getMonth()) + 1;
    day = day < 10 ? "0" + day : day;
    month = month < 10 ? "0" + month : month;
    return day + "/" + month + "/" + dateTask.getFullYear();
  }

  function getCompletedTaksNumber(listado) {
    let count = 0;
    listado.forEach(task => {
      if(task.completed === true) {
        count++;
      } return count
    }) 
    cantCompleted.textContent = count;
    
    
    
  }

  function underCompleted() {
    let underBtn = document.querySelector('.incompleta');
    underBtn.addEventListener('click', e => {
      
      ulrPut = `https://ctd-todo-api.herokuapp.com/v1/tasks/${e.target.id}`;

      const changeStatus = {
        // "description": 'description',
        "completed": false
      }
      const configuraciones = {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          authorization: jwt
        },
        body: JSON.stringify(changeStatus)
      
      };

      fetch(ulrPut, configuraciones)
      .then(response => {
        return response.json()
      })
      .then(data => {
        consultarTareas();
        
        
      })

    })
  }

});
