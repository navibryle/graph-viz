class Pointer{
    constructor(){
        this._state = "default"
    }
    setNodeState(){
        this._state = "node"
    }
    setEraseState(){
        this._state = "erase"
    }
    setDefaultState(){
        this._state = "default"
    }
    isEraseState(){
        return this._state === "erase" ? true:false
    }
    isNodeState(){
        return "node"
    }
    isDefaultState(){
        return "default"
    }
    getState(){
        return this._state
    }
}