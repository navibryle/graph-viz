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
    progSelected(){
        //this function will be responsible for starting the progging of a node
        //the edge progging functionality will be invoked in the node.js object
        if (this._selected.getNumEdges() === 0){
            this._selected.progEast()
        }else{
            //this will prog the node towards the direction of the corresponding node of the first edge that was attached to the node
            let node2 = this._selected._edge[0].getOppositeNode(this._selected)//this will be the corresponding node in the first edge
            let node1X = this._selected.getCx()
            let node1Y = this._selected.getCy()
            let node2X = node2.getCx()
            let node2Y = node2.getCy()
            //get the maximum distance vertically or horizontally and prog it that way
            if (Math.abs(node1X-node2X) > Math.abs(node1Y-node2Y)){
                //need to prog horizontally
                if (node1X > node2X){
                    //selected node is to the right of the corresponding node
                    this._selected.progWest()
                }else{
                    this._selected.progEast()
                }
            }else{
                if (node1Y > node2Y){
                    //selected node is south of corresponding node
                    this._selected.progNorth()
                }else{
                    this._selected.progSouth()
                }
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
        console.log(this._selected)
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