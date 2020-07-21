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
        let initX = null
        let initY = null
        let count = 0
        let cursor = this._eraserCursor
        //======parameters to be passed to event listener====
        let xCoord = 0;
        let yCoord = 0;
        this._canvas.addEventListener("mousemove",function(event){
            if (count === 0){
                initX = event.clientX
                initY = event.clientY
                cursor.style["top"] = `${initY}px`
                cursor.style["left"] = `${initX}px`
                cursor.style["opacity"] = "1"
                count +=1
                xCoord = initX
                yCoord = initY
            }else{
                xCoord = event.clientX
                yCoord = event.clientY
            }
        })
        const eraseEvent = () =>{
            this._eraserCursor.style.transform = `translate(${xCoord-initX}px,${yCoord-initY-15}px)`//+12 to place the image on top of the cursor
            requestAnimationFrame(eraseEvent)
        }
        requestAnimationFrame(eraseEvent)
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