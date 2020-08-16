class Node{
    constructor (x,y,id,canvas,addEdge){
        //x and y are the respective coordinates on which to place the node in the svg canvas
        this._id = id//id should count up from 0 to one.
        this._radius = "15"
        this._cx = x//this will be the initial coordinate before the translation
        this._cy = y//this will be the initial coordinate before the translation
        this._fill = "black"
        this._node = document.createElementNS("http://www.w3.org/2000/svg","circle")
        this._runtimeNode = document.createElementNS("http://www.w3.org/2000/svg","circle")
        this._active = false //true if the node has been clicked and the option to add an edge is available
        this._canBeClicked = false //this will be used to validate the if a click can be considered a "quickClick"
        this._canvas = canvas
        this._addEdgeBtn = document.getElementById(addEdge)
        this._edge = []
        this._edgeNum = 0
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
    _quickClickInterval(instance){
        instance._canBeClicked = true
        window.setTimeout(function(){
            instance._canBeClicked = false
        },100)
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
    nodeEventListenerPointer(pointer){
        var node = this._node
        var instance = this
        this._node.addEventListener("click",function(event){
            event.stopPropagation()
            switch(pointer.getState()){
                case pointer.eraseState():
                    instance._canvas._canvas.removeChild(node)
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
        this._node.addEventListener("mousedown",function(event){
            instance._quickClickInterval(instance)
            switch(pointer.getState()){
                case pointer.defaultState():
                    node.style["cursor"] = "grabbing"

                    break
            }
        })
        this._node.addEventListener("mouseup",function(event){
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
        this._nodeEventListener(pointer)
    }
    _nodeEventListener(pointer){
        let node = this._node
        let toolBarHeight = pointer.getToolBarHeight()
        let instance = this
        node.addEventListener("mousemove",function(event){
            if (pointer.isDefaultState() && node.style["cursor"] === "grabbing"){
                let newX = event.clientX
                let newY = event.clientY - toolBarHeight
                node.setAttribute("cx",newX)
                node.setAttribute("cy",newY)
                instance._cx = newX
                instance._cy = newY
                //need to pass the coordinated to the edge and have them move
                for (let i = 0;i < instance._edgeNum; i++){
                    //this loop will update the endpoint of all the nodes
                    //this has to take O(n) time no matter what since we always have to update each node
                    instance._edge[i].updatePos(instance,newX,newY)
                }
            }
            else if (pointer.isEraseState() && node.style["cursor"] === "grab"){
                
                node.style["cursor"] = "none"
            }
        })
        this._canvas._canvas.addEventListener("mousemove",function(event){
            if (pointer.isDefaultState() && node.style["cursor"] === "grabbing"){
                let newX = event.clientX
                let newY = event.clientY - toolBarHeight
                node.setAttribute("cx",newX)
                node.setAttribute("cy",newY)
                instance._cx = newX
                instance._cy = newY
                //need to pass the coordinated to the edge and have them move
                for (let i = 0;i < instance._edgeNum; i++){
                    //this loop will update the endpoint of all the nodes
                    //this has to take O(n) time no matter what since we always have to update each node
                    instance._edge[i].updatePos(instance,newX,newY)
                }
            }
        })
    }
    activateNode(){
        //node should only be activatable in default state
        this._node.setAttribute("stroke","green")
        this._node.setAttribute("stroke-dasharray","2")
        this._node.setAttribute("stroke-width","3")
        this._active = true
        this._canvas.setSelectedNode(this)
        this.activateAddEdgeBtn()
    }
    deactivateNode(){
        this._node.setAttribute("stroke","")
        this._node.setAttribute("stroke-dasharray","")
        this._node.setAttribute("stroke-width","")
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
    initNode(){ 
        this._node.setAttribute("r",this._radius)
        this._node.setAttribute("cx",this._cx)
        this._node.setAttribute("cy",this._cy)
        this._node.setAttribute("fill",this._fill)
        this._node.setAttribute("class","node")
        this._node.id = `${this._id}`
        return this._node
    }
    getNode(){
        return this._node
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
}