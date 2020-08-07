class Canvas{
    //this class should represent the canvas
    //this class will collect all the nodes
    constructor(canvasId){
        this._size = 0
        this._nodes = []//the id of each node in this list should be the same as its index
        //the root will always be the first element in this list
        this._canvas = null
        this.checkCanvasId(canvasId)//will check if the canvas id is correct
        this._selected = null
        this._edge = null
    }
    addNode(node){
        //this will add node to the canvas
        //node must be of type Node
        this._size += 1
        this._nodes.push(node)
        this._canvas.appendChild(node)
    }
    clickedNode(node){
        if (this._selected === null){
            this._selected = node
            node.activateAddEdgeBtn()
        }else if (this._selected != node && this._selected != null){
            this._selected.updateState()
            this._selected = node
        }else{
            //this will happen when this._selected === node
            this._selected.deavtivateAddEdgeBtn()
            this._selected = null
        }
    }
    getSelectedNode(){
        return this._selected
    }
    checkCanvasId(canvasId){
        try{
            this._canvas = document.getElementById(canvasId)
        }
        catch{
            console.error("Incorrect canvas Id has been used")
        }
    }
    getCanvas(){
        return this._canvas
    }
    setEdge(x1,y1,x2,y2){ 
        this._edge = document.createElementNS("http://www.w3.org/2000/svg","line")
        this._edge.setAttribute("x1",x1)
        this._edge.setAttribute("x2",x2)
        this._edge.setAttribute("y1",y1)
        this._edge.setAttribute("y2",y2)
        this._edge.setAttribute("stroke-width","7px")
        this._edge.setAttribute("stroke","black")
        return this._edge
    }
    updateEdge(newX,newY){
        this._edge.setAttribute("x2",newX)
        this._edge.setAttribute("y2",newY)
    }
    removeEdge(){
        this._canvas.removeChild(this._edge)
        this._edge = null
    }
    addEventListener(){
        //need to create an svg and have its one end on the center of the node and the other end tracing the pointer
        //i will write an event listener to change the x2 and y2 components of the line and update it on every mousemove
        let x1 = this._selected.getXCoord()
        let y1 = this._selected.getYCoord()
        let instance = this
        let toolbarHeight = this._canvas.getBoundingClientRect().top
        this._canvas.addEventListener("mousemove",function(event){
            //need to set the initial state
            if (instance._edge === null && instance._canvas.style["cursor"] === "crosshair"){
                instance.setEdge(x1,y1,event.clientX,event.clientY-toolbarHeight)
                this.appendChild(instance._edge)
            }
            else if (instance._canvas.style["cursor"] === "crosshair"){
                instance.updateEdge(event.clientX,event.clientY-toolbarHeight)
            }
        })
    }
}