class Edge{
    constructor(canvas,pointer){
        //init node is the which will be one of the endpoints of the edge
        this._node1 = canvas.getSelectedNode()//node1 is associated with the x1 and y1 coordinates
        this._node2 = null//node2 is associated with the x2 and y2 coordiantes
        this._edge = document.createElementNS("http://www.w3.org/2000/svg","line")
        this._canvas = canvas
        this._pointer = pointer
        this.initEdge()
    }
    initEdge(){
        this.updateNode1Endpoint(this._node1.getCx(),this._node1.getCy())
        this._edge.setAttribute("stroke-width","7px")
        this._edge.setAttribute("stroke","black")
        this._edge.classList = "edge-unclickable edge"
        this._canvas._canvas.insertAdjacentElement("afterbegin",this._edge)
    }
    getFirstNode(){
        return this._node1
    }
    getSecondNode(){
        return this._node2
    }
    getEdge(){
        return this._edge
    }
    updateNode1Endpoint(newX,newY){
        this._edge.setAttribute("x1",newX)
        this._edge.setAttribute("y1",newY)
    }
    updateNode2Endpoint(newX,newY){
        this._edge.setAttribute("x2",newX)
        this._edge.setAttribute("y2",newY) 
    }
    setSecondNode(newNode){
        this._node2 = newNode
        this.updateNode2Endpoint(newNode.getCx(),newNode.getCy())
        this._edge.classList.replace("edge-unclickable","edge-clickable")
        //this._eventListeners()
    }
    setFirstNode(newNode){
        this._node1 = newNode
        this.updateNode1Endpoint(newNode.getCx(),newNode.getCy())
    }
    updatePos(node,newX,newY){
        if (node === this._node1){
            this.updateNode1Endpoint(newX,newY)
        }else if (node === this._node2){
            this.updateNode2Endpoint(newX,newY)
        }
    }
    _eventListeners(){
        let pointer = this._pointer
        let instance = this
        this._edge.addEventListener("click",function(){
            switch (pointer.getState()){
                case (pointer.eraseState()):
                    instance._node1.removeEdge(instance)
                    instance._node2.removeEdge(instance)
                    instance.removeEdge()
            }
        })
    }
    removeEdge(){
        if (this._canvas.getActiveEdge() === this){
            this._canvas.setEdge(null)
        }
        this._canvas._canvas.removeChild(this._edge)
    }
    /*
    addNodeEvent(node){
        node.addEventListener("mousemove",function(){

        })
    }*/
}