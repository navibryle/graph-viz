class Queue{
    constructor(){
        self._queue = []
    }
    getSize(){
        return self._queue.length
    }
    enqueue(path){
        //path needs to be a tuple of three items like so := (starting node,end node,edge)
        self._queue.push(path)
    }
    dequeue(){
        var val = self._queue[0]
        self._queue.shift()
        return val
    }
}