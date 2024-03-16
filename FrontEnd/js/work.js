// Représentation du format d'un work

class Work {
    constructor(jsonWork){
        jsonWork && Object.assign(this, jsonWork)
    }
}