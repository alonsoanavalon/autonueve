const router = require('express').Router()
const comunaService = require('../api/comuna/comuna.service')
const regionService = require('../api/region/region.service')
const tipoDocumentoService = require('../api/tipodocumento/tipodocumento.service')
const metodoEntregaService = require('../api/metodoentrega/metodoentrega.service')
const metodoPagoService = require('../api/metodopago/metodopago.service')
const productoService = require('../api/producto/producto.service')
const mysqlConnection = require('../database/database')



router.post('/', async (req, res) => {
    res.send("POST/")
})

router.get('/', async (req, res) =>  {

    // ahora estoy renderizando si esque viene algo en el params (ya que lo estoy borrando)
    // en realidad creo que debería hacer la petición considerando lo que esta en el dom ya ir
    // a buscar el id y la cantidad al formulario y usar eso
    if (Object.entries(req.query).length > 0) {
        const parseandoItems = req.query.items.replace("[", "")
        const productos = parseandoItems.replace("]", "").split(",")
    
        const parseandoCantidades = req.query.amounts.replace("[","");
        const cantidades = parseandoCantidades.replace("]","").split(",");
        const listaProductos = await productoService.getProductsAmountsByIds(productos, cantidades)
    
    
        await Promise.all([
            comunaService.getAllComuna(),
            regionService.getAllRegion(),
            tipoDocumentoService.getAllTipoDocumento(),
            metodoEntregaService.getAllMetodoEntrega(),
            metodoPagoService.getAllMetodoPago()
        ])
        .then(values => {
            res.render("pedido", {
                listaProductos,
                comunas: values[0],
                regiones: values[1],
                documentos: values[2],
                entregas: values[3],
                pagos: values[4]
            })
        })
        .catch(
            error => {
                console.error(error);
                res.send(error)
            }
        )
    } else {
        mysqlConnection.query("SELECT * FROM marca", (err, results, row) => {
            if (results !== undefined) {
                results=JSON.parse(JSON.stringify(results))
                resultados = results
                mysqlConnection.query(`SELECT * FROM producto ORDER BY id DESC LIMIT 12;`, (err, results, rows) => {

                    lastProducts = results
    
                    res.render('index', {
                        resultados,
                        lastProducts
                    })
                })
            }
        
    
    })
    }
    
})

module.exports = router;