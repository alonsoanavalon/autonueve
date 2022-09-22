((function(){

    /* document.querySelector("#pedidoForm > div.wrapperResults > table > tbody > tr") */
    let datos = document.querySelectorAll("#pedidoForm > div.wrapperResults > table > tbody > tr")
    let total = 0
    let shoppingCart = document.querySelector(".shopping-cart")
    let productosLen = window.localStorage.getItem("productos").split(",").length
    let formDataPedido;
    let pedidoForm = document.querySelector("#pedidoForm")
    let tableVenta = document.querySelector("#tableVenta")


    shoppingCart.innerHTML = productosLen
    datos.forEach(n => {
        num = parseInt(n.lastElementChild.innerHTML)
 
        if (num > 0) {
            total += num
        }
      


    })
    
    document.querySelector("#totalPrice").innerHTML = `<strong>${total}<strong>`
    /* document.querySelector("#totalPrice > input[type=text]").value = `<strong>${total}<strong>` */



    document.querySelector("#pedidoForm > div.client-data > div.wrap-empresa > div > input[type=radio]:nth-child(1)").addEventListener("click", e => {
        document.querySelector(".name").outerHTML = 
        `
        <div class="name">
        <label for="nombre">Empresa<span style="color:red; margin-left:5px;">*</span></label>
        <input type="text" name="nombre" id="inputNombre" required>
        </div>
         `
        document.querySelector(".surname").outerHTML = 
        `
        <div class="surname">
            <label for="giro">Giro empresa<span style="color:red; margin-left:5px;">*</span></label>
            <input type="text" name="giro" id="inputApellido" required>
        </div>
        `
    })

    document.querySelector("#pedidoForm > div.client-data > div.wrap-empresa > div > input[type=radio]:nth-child(3)").addEventListener("click", e => {
        document.querySelector(".name").outerHTML = 
        `
        <div class="name">
        <label for="nombre">Nombre<span style="color:red; margin-left:5px;">*</span></label>
        <input type="text" name="nombre" id="inputNombre" required>
        </div>
         `
        document.querySelector(".surname").outerHTML = 
        `
        
        <div class="surname">
        <label for="apellido">Apellido<span style="color:red; margin-left:5px;">*</span></label>
        <input type="text" name="apellido" id="inputApellido" required>
        </div>
        `

    })

    pedidoForm.addEventListener("submit", e => {
        e.preventDefault()
        formDataPedido = new FormData(pedidoForm)
        let listaproducto = window.localStorage.getItem("listaproducto").split(",")
        let idProductos = window.localStorage.getItem("productos").split(",")
        let nuevoObjeto = {}
        formDataPedido.append("productos", listaproducto)
        formDataPedido.append("idproductos", idProductos)

        for (element of formDataPedido.keys()) {
            nuevoObjeto[element] = formDataPedido.get(element)
        }

        const mailObject = {
            message: "Este es un mensaje enviado desde autonueve.cl",
            mail: formDataPedido.get('email'),
            subject: "[Pedido desde Autonueve.cl]",
            html: `<div>
            <h1 style="color:#4C6EA7">¡Felicidades, has generado exitosamente tu pedido en <a href="https://autonueve.cl">autonueve.cl</a>!</h1>
            <h3>Tienes <strong>24h</strong> para realizar el pago y envío de comprobantes</h3>
            <h2>Datos de transferencia</h2>
<table style="border: 1px solid #ccc; display:inline-block; padding:.5rem">

  <tr>
    <td>Nombre</td>
    <td>Jorge Urrutia</td>
  </tr>
  <tr>
    <td>Banco</td>
    <td>Banco de Chile</td>
  </tr>
  <tr>
    <td>Tipo de cuenta</td>
    <td>Cuenta corriente</td>
  </tr>
  <tr>
    <td>Numero de cuenta</td>
    <td>7011182291</td>
  </tr>
  <tr>
    <td>Correo</td>
    <td>ventasautonueve@gmail.com</td>
  </tr>
</table>

            


            </div>
            <br>
            <h2>Productos seleccionados</h2>
            <div id="table-wrapper"style="border: 1px solid #ccc; display:inline-block; padding:.5rem">
            ${tableVenta.outerHTML}
            </div>

            <p>Recuerda enviar un correo de confirmación con la foto de tu transferencia a <strong>ventasautonueve@gmail.com</strong></p>
            <p>¡Muchas gracias por tu preferencia!</p>
            <style>
            table {
              font-family: arial, sans-serif;
              border-collapse: collapse;
              width: 100%;
            }
            
            td, th {
              border: 1px solid #dddddd;
              text-align: left;
              padding: 8px;
            }
            
            tr:nth-child(even) {
              background-color: #dddddd;
            }
            </style>
           `
        }


        Promise.all([
            fetch("/venta", {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(nuevoObjeto)
            }),
            fetch("/mail/generar", {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(mailObject)

            })
        ])
        .catch(err => {console.log(err)})
        
        window.localStorage.removeItem('listaproducto')
        window.localStorage.removeItem('productos')
        window.location.href = '/success';
    })

})());