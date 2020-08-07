class Pointer{
    constructor(nodeSvg,eraseSvg,canvasId,eraserCursorId,toolbarId){
        this._state = "default"
        this._nodeSvg = nodeSvg
        this._eraseSvg = eraseSvg
        this._canvas = document.getElementById(canvasId)
        this._eraserCursor = document.getElementById(eraserCursorId)
        this._toolbar = document.getElementById(toolbarId)
    }
    removeEraseEventListener(){
        //cursor id is the id of the dome node that is acting as the cursor
        if (this.isEraseState()){
            this._canvas.removeEventListener("mousemove",this.canvasEraseCursor)
            this._eraserCursor.removeEventListener("mousemove",this.canvasEraseCursor)
            this._toolbar.removeEventListener("mousemove",this.toolbarEraseCursor)
            this._eraserCursor.style["left"] = "-200px"
        }
    }
    setNodeState(){
        this.removeEraseEventListener()
        this._state = "node"
        this._canvas.style["cursor"] = this._nodeSvg
    }
    setEraseState(){
        //cursor id is the id of the dome node that is acting as the cursor
        this._state = "erase"
        //======parameters to be passed to event listener====
        this._canvas.initX = null
        this._canvas.initY = null
        this._canvas.count = 0
        this._canvas.cursor = this._eraserCursor
        this._canvas.style["cursor"] = "none"
        this._canvas.xCoord = null
        this._canvas.yCoord = null
        this._canvas.src = this
        this._eraserCursor.src = this
        this._toolbar.src = this
        //======parameters to be passed to event listener end====
        this._canvas.addEventListener("mousemove",this.canvasEraseCursor)
        this._eraserCursor.addEventListener("mousemove",this.canvasEraseCursor)
        this._toolbar.addEventListener("mousemove",this.toobarEraseCursor)
        //==============loop to make sure the cursor updates as soon as possible==============
        const eraseEvent = () =>{
            this._eraserCursor.style.transform = `translate(${this._canvas.xCoord-this._canvas.initX-5}px,
                ${this._canvas.yCoord-this._canvas.initY-25}px)`//the constants are there to make sure the pointer is offset under the eraserCurosr
            requestAnimationFrame(eraseEvent)
        }
        requestAnimationFrame(eraseEvent)
        //====================================================================================
    }
    toobarEraseCursor(event){
        //makes sure that the cursor goes back to default when in the toolbar
        if (event.currentTarget.src._eraserCursor.style["opacity"] != "0"){
            event.currentTarget.src._eraserCursor.style["opacity"] = "0"
        }
    }
    canvasEraseCursor(event){
        let cursor = event.currentTarget === event.currentTarget.src._canvas ? event.currentTarget : event.currentTarget.src._canvas
        //=============== makes sure that the cursor goes back to default in when in the toolbar===
        if (cursor.count != 0 && event.clientY >= cursor.initY){
            event.currentTarget.src._eraserCursor.style["opacity"] = "1"
        }else{
            event.currentTarget.src._eraserCursor.style["opacity"] = "0"
        }
        //==========================================================================================
        if (cursor.count === 0){
            cursor.initX = event.clientX
            cursor.initY = event.clientY
            cursor.cursor.style["top"] = `${cursor.initY}px`
            cursor.cursor.style["left"] = `${cursor.initX}px`
            cursor.count +=1
            event.currentTarget.src._eraserCursor.style["opacity"] = "1"
            cursor.xCoord = cursor.initX
            cursor.yCoord = cursor.initY
        }else{
            cursor.xCoord = event.clientX
            cursor.yCoord = event.clientY
        }
    }
    setDefaultState(){
        this.removeEraseEventListener()
        this._state = "default"
        this._canvas.style["cursor"] = "auto"
    }
    setEdgeState(){
        this.removeEraseEventListener()
        this._state = "edge"
        this._canvas.style["cursor"] = "crosshair"
    }
    isEraseState(){
        return this._state === "erase" ? true:false
    }
    isNodeState(){
        return this._state === "node" ? true:false
    }
    isDefaultState(){
        return this._state === "default" ? true:false
    }
    isEdgeState(){
        return this._state === "edge" ? true:false
    }
    getState(){
        return this._state
    }
    eraseState(){
        return "erase"
    }
    defaultState(){
        return "default"
    }
    nodeState(){
        return "node"
    }
    edgeState(){
        return "edge"
    }
    getToolBarHeight(){
        return this._toolbar.getBoundingClientRect().bottom
    }
}