class Edge{
    constructor(canvas,pointer,id){
        //init node is the which will be one of the endpoints of the edge
        this._id = id
        this._node1 = canvas.getSelectedNode()//node1 is associated with the x1 and y1 coordinates
        this._node2 = null//node2 is associated with the x2 and y2 coordiantes
        this._edge = document.createElementNS("http://www.w3.org/2000/svg","line")
        this._canvas = canvas
        this._pointer = pointer   
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
}
class EdgeStack extends Edge{
    //this just needs to move with the black edge
    //need to set the clipping rectangle
    constructor(canvas,pointer,id){
        super(canvas,pointer,id)
        this._progEdge = document.createElementNS("http://www.w3.org/2000/svg","line")
        this._subGrp = document.createElementNS("http://www.w3.org/2000/svg","g")
        this._rect = document.createElementNS("http://www.w3.org/2000/svg","line")
        this._mainGrp = document.createElementNS("http://www.w3.org/2000/svg","g")
        this._clipPath = document.createElementNS("http://www.w3.org/2000/svg","clipPath")
        this._initEdgeStack()
    }
    static _appendTo(parent,child){
        parent.appendChild(child)
    }
    _initEdgeStack(){
        this._initRect()//this is just an svg line
        this._createProgEdge()
        this._createBlackEdge()
        this.updateNode1Endpoint(this._node1.getCx(),this._node1.getCy())
        this._initMainGrp()
        this._initDefs()
    }
    _createProgEdge(){
        this._progEdge.setAttribute("stroke-width","7px")
        this._progEdge.setAttribute("stroke","blue")
        this._edge.classList = "edge-unclickable edge"
    }
    _createBlackEdge(){
        this._edge.setAttribute("stroke-width","7px")
        this._edge.setAttribute("stroke","black")
        this._edge.classList = "edge-unclickable edge"
    }
    updateNode1Endpoint(newX,newY){
        this._edge.setAttribute("x1",newX)
        this._edge.setAttribute("y1",newY)
        this._progEdge.setAttribute("x1",newX)
        this._progEdge.setAttribute("y1",newY)
        this._rect.setAttribute("x1",newX)
        this._rect.setAttribute("y1",newY)
    }
    updateNode2Endpoint(newX,newY){
        this._edge.setAttribute("x2",newX)
        this._edge.setAttribute("y2",newY)
        this._progEdge.setAttribute("x2",newX)
        this._progEdge.setAttribute("y2",newY)
        this._rect.setAttribute("x2",newX)
        this._rect.setAttribute("y2",newY)
    }
    _progEdge(){
        this._subGrp.setAttribute("clip-path",`url(#edge${this._id})`)
        let intervalId
        let instance = this
        const intervalCb = () =>{
            let x = instance.getRectXCoord()
            if ( x <= (parseInt(instance._cx,10) + parseInt(instance._radius,10))){
                instance._rect.setAttribute("x",x+1)
            }else{
                
                clearInterval(intervalId)
            }
        }
        intervalId = setInterval(intervalCb,50)
    }
    _initRect(){
        this._rect.setAttribute("stroke-width","7px")
    }
    static getLineLength(x1,y1,x2,y2){
        let xComp = (x2-x1)*(x2-x1)
        let yComp = (y2-y1)*(y2-y1)
        let length = Math.sqrt(xComp + yComp)
        return length
    }
    removeEdge(){
        //this will remove the edge from the dom tree
        if (this._canvas.getActiveEdge() === this){
            this._canvas.setEdge(null)
            this._pointer.setDefaultState()
        }
        if (this._node2 != null){
            this._node2.removeEdge(this)
        }
        this._node1.removeEdge(this)
        this._canvas.removeEdge(this)

    }
    _initMainGrp(){
        EdgeStack._appendTo(this._subGrp,this._edge)
        EdgeStack._appendTo(this._mainGrp,this._progEdge)
        EdgeStack._appendTo(this._mainGrp,this._subGrp)
        
    }
    _initDefs(){
        this._clipPath.setAttribute("id",`edge${this._id}`)
        EdgeStack._appendTo(this._clipPath,this._rect)
    }
    getMainGrp(){
        return this._mainGrp
    }
    getDefs(){
        return this._clipPath
    }
}
class EdgeGraph extends EdgeStack{
    //on creation the nodes to be appended onto the dom
    //move the dom manipulation to canvas.js
    constructor(canvas,pointer,id){
        super(canvas,pointer,id)
        this._eventListeners()//this might cause some bugs later on since an edge isnt clickable righ away
        this._canvas.addEdge(this)//this will pass this instance onto 
    }
    setSecondNode(newNode){
        this._node2 = newNode
        this.updateNode2Endpoint(newNode.getCx(),newNode.getCy())
        this._edge.classList.replace("edge-unclickable","edge-clickable")
    }
    setFirstNode(newNode){
        this._node1 = newNode
        this.updateNode1Endpoint(newNode.getCx(),newNode.getCy())
    }
    updatePos(node,newX,newY){
        //node is the node that is being moved
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
                    instance.removeEdge()
            }
        })
    }
   
}