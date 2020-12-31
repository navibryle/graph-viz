class GraphAlgo{
    constructor(){
        this._queue = new Queue()
    }
    dfs(startingNode){
        let frontier = []
        let curNode = startingNode
        let edges = startingNode.getEdges()
        this.addToFrontier(curNode,edges,frontier)
        let prog
        while(frontier != undefined && frontier.length != 0){
            prog = frontier.pop()
            curNode = prog[1].getOppositeNode(prog[0])
            prog[1].setProged(true)
            this._queue.enqueue([prog[0],prog[1].getOppositeNode(prog[0]),prog[1]])
            edges = curNode.getEdges()
            this.addToFrontier(curNode,edges,frontier)
        }
    }
    addToFrontier(curNode,edges,frontier){
        let lenEdges = edges.length
            for (let i = 0; i < lenEdges; i++){
                if (edges[i].getProged() == false){
                    frontier.push([curNode,edges[i]])
                }
            }
    }
    getSize(){
        return this._queue.getSize()
    }
    getNextEdge(){
        return this._queue.dequeue()
    }
    bfs(startingNode){
        let frontier = []
        let curNode = startingNode
        let edges = startingNode.getEdges()
        this.addToFrontier(curNode,edges,frontier)
        let prog
        while(frontier != undefined && frontier.length != 0){
            prog = frontier[0]
            frontier.shift()
            curNode = prog[1].getOppositeNode(prog[0])
            prog[1].setProged(true)
            this._queue.enqueue([prog[0],prog[1].getOppositeNode(prog[0]),prog[1]])
            edges = curNode.getEdges()
            this.addToFrontier(curNode,edges,frontier)
        }
    }
}