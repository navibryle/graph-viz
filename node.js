class Node{
    constructor (x,y,id,canvas){
        //x and y are the respective coordinates on which to place the node in the svg canvas
        this._id = id//id should count up from 0 to one.
        this._radius = "15"
        this._cx = x
        this._cy = y
        this._fill = "black"
        this._node = document.createElementNS("http://www.w3.org/2000/svg","circle")
        this._active = false //true if the node has been clicked and the option to add an edge is available
        this._canBeClicked = false //this will be used to validate the if a click can be considered a "quickClick"
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
    quickClickInterval(instance){
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
            }
        })
        this._node.addEventListener("mousedown",function(event){
            instance.quickClickInterval(instance)
            switch(pointer.getState()){
                case pointer.defaultState():
                    node.style["cursor"] = "grabbing"
                    break
            }
        })
        this._node.addEventListener("mouseup",function(event){
            if (instance._canBeClicked === true){
                instance._canvas.clickedNode(instance)
                instance.updateState()
                instance._canBeClicked = false
            }
            switch(pointer.getState()){
                case pointer.defaultState():
                    node.style["cursor"] = "grab"
                    break
            }
        })
        this.nodeEventListener(pointer)
    }
    nodeEventListener(pointer){
        let node = this._node
        let instance = this
        let toolBarHeight = pointer.getToolBarHeight()
        let xInit = this._cx
        let yInit = this._cy+toolBarHeight// "getBoundingClientRect" is used to get the toolbar height
        node.addEventListener("mousemove",function(event){
            if (pointer.isDefaultState() && node.style["cursor"] === "grabbing"){
                node.style.transform = `translate(${event.clientX-xInit}px,${event.clientY-yInit}px)`
                //need to update actual cx and cy value of the element here
            }
            else if (pointer.isEraseState()){
                node.style["cursor"] = "none"
            }
        })
    }
    updateState(){
        if (this._active){
            this._node.setAttribute("stroke","")
            this._node.setAttribute("stroke-dasharray","")
            this._node.setAttribute("stroke-width","")
            //use element.classList.remove("class_name") instead after your done testing
            this._active = false
        }else{
            this._node.setAttribute("stroke","green")
            this._node.setAttribute("stroke-dasharray","2")
            this._node.setAttribute("stroke-width","3")
            this._active = true
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
    
}