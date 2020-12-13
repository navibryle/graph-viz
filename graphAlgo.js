class GraphAlgo{
    constructor(canvas){
        this.canvas = canvas
    }
    dfs(startingNode){
        let frontier = []
        let init = 0 //this is just to make sure the while loop executes the first iteration.
        let curNode = startingNode
        let edges
        let lenEdges
        let prog
        
        while ((frontier != undefined && frontier.length != 0) || init != null){
            
            
            
            if (frontier != undefined && frontier.length != 0){
                console.log(frontier)
                prog = frontier.pop()
                console.log(frontier)
                console.log("PROGED NEW NODE")
                prog[1].setProged(true)
                this.canvas.progNode(prog[0],prog[1].getOppositeNode(prog[0]))
                
                curNode = prog[1].getOppositeNode(prog[0])
            }
            
            edges = curNode.getEdges()
            lenEdges = edges.length
            for (let i = 0; i < lenEdges; i++){
                console.log("REEEEEEEEEE")
                if (edges[i].getProged() == false){
                    console.log("ADDED NEW EDGE")
                    frontier.push([curNode,edges[i]])
                }
            }
            
            init = null
        }
    }
}