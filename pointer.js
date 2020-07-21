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
        this._canvas.removeEventListener("mousemove")
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
        //======parameters to be passed to event listener====
        this._canvas.initX = null
        this._canvas.initY = null
        this._canvas.count = 0
        this._canvas.cursor = this._eraserCursor
        //======parameters to be passed to event listener====
        this._canvas.addEventListener("mousemove",this.eraseEvent)
    }
    eraseEvent(event){
        let cursor = event.target.cursor
        if (event.count === 0 || event.initX === null || event.initY === null){
            cursor.style["opacity"] = 1
            event.target.initX = event.clientX
            event.target.initY = event.clientY
            cursor.style["top"] = initY
            cursor.style["left"] = initX
            count += 1
        }else{
            requestAnimationFrame(function(){
                cursor.style.transform = `translate(${event.clientX-event.target.initX}px,${event.clientY-event.target.initY+12}px)`//+12 to place the image on top of the cursor
            })
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