class Graph{
    //this class should represent the canvas
    //this class will collect all the nodes
    constructor(canvasId){
        this._size = 0
        this._nodes = []//the id of each node in this list should be the same as its index
        //the root will always be the first element in this list
        this._canvas = null
        this.checkCanvasId(canvasId)//will check if the canvas id is correct
        this._selected = null
    }
    addNode(node){
        //this will add node to the canvas
        //node must be of type Node
        this._size += 1
        this._nodes.push(node)
        this._canvas.appendChild(node)
    }
    clickedNode(node){
        if (this._selected === null){
            this._selected = node
        }else if (this._selected != node && this._selected != null){
            this._selected.updateState()
            this._selected = node
        }else{
            //this will happen when this._selected === node
            this._selected = null
        }
    }
    isSelected(){
        return this._selected
    }
    checkCanvasId(canvasId){
        try{
            this._canvas = document.getElementById(canvasId)
        }
        catch{
            console.error("Incorrect canvas Id has been used")
        }
    }
}