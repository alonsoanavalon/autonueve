const listaSubmodeloStorageService = require('./listasubmodelo.storageService');


exports.getAllListaSubmodelo = () => {
    return listaSubmodeloStorageService.getAllListaSubmodelo();
}

exports.createListaSubmodelo = (listaProducto) => {
    return listaSubmodeloStorageService.createListaSubmodelo(listaProducto);  
}

exports.getListaSubmodeloById = (id) => {
    return listaSubmodeloStorageService.getListaSubmodeloById(id);
}

exports.updateListaProducto = (listaproducto) => {
    return listaSubmodeloStorageService.updateListaProducto(listaproducto); 
}

exports.getListaSubmodeloBySubmodelAndYear = async (submodeloId) => {
    const listaSubmodeloId = await listaSubmodeloStorageService.getListaSubmodeloBySubmodelAndYear(submodeloId);
    return listaSubmodeloId[0]['id'];
}
