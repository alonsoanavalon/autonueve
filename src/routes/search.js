const router = require('express').Router()
const mysqlConnection = require('../database/database')

/* Variables para rescatar los resultados en un array de arrays */
let lenResults = 0;
let contadorPagina = 1;
let contadorResultado = 0;
/* Lista que sera impresa en la vista */
let listaNueva = []
/* Lista que se itera SI se entra a los IF (es pag 1, listaNueva esta vacia, que los listasubmodeloid sean dif) */
let listaLocal = []
/* Cuenta cada vuelta, y se resetea cada 10 o cada lo que le pida, esto sirve para ir creando distintos arrays */
let contadorVuelta = 0
/* Este contador sirve para saber cuando estaremos con los items "restantes", los que no calzen justo. Si la diferencia entre la suma total de resultados - el contador, es menos de los 10 que pido, comienzo a obtener la listaResto */
let contadorItem = 0
let listaResto = []

/* Sirve para saber en que página estamos */
let page = 0
/* Esto sirve para ir buscando como puntero los arrays correctos. obtiene su numero en base a la pagina - 1*/
let posicionArrayProductos = 0

let idListaSubmodeloPasada = 0

let nextPage;
let previousPage;
let $anyoName;
let $anyoId;
let $submodeloId;
let $listaSubmodeloId

router.get('/', (req, res) => {

    
    console.log(req.query)
    $submodeloId = req.query.submodel
    $anyoName = req.query.year
    page = req.query.page
    posicionArrayProductos = parseInt(page) - 1
    console.log("Estamos en la página ", page)

      mysqlConnection.query(`SELECT id FROM fabricacion WHERE fecha = ${$anyoName}`, (err, results) => {
        
        $anyoId = results[0]['id']
        console.log($anyoId, " = id del año que buscamos")


        mysqlConnection.query("SELECT * FROM marca", (err, results) => {
            let brandResults = results;

             mysqlConnection.query(`SELECT listasubmodelo.id FROM listasubmodelo INNER JOIN submodelo ON submodelo.id = listasubmodelo.submodelo_id INNER JOIN fabricacion ON fabricacion.id = listasubmodelo.fabricacion_id WHERE submodelo.id = ${$submodeloId} AND fabricacion.id = ${$anyoId};`, (err, results, rows) => {
                
                console.log(`SELECT listasubmodelo.id FROM listasubmodelo INNER JOIN submodelo ON submodelo.id = listasubmodelo.submodelo_id INNER JOIN fabricacion ON fabricacion.id = listasubmodelo.fabricacion_id WHERE submodelo.id = ${$submodeloId} AND fabricacion.id = ${$anyoId}`)


                console.log(results, "resultados")
                console.log(results[0], "results[0]")
                console.log(results.length, "lengthresults")
                
                if (results[0] == undefined || results.length == 0) {
                    console.log("UNDEFINEDDDDDDDDDDDD ")
                    res.render("search")
                } else {

                    
                    console.log("Lista submodelo IDDDDDDDDDDDD", $listaSubmodeloId)
                    $listaSubmodeloId = results[0]['id']
            
    
            
                    mysqlConnection.query(`SELECT producto.id, producto.imagen, producto.precio, producto.nombre, producto.SKU, producto.marca FROM listaproducto INNER JOIN producto ON producto.id = listaproducto.producto_id
                    INNER JOIN listasubmodelo ON listasubmodelo.id = listaproducto.listasubmodelo_id WHERE listasubmodelo.id = ${$listaSubmodeloId};`, (err, results, rows) => {
            
            
                            
                        results=JSON.parse(JSON.stringify(results))
            
                        /* Acá debería hacer una consulta WHERE tipoproducto = 1 (que seria universal) traeme todo
                        y se suma a results */
            
                        if (/* parseInt(page) == 1 */ /* && listaNueva[0] == undefined */  $listaSubmodeloId != idListaSubmodeloPasada) {
                            console.log("************!*!*!*!*!*!*!*!*!********************************************!*!*!*!*!*!*!*!*****************************!*!*!*!*!*!")
                            /* Acá sacamos la diferencia entre los resultados y 10 */
                            lenResults = (results.length)
                            let resto = lenResults % 12
                            contadorPagina = 1;
                            contadorResultado = 0;
                            listaNueva = []
                            listaLocal = []
                            listaResto = []
                            contadorItem = 0
                            contadorVuelta = 0
                            idListaSubmodeloPasada = $listaSubmodeloId
                      
                
                            results.forEach(n => {
                                contadorResultado++
                                if (contadorPagina == 1){
                                    if (contadorResultado == 13) {
                                        contadorPagina += 1
                                        contadorResultado = 0
                         
                                    }
                                } else {
                                    if (contadorResultado == 12) {
                                        contadorPagina += 1
                                        contadorResultado = 0
                                    }
                                }
                            })
                            /* Cada item es guardado en la lista local, esta almacenará hasta 10 datos por vuelta
                            y una vez alcance los 10 resultados, los agregará a la lista final y reseteará los contadores
                            y la lista local, para la proxima vuelta empezar de 0 añadiendo items en una nueva lista local,
                            en caso de que existan mas de 10 items restantes. En caso contrario entrará en los últimos */
                            results.forEach(n => {
                    
                                listaLocal.push(n)
                                contadorItem += 1
                                contadorVuelta += 1
                            
                            
                                //console.log(`Resto = ${resto}, listaObj ${lenResults} - contadorItem ${contadorItem} == ${lenResults - contadorItem}`)
                            
                                if (contadorVuelta == 12) {
                                    listaNueva.push(listaLocal)
                                    contadorVuelta = 0
                                    listaLocal = []
                                }
                            /* Si la diferencia entre el contador y el total, es menor al resto, entramos en los ultimos */
                                if (lenResults - contadorItem < resto) {
                                    console.log("entramos en los últimos")
                                    listaResto.push(n)
                                }
                                
                            })
                            
                            if (listaResto[0]) {
                            listaNueva.push(listaResto)
                            }
                        }
            
                        console.log("----------------------------------------------------------------- COMIENZO LISTA NUEVA (TODO) ----------------------------------------------------------------------------")
                        console.log(listaNueva)
                        console.log("----------------------------------------------------------------- FIN LISTA NUEVA (TODO) ----------------------------------------------------------------------------")
            
                        /* console.log(posicionArrayProductos, "En esta posicion buscará") */
                        let resultados = []
                        resultados = listaNueva[posicionArrayProductos]
                    /*             
                        console.log(contadorItem, "contadorVuelta")
                        console.log(lenResults, "cantidadTotal")
            
                        console.log("Se necesitan paginas : ", contadorPagina)
                        console.log(lenResults, "Resultados totales") */
            
            /*             console.log(listaNueva)
                        console.log("Lista entera")
                        console.log(listaNueva[1])
                        console.log("Esta es la lista pos 1") */
                        
            
                        console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! COMIENZO ESTOS ENVIA !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
                        console.log(resultados)
                        console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! FIN ESTOS ENVIA !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
            
                        if (contadorPagina > page) {
    
                            console.log(contadorPagina, "CONTADOR PAGINA")
    
                            nextPage = parseInt(page) + 1
            /*                 console.log(nextPage, "Siguiente pagina")
            
                            console.log(resultados)
                            console.log("estos son los resultados enviados en el IF") */
            
            
                            previousPage = parseInt(page) 
                            
                            res.render('search', {
                                brandResults,
                                resultados,
                                contadorPagina,
                                previousPage,
                                nextPage,
                                $submodeloId,
                                $anyoName
                            })
            
                            resultados = []
            
            /*                 console.log(resultados)
                            console.log("Estos son los resultados una vez enviados en el IF") */
            
                        } else {
            /* 
            
                            console.log(resultados)
                            console.log("estos son los resultados enviados en el ELSE") */
                            
    
                            if (contadorPagina == 1) {
                                console.log(contadorPagina, " PAGINA UNICA")
                                res.render('search', {
                                    brandResults,
                                    resultados
                                })
                            } else {
                                previousPage = nextPage -1
                                res.render('search', {
                                    previousPage,
                                    brandResults,
                                    resultados,
                                    contadorPagina,
                                    $submodeloId,
                                    $anyoName
                                })
    
                            }
            
                            resultados = []
            
                        }
            
            
                    })

                }


            })
        

        })
    })

   
        
    

 
    
   
    


})



module.exports = router;