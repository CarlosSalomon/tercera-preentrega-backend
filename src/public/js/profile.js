

//Boton cambiar rol
const changeRole = document.querySelector("#changeRole");
changeRole.addEventListener("click", (e)=>{
  const uid = changeRole.dataset.userId;
  let rol = changeRole.dataset.userRol;
  console.log(uid)
  fetch(`/api/users/premium/${uid}`,{
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
   }) .then((result) => {
     if (result.status === 200) {
        let title;
        if(rol === "user"){
            title = "Ahora eres usuario Premium!!"
        }else{
            title = "Ya no eres usuario Premium."
        }
      Swal.fire({
        icon: "success",
        title: title,
        customClass: {
            title: 'titleSARol'
          },
        text: `En tu proximo ingreso, verás las modificaciones!`,
        width: 400,
      });
     }
     if(result.status === 404){
       Swal.fire({
         icon: "error",
         text: `Error al intentar modificar el rol de usuario.`,
         width: 400,
       });
     }
   });  
})

