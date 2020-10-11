class Node{
    constructor (x,y,id,canvas,radius,color){
        //x and y are the respective coordinates on which to place the node in the svg canvas
        //first node will contain all the data needed for transformation and joining with edges
        this._id = id//id should count up from 0 to one.
        this._radius = radius.toString()
        this._cx = x//this will be the initial coordinate before the translation
        this._cy = y//this will be the initial coordinate before the translation
        this._fill = color
        this._firstNode = document.createElementNS("http://www.w3.org/2000/svg","circle")
        this._initNode()
        this._canvas = canvas
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
    getPoints(){
        return {x:this._cx,y:this._cy}
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
    _initNode(){ 
        this._firstNode.setAttribute("r",this._radius)
        this._firstNode.setAttribute("cx",this._cx)
        this._firstNode.setAttribute("cy",this._cy)
        this._firstNode.setAttribute("fill","black")
        this._firstNode.setAttribute("class","node")
        this._firstNode.id = `${this._id}`
        return this._firstNode
    }
    getNode(){
        return this._firstNode
    }
    
}
class SecondNode extends Node{
    //all this node has to do is follow the black Node
    //when black node is deleted delete this one too
    //will contain the method to return the actual node
    //gonna add access to defs here since this should be the one of the two programs which needs to access the defs
    constructor(x,y,id,canvas,radius,color){
        super(x,y,id,canvas,radius,color)
        this._secondNode = document.createElementNS("http://www.w3.org/2000/svg","circle")
        this.createSecondNode()
        this._rect = document.createElementNS("http://www.w3.org/2000/svg","rect")
        this._clipId = `node${this._id}`
        this._subGrp = document.createElementNS("http://www.w3.org/2000/svg","g")
        this._clipPath = document.createElementNS("http://www.w3.org/2000/svg","clipPath")
        this._mainGrp = document.createElementNS("http://www.w3.org/2000/svg","g")
    }
    //each of these statics will return the shapes they created
    //====================================statics===========================
    static _appendTo(parent,child){
        parent.appendChild(child)
    }
    getNodeGrp(){
        return this._mainGrp
    }
    getDef(){
        return this._clipPath
    }
    createSecondNode(){
        this._secondNode.setAttribute("r",this._radius)
        this._secondNode.setAttribute("cx",this._cx)
        this._secondNode.setAttribute("cy",this._cy)
        this._secondNode.setAttribute("fill",this._fill)
        this._secondNode.setAttribute("class","node")
    }
    moveNode(newX,newY){
        this._firstNode.setAttribute("cx",newX)
        this._firstNode.setAttribute("cy",newY)
        this._secondNode.setAttribute("cx",newX)
        this._secondNode.setAttribute("cy",newY)
        this._cx = newX
        this._cy = newY
        this.updateRectCoords(this._cx-this._radius,this._cy-this._radius)
    }
    //=====================================================
    _createClip(){
        let clipPath = this._clipPath
        clipPath.setAttribute("id",this._clipId)
        return clipPath
    }
    initRect(){
        this.updateRectCoords(this._cx-this._radius,this._cy-this._radius)
        this._rect.setAttribute("width",this._radius * 2)
        this._rect.setAttribute("height",this._radius * 2)
    }
    updateRectCoords(x,y){
        //the x and the y needs to be the top right of the node
        this._rect.setAttribute("x",x)
        this._rect.setAttribute("y",y)
    }
    getRectXCoord(){
        return parseInt(this._rect.getAttribute("x"),10)
    }
    getRectYCoord(){
        return parseInt(this._rect.getAttribute("y"),10)
    }
    getSvgDef(){
        //clip path will be appended to defs
        //this will return the clipPath svg elem that needs to be appended to defs
        let clipPath = this._createClip()
        this.initRect()
        SecondNode._appendTo(clipPath,this._rect)
        return clipPath
    }
    getDynamicNode(){
        //clip path needs to be appended to defs
        //this will return an svg grp with two childs the colored node and the black node surrounded by a group
        let coloredNode = this._secondNode
        let blackNode = this._firstNode
        let mainGrp = this._mainGrp
        let subGrp = this._subGrp
        SecondNode._appendTo(subGrp,blackNode)
        SecondNode._appendTo(mainGrp,coloredNode)
        SecondNode._appendTo(mainGrp,subGrp)
        return mainGrp
    }
}
class NodeEdge extends SecondNode{
    constructor(x,y,id,canvas,radius,color,addEdgeBtn){
        super(x,y,id,canvas,radius,color)
        this._addEdgeBtn = document.getElementById(addEdgeBtn)
        this._edge = []
        this._edgeNum = 0
    }
    _canAddEdge(edge){
        let lenEdges = this._edge.length 
        let firstNode = edge.getFirstNode().getNode()
        for (let i = 0; i<lenEdges;i++){
            //second node of the edge parameters is this
            if (this._edge[i].getFirstNode().getNode() === firstNode || this._edge[i].getSecondNode().getNode() === firstNode){
                return false
            }
        }
        return true
    }
    activateAddEdgeBtn(){
        this._addEdgeBtn.style["opacity"] = "1"
    }
    deavtivateAddEdgeBtn(){
        this._addEdgeBtn.style["opacity"] = "0"
    }
    addEdge(edge){
        this._edge.push(edge)
        this._edgeNum += 1
    }
    removeEdge(edge){
        for (let i = 0; i <this._edgeNum; i++){
            if (this._edge[i].getEdge() === edge.getEdge()){ //getEdge()  will give the svg line representing an edge
                this._edge.splice(i,1)
                this._edgeNum -= 1
            }
        }
    }
    getNumEdges(){
        return this._edgeNum
    }
}
class NodeProg extends NodeEdge{
    //will be progging node in cardinal directions
    constructor (x,y,id,canvas,radius,color,addEdgeBtn){
        super(x,y,id,canvas,radius,color,addEdgeBtn)
        this._progCard = null // this will be the cardinal postion that the node will prog towards
    }
    progEast(){
        //this will make the node seem like its being progresed
        this._progCard = "East"
        this._subGrp.setAttribute("clip-path",`url(#node${this._id})`)
        let intervalId
        let instance = this
        const intervalCb = () =>{
            let x = instance.getRectXCoord()
            let xCoord = parseInt(instance._cx,10)
            if ( x <= (xCoord + parseInt(instance._radius,10))){
                instance._rect.setAttribute("x",x+1)
                if (x === xCoord){
                    instance._startEdgeProg()
                }
            }else{
                
                clearInterval(intervalId)
            }
        }
        intervalId = setInterval(intervalCb,50)
    }
    progWest(){
        
        this._progCard = "West"
        this._subGrp.setAttribute("clip-path",`url(#node${this._id})`)
        let intervalId
        let instance = this
        const intervalCb = () =>{
            let x = instance.getRectXCoord()
            let xCoord = parseInt(instance._cx,10)
            if ( x >= (xCoord - (3*parseInt(instance._radius,10)))){
                instance._rect.setAttribute("x",x-1)
                if (x+2*parseInt(instance._radius,10) === xCoord){
                    
                    instance._startEdgeProg()
                }
            }else{
                
                clearInterval(intervalId)
            }
        }
        intervalId = setInterval(intervalCb,50)
    }
    progNorth(){
        this._progCard = "North"
        this._subGrp.setAttribute("clip-path",`url(#node${this._id})`)
        let intervalId
        let instance = this
        const intervalCb = () =>{
            let y = instance.getRectYCoord()
            let yCoord = parseInt(instance._cy,10)
            
            if ( y >= ( yCoord - (3*parseInt(instance._radius,10)))){
                instance._rect.setAttribute("y",y-1)
                if (y+2*parseInt(instance._radius,10) === yCoord){
                    instance._startEdgeProg()
                }
            }else{
                
                clearInterval(intervalId)
            }
        }
        intervalId = setInterval(intervalCb,50)
    }
    progSouth(){
        this._progCard = "South"
        this._subGrp.setAttribute("clip-path",`url(#node${this._id})`)
        let intervalId
        let instance = this
        const intervalCb = () =>{
            let y = instance.getRectYCoord()
            let yCoord = parseInt(instance._cy,10)
            if ( y <= (yCoord + (parseInt(instance._radius,10)))){
                instance._rect.setAttribute("y",y+1)
                if (y === yCoord){
                    instance._startEdgeProg()
                }
            }else{
                
                clearInterval(intervalId)
            }
        }
        intervalId = setInterval(intervalCb,50)
    }
    _startEdgeProg(){
        let len = this._edge.length
        for (let i = 0;i<len;i++){
            this._edge[i] .progEdgeFromNode(this)
        }
    }
    //============= might not need this at all======================================
    isHalfWay(){
        //this will return a boolean which will be true if the node's clipping rectangle is halfway through the node
        //rectangle will always have their coord to be the intercardinal northwest
        //width and height of rect is radius * 2
        let p1 = {x:this._rect.getRectXCoord(),y:this._rect.getRectYCoord()}
        let p2 = {x:p1.x,y:p1.y+(2*this._radius)}
        let p3 = {x:p1.x+(2*this._radius),y:p1.y}
        let p4 = {x:p3.x,y:p2.y}
        switch (this._progCard){
            case "North":

        }
    }
    //===========================================================================
}
class GraphNode extends NodeProg{
    constructor(x,y,id,canvas,radius,color,addEdgeBtn){
        super(x,y,id,canvas,radius,color,addEdgeBtn)
        this._active = false //true if the node has been clicked and the option to add an edge is available
        this._canBeClicked = false //this will be used to validate the if a click can be considered a "quickClick"
    }
    _quickClickInterval(instance){
        instance._canBeClicked = true
        window.setTimeout(function(){
            instance._canBeClicked = false
        },100)
    }
    nodeEventListenerPointer(pointer){
        var node = this._firstNode
        var instance = this
        this._clickListener(pointer,node,instance)
        this._mouseDownListener(pointer,node,instance)
        this._mouseUpListener(pointer,node,instance)
        this._moveListener(pointer,node,instance)
    }
    _mouseUpListener(pointer,node,instance){
        this._firstNode.addEventListener("mouseup",function(event){
            if (instance._canBeClicked === true){
                //this if statement is made to catch only quick clicks
                if (pointer.isDefaultState() && !instance._active){
                    instance.activateNode()
                }else if (instance._active && (pointer.isDefaultState() || pointer.isEraseState())){
                    instance.deactivateNode()
                }
                instance._canBeClicked = false
            }
            switch(pointer.getState()){
                case pointer.defaultState():
                    node.style["cursor"] = "grab"
                    break
            }
        })
    }
    _mouseDownListener(pointer,node,instance){
        this._firstNode.addEventListener("mousedown",function(event){
            instance._quickClickInterval(instance)
            switch(pointer.getState()){
                case pointer.defaultState():
                    node.style["cursor"] = "grabbing"
                    break
            }
        })
    }
    _clickListener(pointer,node,instance){
        this._firstNode.addEventListener("click",function(event){
            event.stopPropagation()
            switch(pointer.getState()){
                case pointer.eraseState():
                    let len = instance._edge.length
                    let tempArr = instance._edge.slice()// i needed to copy the array since .removeEdge will need to traverse the existing array again
                    for (let i = 0; i<len; i++){
                        tempArr[i].removeEdge(instance)
                    }
                    //instance._canvas._canvas.removeChild(node) need to change this so that node removal is done on the canvas object
                    instance._canvas.removeNode(instance)
                    break
                case pointer.edgeState():
                    let edge = instance._canvas.getActiveEdge()
                    let canAdd = instance._canAddEdge(edge)
                    let node1 = instance._canvas.getSelectedNode()
                    if (node1.getNode() != this && edge != null && canAdd){
                        instance.addEdge(edge)
                        
                        edge.setSecondNode(instance)
                        pointer.setDefaultState()
                        instance._canvas.setEdge(null)
                    }else if (!canAdd){
                        edge.removeEdge()
                    }
            }
        })
    }
    _moveListener(pointer,firstNode,instance){
        let toolBarHeight = pointer.getToolBarHeight()
        firstNode.addEventListener("mousemove",function(event){
            if (pointer.isDefaultState() && firstNode.style["cursor"] === "grabbing"){
                let newX = event.clientX
                let newY = event.clientY - toolBarHeight
                instance.moveNode(newX,newY)
                //need to pass the coordinated to the edge and have them move
                for (let i = 0;i < instance._edgeNum; i++){
                    //this loop will update the endpoint of all the firstNodes
                    //this has to take O(n) time no matter what since we always have to update each firstNode
                    instance._edge[i].updatePos(instance,newX,newY)
                }
            }
            else if (pointer.isEraseState() && (firstNode.style["cursor"] === "grab" || firstNode.style["cursor"] === "")){
                
                firstNode.style["cursor"] = "none"
            }
        })
        this._canvas._canvas.addEventListener("mousemove",function(event){
            //this canvas event listener modifies the position of the firstNode
            if (pointer.isDefaultState() && firstNode.style["cursor"] === "grabbing"){
                let newX = event.clientX
                let newY = event.clientY - toolBarHeight
                instance.moveNode(newX,newY)
                //need to pass the coordinated to the edge and have them move
                for (let i = 0;i < instance._edgeNum; i++){
                    //this loop will update the endpoint of all the firstNodes
                    //this has to take O(n) time no matter what since we always have to update each firstNode
                    instance._edge[i].updatePos(instance,newX,newY)
                }
            }
        })
    }
    activateNode(){
        //node should only be activatable in default state
        this._firstNode.setAttribute("stroke","green")
        this._firstNode.setAttribute("stroke-dasharray","2")
        this._firstNode.setAttribute("stroke-width","3")
        this._active = true
        this._canvas.setSelectedNode(this)
        this.activateAddEdgeBtn()
    }
    deactivateNode(){
        this._firstNode.setAttribute("stroke","")
        this._firstNode.setAttribute("stroke-dasharray","")
        this._firstNode.setAttribute("stroke-width","")
        this._active = false
        this.deavtivateAddEdgeBtn()
        this._canvas.deleteCurNode()
    }
    updateState(){
        if (this._active){
            this.deactivateNode()
        }else{
            this.activateNode()
        }
    }
}