class Node{
    constructor (x,y,id,canvas,addEdge){
        //x and y are the respective coordinates on which to place the node in the svg canvas
        this._id = id//id should count up from 0 to one.
        this._radius = "15"
        this._cx = x//this will be the initial coordinate before the translation
        this._cy = y//this will be the initial coordinate before the translation
        this._fill = "black"
        this._node = document.createElementNS("http://www.w3.org/2000/svg","circle")
        this._active = false //true if the node has been clicked and the option to add an edge is available
        this._canBeClicked = false //this will be used to validate the if a click can be considered a "quickClick"
        this._canvas = canvas
        this._addEdgeBtn = document.getElementById(addEdge)
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
    nodeEventListenerPointer(pointer){
        var node = this._node
        var instance = this
        this._node.addEventListener("click",function(event){
            switch(pointer.getState()){
                case pointer.eraseState():
                    document.getElementById("canvas").removeChild(node)
                    break
                case pointer.edgeState():
                    //clicked on a node with the intention of permanently setting 
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
                node.setAttribute("cx",event.clientX)
                node.setAttribute("cy",event.clientY - toolBarHeight)
                instance._cx = event.clientX
                instance._cy = event.clientY - toolBarHeight
            }
            else if (pointer.isEraseState()){
                node.style["cursor"] = "none"
            }
        })
        this._canvas._canvas.addEventListener("mousemove",function(event){
            if (node.style["cursor"] === "grabbing" && pointer.isDefaultState()){
                node.setAttribute("cx",event.clientX)
                node.setAttribute("cy",event.clientY - toolBarHeight)
                instance._cx = event.clientX
                instance._cy = event.clientY - toolBarHeight
            }
        })
    }
    activateNode(){
        //node should only be activatable in default state
        this._node.setAttribute("stroke","green")
        this._node.setAttribute("stroke-dasharray","2")
        this._node.setAttribute("stroke-width","3")
        this._active = true
        this._canvas.storeNode(this)
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
    getNode(){ 
        this._node.setAttribute("r",this._radius)
        this._node.setAttribute("cx",this._cx)
        this._node.setAttribute("cy",this._cy)
        this._node.setAttribute("fill",this._fill)
        this._node.setAttribute("class","node")
        this._node.id = `${this._id}`
        return this._node
    }
    activateAddEdgeBtn(){
        this._addEdgeBtn.style["opacity"] = "1"
    }
    deavtivateAddEdgeBtn(){
        this._addEdgeBtn.style["opacity"] = "0"
    }
}