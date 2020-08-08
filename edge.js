class Edge{
    constructor(canvas){
        //init node is the which will be one of the endpoints of the edge
        this._node1 = canvas.getSelectedNode()
        this._node2 = null
        this._x1 = canvas.getSelectedNode().getCx()
        this._y1 = canvas.getSelectedNode().getCy()
        this._x2 = null
        this._y2 = null
        this._edge = document.createElementNS("http://www.w3.org/2000/svg","line")
        this._canvas = canvas
        this.initEdge()
        console.log("created a new edge")
    }
    initEdge(){ 
        this._edge.setAttribute("x1",this._node1.getCx())
        this._edge.setAttribute("y1",this._node1.getCy())
        this._edge.setAttribute("stroke-width","7px")
        this._edge.setAttribute("stroke","black")
        this._canvas._canvas.appendChild(this._edge)
    }
    getEdge(){
        return this._edge
    }
    updateEndpoint(newX,newY){
        this._edge.setAttribute("x2",newX)
        this._edge.setAttribute("y2",newY) 
    }
    node2Update(node2){
        this._node2 = node2
        this.updateEndpoint(node2.getCx(),node2.getCy())
    }
}