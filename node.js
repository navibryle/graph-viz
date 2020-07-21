class Node{
    constructor (x,y,id){
        //x and y are the respective coordinates on which to place the node in the svg canvas
        this._id = id//id should count up from 0 to one.
        this._radius = "15"
        this._cx = x
        this._cy = y
        this._fill = "black"
        this._node = document.createElementNS("http://www.w3.org/2000/svg","circle")
    }
    getId(){
        return this._id   
    }
    getRadius(){
        return this._radius
    }
    getCx(){
        return this._cx
    }
    getCy(){
        return this._cy
    }
    getFill(){
        return this._fill
    }
    setRadius(newRadius){
        if (typeof(newRadius) === "number" && newRadius >= 0){
            this._radius = newRadius
        }else{
            console.error(`invalid radius for node with id ${this._id}`)
        }
    }
    setCx(newCoord){
        if (typeof(newCoord) === "number"){
            this._cx = newCoord
        }else{
            console.error(`invalid x-coordinate for node with id ${this._id}`)
        }
    }
    setCy(newCoord){
        if (typeof(newCoord) === "number"){
            this._cx = newCoord
        }else{
            console.error(`invalid y-coordinate for node with id ${this._id}`)
        }
    }
    setFill(newFill){
        if (typeof(newFill) === "string"){
            this._fill = newFill
        }else{
            console.error(`invalid fill for node with id ${this._id}`)
        }
    }
    nodeEventListenerPointer(pointer){
        var node = this._node
        this._node.addEventListener("click",function(e){
            console.log(node)
            switch(pointer.getState()){
                case "erase":
                    document.getElementById("canvas").removeChild(node)
            }
        })
    }
    getNode(){ 
        this._node.setAttribute("r",this._radius)
        this._node.setAttribute("cx",this._cx)
        this._node.setAttribute("cy",this._cy)
        this._node.setAttribute("fill",this._fill)
        this._node.id = `${this._id}`
        return this._node
    }
    
}