class Canvas{
    //this class should represent the canvas
    //this class will collect all the nodes
    constructor(canvasId,pointer,defsId){
        //defs will contain the svg definition to be used for clipping
        this._size = 0
        this._nodes = []//the id of each node in this list should be the same as its index. this will only keep track of the first node on the stack
        //the root will always be the first element in this list
        this._canvas = null
        this.checkCanvasId(canvasId)//will check if the canvas id is correct
        this._selected = null
        this._edge = null
        this._pointer = pointer
        this._svgDefs = document.getElementById(defsId)
    }
    addNode(node){
        //this will add node to the canvas
        //node must be of type Node
        this._size += 1
        this._nodes.push(node.getNode())
        this._svgDefs.appendChild(node.getSvgDef())//these svg definitions are needed to prog the node
        this._canvas.insertAdjacentElement("beforeend",node.getDynamicNode())
    }
    removeNode(node){
        this._size -= 1
        this._canvas.removeChild(node.getNodeGrp())
        this._svgDefs.removeChild(node.getDef())
        let len = this._nodes.length
        for (let i = 0; i < len; i++){
            if (this._nodes[i] === node.getNode()){
                this._nodes.splice(i,1)
            }
        }
    }
    addEdge(edge){
        this._svgDefs.appendChild(edge.getDefs())
        this._canvas.insertAdjacentElement("afterbegin",edge.getMainGrp())
    }
    removeEdge(edge){
        this._canvas.removeChild(edge.getMainGrp())
        this._svgDefs.removeChild(edge.getDefs())
    }
    progNode(node){
        if (node.getNumEdges() === 0){
            node.progEast()
        }else{
         if (node._edge[0].getOppositeNode(node)){
             //will get the postion of the node from the firt edge in the list and then prog that way
         }   
        }
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
    setSelectedNode(node){
        if (this._selected != null){
            this._selected.deactivateNode()
        }
        this._selected = node
    }
    deleteCurNode(){
        this._selected = null
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
    setEdge(edge){
        this._edge = edge
    }
    getActiveEdge(){
        return this._edge
    }
    addEventListener(){
        //need to create an svg and have its one end on the center of the node and the other end tracing the pointer
        //i will write an event listener to change the x2 and y2 components of the line and update it on every mousemove
        let instance = this
        let toolbarHeight = this._canvas.getBoundingClientRect().top
        let pointer = this._pointer
        let count = 0
        this._canvas.addEventListener("mousemove",function(event){
            //need to set the initial state
            if (instance._edge === null && pointer.isEdgeState()){
                instance._edge = new EdgeGraph(instance,pointer,count)//this has an id now
                count += 1
                instance._selected.addEdge(instance._edge)
                instance._edge.updateNode2Endpoint(event.clientX,0)
            }
            else if (pointer.isEdgeState()){
                instance._edge.updateNode2Endpoint(event.clientX,event.clientY-toolbarHeight)
            }
        })
    }
}