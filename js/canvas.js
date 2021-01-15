class Canvas{
    //this class should represent the canvas
    //this class will collect all the nodes
    constructor(canvasId,pointer,defsId,graphAlgo,idGen){
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
        this._algo = graphAlgo
        this._idGen = idGen
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
        this.progSingleNode(this._selected)
    }
    progSingleNode(node){
        if (node.getNumEdges() === 0){
            node.progEast(null,null)
        }else{
            //this will prog the node towards the direction of the corresponding node of the first edge that was attached to the node
            let node2 = node._edge[0].getOppositeNode(node)//this will be the corresponding node in the first edge
            let node1X = node.getCx()
            let node1Y = node.getCy()
            let node2X = node2.getCx()
            let node2Y = node2.getCy()
            //get the maximum distance vertically or horizontally and prog it that way
            if (Math.abs(node1X-node2X) > Math.abs(node1Y-node2Y)){
                //need to prog horizontally
                if (node1X > node2X){
                    //selected node is to the right of the corresponding node
                    node.progWest(null,null)
                }else{
                    node.progEast(null,null)
                }
            }else{
                if (node1Y > node2Y){
                    //selected node is south of corresponding node
                    node.progNorth(null,null)
                }else{
                    node.progSouth(null,null)
                }
            }
        }
    }
    progNode(node,node2){
        //this function will be responsible for starting the progging of a node
        //the edge progging functionality will be invoked in the node.js object
        let quantFlag = "single" // this is a flag to prog only a single edge
        //this will prog the node towards the direction of the corresponding node of the first edge that was attached to the node
        let node1X = node.getCx()
        let node1Y = node.getCy()
        let node2X = node2.getCx()
        let node2Y = node2.getCy()
        //get the maximum distance vertically or horizontally and prog it that way
        if (Math.abs(node1X-node2X) > Math.abs(node1Y-node2Y)){
            //need to prog horizontally
            if (node1X > node2X){
                //selected node is to the right of the corresponding node
                node.progWest(quantFlag,node2)
            }else{
                node.progEast(quantFlag,node2)
            }
        }else{
            if (node1Y > node2Y){
                //selected node is south of corresponding node
                node.progNorth(quantFlag,node2)
            }else{
                node.progSouth(quantFlag,node2)
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
    execute(){
        if (this._algo.getSize() != 0){
            let path = this._algo.getNextEdge()

            this.progNode(path[0],path[1])
        }
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
    random(){
        //create 5-10 nodes and 3-5 edges anywhere in the screen
        //each node will have a margin when randomized 
        const WIDTH_MIN = window.innerWidth*0.1
        const WIDTH_MAX = window.innerWidth*0.9
        const HEIGHT_MIN = (window.innerHeight - this.getCanvas().getBoundingClientRect().top)*0.1
        const HEIGHT_MAX = (window.innerHeight - this.getCanvas().getBoundingClientRect().top)*0.9
        const VERTICAL_OFFSET = (window.innerHeight - this.getCanvas().getBoundingClientRect().top)*0.2
        const HORIZONTAL_OFFSET = window.innerWidth*0.2
        const NODES = 6 // this is the number of nodes to generate
        let nodeRectangles = [] // this will be a collection of NodeRectangle objects that do not intersect with each other
        for (var i = 0; i < NODES; i++){
            //this will fill up the canvas with at most 10 nodes and at least 1 node placed randomly
            this.getRandomCoord({max:WIDTH_MAX,min:WIDTH_MIN},{max:HEIGHT_MAX,min:HEIGHT_MIN},nodeRectangles,{horizontal:HORIZONTAL_OFFSET,verical:VERTICAL_OFFSET})
        }
        this.createRandomEdges(nodeRectangles)
    }
    createRandomEdges(nodeRectangles){
        let edgeProb = 0.8 // this wil be the initial probability of an edge being created given that it doesnt intercept with any other edges
        let len = nodeRectangles.length
        let curProb = null // this will be used to decide wether an edge is drawn or not
        let intercept = false // this will be a flag to check if a node intersects the line
        for (var i = 0; i < len; i++){
            let node1 = nodeRectangles[i].getNode()
            for (var j = 0; j< len;j++){
                if (i != j){
                    let node2 = nodeRectangles[j].getNode()
                    let slopeIntercept = this.getSlopeIntercept(node1,node2)
                    for (var k = 0;k <len; k++){
                        if (k != i && k != j){
                            let node3 = nodeRectangles[k].getNode()
                            if (this.checkIntercept(slopeIntercept,node3,{min:node1.getCx() < node2.getCx()?node1.getCx():node2.getCx(),max:node1.getCx() < node2.getCx()?node2.getCx():node1.getCx()})){
                                intercept = true
                                break
                            }
                        }
                    }
                    curProb = Math.random()
                    if (curProb <= edgeProb && !intercept){
                        let temp = this._selected
                        this._selected = node1
                        let newEdge = new EdgeGraph(this,this._pointer,this._idGen.getIdIncrement())
                        this._selected = temp
                        node1.addEdge(newEdge)
                        newEdge.setFirstNode(node1)
                        newEdge.setSecondNode(node2)
                        node2.addEdge(newEdge)
                        this.addEdge(newEdge)
                        edgeProb = (edgeProb - 0.1) < 0 ? 0:edgeProb - 0.1
                    }
                    intercept = false
                }
            }

        }
    }
    checkIntercept(slopeIntercept,node,interval){
        //this will check if node intersects with the line that is given by slopeIntercept
        let point = {x:node.getCx(),y:node.getCy()}
        let lineVal = (point.x*slopeIntercept.m) + slopeIntercept.b
        if (point.x >= interval.min && point.x <= interval.max && Math.abs(point.y - lineVal) < node.getRadius()){
            return true
        }
        return false
    }
    getSlopeIntercept(node1,node2){
        //node1 and node 2 will be a GraphNode object
        let point1 = {x:node1.getCx(),y:node1.getCy()}
        let point2 = {x:node2.getCx(),y:node2.getCy()}
        let slope = (point2.y - point1.y)/(point2.x-point1.x)
        return {m:slope,b:point2.y-(slope*point2.x)}
    }
    getRandomCoord(width,height,rectangles,offset){
        let randx = (Math.random()*(width.max-width.min)) + width.min
        let randy = (Math.random()*(height.max-height.min)) + height.min
        this.randomize(width,height,randx,randy)
        let flag = true
        setTimeout(function(){
            flag = false
        },5000)//this will stop the search for a random node that does not intersect with any rectangles in 5 seconds
        let newGraphNode = new GraphNode(randx,randy,this._idGen.getIdIncrement(),this,15,"blue","addEdge")
        newGraphNode.nodeEventListenerPointer(this._pointer)
        let newNode = new NodeRect (newGraphNode,offset)
        let len = rectangles.length
        if (len === 0){
            rectangles.push(newNode)
            this.addNode(newNode.getNode())
            return true
        }else{
            while (flag){
                let newGraphNode = new GraphNode(randx,randy,this._idGen.getIdIncrement(),this,15,"blue","addEdge")
                newGraphNode.nodeEventListenerPointer(this._pointer)
                newNode = new NodeRect (newGraphNode,offset)
                let intersected = false
                for (let i = 0; i < len;i++){
                    if (rectangles[i].intersects(newNode)){
                        this.randomize(width,height,randx,randy)
                        intersected = true
                        break
                    }
                }
                if (intersected){
                    break
                }
                rectangles.push(newNode)
                this.addNode(newNode.getNode())
                return true
            }
        }
        return false        
    }
    randomize(width,height,randx,randy){
        //this will create new random values for randx and randy
        randx = (Math.random()*(width.max-width.min)) + width.min
        randy = (Math.random()*(height.max-height.min)) + height.min
    }
    clear(){
        this._canvas.innerHTML = ""
        this._canvas.appendChild(this._svgDefs)
    }
    createPreset(){
        
    }
}