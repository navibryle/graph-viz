class Edge{
    constructor(initNode){
        //init node is the which will be one of the endpoints of the edge
        this._x1 = initNode.getCx()
        this._y1 = initNode.getCy()
        this._x2 = null
        this._y2 = null
        this._edge = document.createElementNS("https://www.w3.org/2000/svg","line")

    }
    setEdge(){ 
        this._edge.setAttribute("x1",this._x1)
        this._edge.setAttribute("y1",this._y1)
        this._edge.setAttribute("stroke-width","7px")
        this._edge.setAttribute("stroke","black")
    }
    getEdge(){
        return this._edge
    }
    updateEdge(newX,newY){
        this._edge.setAttribute("x2",newX)
        this._edge.setAttribute("y2",newY)
    }
}