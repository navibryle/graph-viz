class Pointer{
    constructor(nodeSvg,eraseSvg,canvasId,eraserCursorId){
        this._state = "default"
        this._nodeSvg = nodeSvg
        this._eraseSvg = eraseSvg
        this._canvas = document.getElementById(canvasId)
        this._eraserCursor = document.getElementById(eraserCursorId)

    }
    removeEraseEventListener(){
        //cursor id is the id of the dome node that is acting as the cursor
        this._canvas.removeEventListener("mousemove",this.adjustCursor)
        this._eraserCursor.style["left"] = "-200px"
    }
    setNodeState(){
        this.removeEraseEventListener()
        this._state = "node"
        this._canvas.style["cursor"] = this._nodeSvg
    }
    setEraseState(){
        //cursor id is the id of the dome node that is acting as the cursor
        this._state = "erase"
        /*this._canvas.style["cursor"] = "none"*/
        let xCoord = null
        let yCoord = null
        let initX = null
        let initY = null
        //======parameters to be passed to event listener====
        this._canvas.initX = initX
        this._canvas.initY = initY
        this._canvas.count = 0
        this._canvas.cursor = this._eraserCursor
        this._canvas.style["cursor"] = "none"
        this._canvas.xCoord = xCoord;
        this._canvas.yCoord = yCoord;
        this._canvas.src = this
        this._eraserCursor.src = this
        //======parameters to be passed to event listener====
        this._canvas.addEventListener("mousemove",this.canvasEraseCursor)
        this._eraserCursor.addEventListener("mousemove",this.canvasEraseCursor)
        //this._eraserCursor.addEventListener("mousemove",this.adjustCursor)
        const eraseEvent = () =>{
            this._eraserCursor.style.transform = `translate(${this._canvas.xCoord-this._canvas.initX}px,${this._canvas.yCoord-this._canvas.initY-15}px)`//+12 to place the image on top of the cursor
            requestAnimationFrame(eraseEvent)
        }
        requestAnimationFrame(eraseEvent)
    }
   canvasEraseCursor(event){
        let cursor = event.currentTarget === event.currentTarget.src._canvas ? event.currentTarget : event.currentTarget.src._canvas
        if (cursor.count === 0){
            cursor.initX = event.clientX
            cursor.initY = event.clientY
            cursor.cursor.style["top"] = `${cursor.initY}px`
            cursor.cursor.style["left"] = `${cursor.initX}px`
            cursor.cursor.style["opacity"] = "1"
            cursor.count +=1
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
    isEraseState(){
        return this._state === "erase" ? true:false
    }
    isNodeState(){
        return this._state === "node" ? true:false
    }
    isDefaultState(){
        return this._state === "default" ? true:false
    }
    getState(){
        return this._state
    }
}