//============= event listeners =============
function addNodeEventListener (pointer){
    // this will change the cursor of a user into a node
    let addBtn = document.getElementById("addNode")
    addBtn.addEventListener("click",function (){
        if (!pointer.isNodeState()){
            pointer.setNodeState()
        }
    })
}
function deleteNodeEventListener(pointer){
    let eraseBtn = document.getElementById("removeNode")
    eraseBtn.addEventListener("click",function (){
        if (!pointer.isEraseState()){
            pointer.setEraseState()
        }
    })
}
function canvasNodeEventListener(pointer,id,graph){
    /*
    cases:
        -clicked on a node
        -clicked on a white space 
        -with node cursor
        -with eraser cursor
    creating node:
        can specify the center of the node within the viewbox.
        
    */
    canvas.addEventListener("click",function(event){
        switch (pointer.getState()){
            case "node":
                let toolbarHeight = canvas.getBoundingClientRect().top
                let xCoord = event.clientX+16//16 is to account for the offset of the pointer
                let yCoord = event.clientY - toolbarHeight+16//16 is to account for the offset of the pointer
                let newNode = new Node(xCoord,yCoord,id.getIdIncrement(),graph)
                newNode.nodeEventListenerPointer(pointer)
                graph.addNode(newNode.getNode())
                pointer.setDefaultState()
                break

        }
    })
}
//============= event listeners end =========
//============= test ========================
//============= test end ====================

function main(){
    var addNodeSvg = `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width = "32px" height = "32px"> <circle r = "15px" cx = "16px" cy = "16px" fill = "black"/></svg>'),default`
    var delNodeSvg = `url('data:image/svg+xml;utf8,<svg width="32" height="32" xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd" fill = "green"><path d="M5.662 23l-5.369-5.365c-.195-.195-.293-.45-.293-.707 0-.256.098-.512.293-.707l14.929-14.928c.195-.194.451-.293.707-.293.255 0 .512.099.707.293l7.071 7.073c.196.195.293.451.293.708 0 .256-.097.511-.293.707l-11.216 11.219h5.514v2h-12.343zm3.657-2l-5.486-5.486-1.419 1.414 4.076 4.072h2.829zm6.605-17.581l-10.677 10.68 5.658 5.659 10.676-10.682-5.657-5.657z"/></svg>'),default`
    var pointer = new Pointer(addNodeSvg,delNodeSvg,"canvas","erase-cursor","toolbar")
    var id = new IdGen()
    var graph = new Graph("canvas")
    addNodeEventListener(pointer)
    deleteNodeEventListener(pointer)
    canvasNodeEventListener(pointer,id,graph)

}
main()