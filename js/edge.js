class Edge{
    constructor(canvas,pointer,id){
        //init node is the which will be one of the endpoints of the edge
        this._id = id
        this._node1 = canvas.getSelectedNode()//node1 is associated with the x1 and y1 coordinates
        this._node2 = null//node2 is associated with the x2 and y2 coordiantes
        this._edge = document.createElementNS("http://www.w3.org/2000/svg","line")
        this._canvas = canvas
        this._pointer = pointer  
        this._rightMost = null//this will keep track of the right most node
        this._leftMost = null
        this._topMost = null
        this._bottomMost = null
    }
    getFirstNode(){
        return this._node1
    }
    getSecondNode(){
        return this._node2
    }
    getEdge(){
        return this._edge
    }
    getX1(){
        return this._edge.getAttribute("x1")
    }
    getY1(){
        return this._edge.getAttribute("y1")
    }
    getX2(){
        return this._edge.getAttribute("x2")
    }
    getY2(){
        return this._edge.getAttribute("y2")
    }
    _setEndOrientation(){
        if (this._node1 != null && this._node2 != null){
            if (this._node1.getCx() > this._node2.getCx()){
                this._leftMost = this._node2
                this._rightMost = this._node1
            }else{
                this._leftMost = this._node1
                this._rightMost = this._node2
            }
            if (this._node1.getCy() > this._node2.getCy()){
                this._topMost = this._node2
                this._bottomMost = this._node1
            }else{
                this._topMost = this._node1
                this._bottomMost = this._node2
            }
        }
        else{
            console.error("orientation cant be set since node 2 is still not set")
        }
    }
    getOppositeNode(node){
        //this will get the node that is opposite to this one
        if (node === this._node1){
            return this._node2
        }else{
            return this._node1
        }
    }
}
class EdgeStack extends Edge{
    //this just needs to move with the black edge
    //need to set the clipping rectangle
    //just need to update the coordinates of the rectangle when the edge moves 
    constructor(canvas,pointer,id){
        super(canvas,pointer,id)
        this._progEdge = document.createElementNS("http://www.w3.org/2000/svg","line")
        this._subGrp = document.createElementNS("http://www.w3.org/2000/svg","g")
        this._mainGrp = document.createElementNS("http://www.w3.org/2000/svg","g")
        this._initEdgeStack()
    }
    static _appendTo(parent,child){
        parent.appendChild(child)
    }
    static _getEdgeCoords(edge){
        //edge is the dom node
        //will return a list containing the four coordinates in the order: x1,y1,x2,y2 and they will be integers
        return [parseInt(edge.getAttribute("x1"),10),parseInt(edge.getAttribute("y1"),10),parseInt(edge.getAttribute("x2"),10),parseInt(edge.getAttribute("y2"),10)]
    }
    _initEdgeStack(){
        this._createProgEdge()
        this._createBlackEdge()
        this.updateNode1Endpoint(this._node1.getCx(),this._node1.getCy())
        this._initMainGrp()
    }
    _createProgEdge(){
        this._progEdge.setAttribute("stroke-width","7px")
        this._progEdge.setAttribute("stroke","blue")
        this._edge.classList = "edge-unclickable edge"
    }
    _createBlackEdge(){
        this._edge.setAttribute("stroke-width","7px")
        this._edge.setAttribute("stroke","black")
        this._edge.classList = "edge-unclickable edge"
    }
    removeEdge(){
        //this will remove the edge from the dom tree
        if (this._canvas.getActiveEdge() === this){
            this._canvas.setEdge(null)
            this._pointer.setDefaultState()
        }
        if (this._node2 != null){
            this._node2.removeEdge(this)
        }
        this._node1.removeEdge(this)
        this._canvas.removeEdge(this)
    }
    _initMainGrp(){
        EdgeStack._appendTo(this._subGrp,this._edge)
        EdgeStack._appendTo(this._mainGrp,this._progEdge)
        EdgeStack._appendTo(this._mainGrp,this._subGrp)
    }
    getMainGrp(){
        return this._mainGrp
    }
}
class EdgeProg extends EdgeStack{
    constructor(canvas,pointer,id){
        super(canvas,pointer,id)
        this._proged = false // this will be true if the edge has already been proged
        this._rect = document.createElementNS("http://www.w3.org/2000/svg","polygon")
        this._clipPath = document.createElementNS("http://www.w3.org/2000/svg","clipPath")
        this._rectP1 = {x:parseInt(this.getX1(),10),y:parseInt(this.getY1(),10)}
        this._rectP2 = {x:null,y:null}
        this._rectP3 = {x:parseInt(this.getX2(),10),y:parseInt(this.getY2(),10)}
        this._rectP4 = {x:null,y:null}
        this._initDefs()
    }
    static _appendTo(parent,child){
        parent.appendChild(child)
    }
    getProged(){
        return this._proged
    }
    setProged(val){
        this._proged = val
    }
    _initDefs(){
        this._clipPath.setAttribute("id",`edge${this._id}`)
        EdgeProg._appendTo(this._clipPath,this._rect)
    }
    getDefs(){
        return this._clipPath
    }
    static _pointIsNull(point){
        //point object needs to have an x and y component
        if (point === undefined || point === null || (point.x === null && point.y === null)){
            return true
        }
        return  false
    }
    _pointsAreNull(){
        return EdgeProg._pointIsNull(this._rectP2) && EdgeProg._pointIsNull(this._rectP3) && EdgeProg._pointIsNull(this._rectP4)
    }
    
    _updateP2(x1,y2,xDelta,yDelta){
        //this function will update both the x and y coordinate of this._rect
        //we have 4 cases x's are close,y's are close, neither are close,both x's and y's are close
        if (Math.abs(xDelta) <= 20 && Math.abs(yDelta) <= 20){
            if (Math.abs(xDelta) > Math.abs(yDelta)){
                if (xDelta >= 0){
                    this._rectP2.x = x1 + 70
                    this._rectP1.x -= 70
                }else{
                    this._rectP2.x = x1 - 70
                    this._rectP1.x += 70
                }
                this._rectP2.y = this._rectP1.y
            }else{
                if (yDelta >= 0){
                    this._rectP2.y = y2 - 70
                    this._rectP1.y += 70
                }else{
                    this._rectP2.y = y2 + 70
                    this._rectP1.y -= 70
                }
                this._rectP2.x = this._rectP1.x
            }
        }
        else if (Math.abs(xDelta) <= 20){
            if (xDelta >= 0){
                this._rectP2.x = x1 + 70
                this._rectP1.x -= 70
            }else{
                this._rectP2.x = x1 - 70
                this._rectP1.x += 70
            }
            this._rectP2.y = this._rectP1.y
        }
        else if (Math.abs(yDelta) <= 20){
            if (yDelta >= 0){
                this._rectP2.y = y2 - 70
                this._rectP1.y += 70
            }else{
                this._rectP2.y = y2 + 70
                this._rectP1.y -= 70
            }
            this._rectP2.x = this._rectP1.x
        }else{
            this._rectP2.x = x1
            this._rectP2.y = y2
        }
    }
    _updateP4(x2,y1,xDelta,yDelta){
        //this function will update both the x and y coordinate of p2
        //we have 4 cases x's are close,y's are close, neither are close,both x's and y's are close
        if (Math.abs(xDelta) <= 20 && Math.abs(yDelta) <= 20){
            if (Math.abs(xDelta) > Math.abs(yDelta)){
                if (xDelta >= 0){
                    this._rectP4.x = x2 + 70
                    this._rectP3.x -= 70
                }else{
                    this._rectP4.x = x2 - 70
                    this._rectP3.x += 70
                }
                this._rectP4.y = this._rectP3.y
            }else{
                if (yDelta >= 0){
                    this._rectP4.y = y1 - 70
                    this._rectP3.y += 70
                }else{
                    this._rectP4.y = y1 + 70
                    this._rectP3.y -= 70
                }
                this._rectP2.x = this._rectP1.x
            }
        }
        else if (Math.abs(xDelta) <= 20){
            if (xDelta >= 0){
                this._rectP4.x = x2 + 70
                this._rectP3.x -= 70
            }else{
                this._rectP4.x = x2 - 70
                this._rectP3.x += 70
            }
            this._rectP4.y = this._rectP3.y
        }
        else if (Math.abs(yDelta) <= 20){
            if (yDelta >= 0){
                this._rectP4.y = y1 - 70
                this._rectP3.y += 70
            }else{
                this._rectP4.y = y1 + 70
                this._rectP3.y -= 70
            }
            this._rectP4.x = this._rectP3.x
        }else{
            this._rectP4.x = x2
            this._rectP4.y = y1
        }
    }
    _initRectCoord(){
        //this should only ever be called once when the second node is set
        if (this._pointsAreNull()){
            this._updatePoints()
        }
    }
    static getLineLength(x1,y1,x2,y2){
        let xComp = (x2-x1)*(x2-x1)
        let yComp = (y2-y1)*(y2-y1)
        let length = Math.sqrt(xComp + yComp)
        return length
    }
    _assignPoints(nodeFrom,nodeTo,point){
        //this function will detect if the point is _rectP1 or _rectP3and will assign the corresponding node that is the same as point to nodeFrom
        //and the other point will be assinged to nodeTo
        let coord = {x:Math.floor(point._cx),y:Math.floor(point._cy)}
        if (this._similarPoint(coord,this._rectP1)){ 
            nodeFrom = this._rectP1
            nodeTo = this._rectP3
        }else{
            nodeFrom = this._rectP3
            nodeTo = this._rectP1
        }
        return [nodeFrom,nodeTo]
    }
    _similarPoint(point1,rectPoint){
        let boolX = false
        let boolY = false
        if (Math.abs(this._node1.getCx() - this._node2.getCx()) <= 20){
            if (point1.x+70 === rectPoint.x || point1.x-70 === rectPoint.x || point1.x-70 === rectPoint.x+70 || point1.x+70 === rectPoint.x-70){
                boolX = true
            }
        }else{
            if (point1.x === rectPoint.x){
                boolX = true
            }
        }
        if (Math.abs(this._node1.getCy() - this._node2.getCy()) <= 20){
            if (point1.y+70 === rectPoint.y || point1.y-70 === rectPoint.y || point1.y-70 === rectPoint.y+70 || point1.y+70 === rectPoint.y-70){
                boolY = true
            }
        }else{
            if (point1.y === rectPoint.y){
                boolY = true
            }
        }
        return boolX && boolY
    }
    progFrom(point){
        this._lineUp()
        this._node1.setUnclickable()
        this._node2.setUnclickable()
        let adjacentPoint = null
        let corresP = null// the corresponding point to p1 that has simlar y coord
        let corresAdj = null// the corresponding pint to the adjacent point that has similar y coordinate
        let dir = null//this will be the direction that the node needs be proged in
        let nodeFrom = {x:null,y:null};
        let nodeTo = {x:null,y:null};
        let output = this._assignPoints(nodeFrom,nodeTo,point)
        nodeFrom = output[0]
        nodeTo = output[1]
        // need to account for the deviance
        
        if (Math.abs(this._rectP1.x - this._rectP3.x) > Math.abs(this._rectP1.y - this._rectP3.y)){
            dir = 'x'
            adjacentPoint = this.similarX(nodeFrom,[this._rectP1,this._rectP2,this._rectP3,this._rectP4])
            corresP = this.similarY(nodeFrom,[this._rectP1,this._rectP2,this._rectP3,this._rectP4])
            corresAdj = this.similarY(adjacentPoint,[this._rectP1,this._rectP2,this._rectP3,this._rectP4])
        }else{
            dir = 'y'
            adjacentPoint = this.similarY(nodeFrom,[this._rectP1,this._rectP2,this._rectP3,this._rectP4])
            corresP = this.similarX(nodeFrom,[this._rectP1,this._rectP2,this._rectP3,this._rectP4])
            corresAdj = this.similarX(adjacentPoint,[this._rectP1,this._rectP2,this._rectP3,this._rectP4])
        }
        this._rectP1 = nodeFrom
        this._rectP2 = adjacentPoint
        this._rectP3 = corresAdj
        this._rectP4 = corresP
        this._updateRectPointsDom()
        this.prog(nodeFrom,adjacentPoint,corresP,corresAdj,dir,this.getOppositeNode(point))
    }
    prog(point,adjacentPoint,corresP,corresAdj,dir,targetNode){
        let intervalId
        this._subGrp.setAttribute("clip-path",`url(#edge${this._id})`)
       
        const intervalCb = () =>{
            if (point.x != corresP.x || point.y != corresP.y){
                this.coordToCoord(point,corresP,dir)
                this.coordToCoord(adjacentPoint,corresAdj,dir)
                this._rectP1 = point
                this._updateRectPointsDom()
            }else{
                clearInterval(intervalId)
                if (!targetNode.isProged()){
                    targetNode.targetProg(targetNode,this.getOppositeNode(targetNode))
                }
                this._canvas.execute() //this will execute the next prog to be done in the execute callback
            }
            
        }
        intervalId = setInterval(intervalCb,14)
    }
    similarX(source,points){
        for(let i =0;i<points.length;i++){
            if (source.x === points[i].x && source != points[i]){

                return points[i]
            }
        }
    }
    similarY(source,points){
       for(let i =0;i<points.length;i++){
        if (source.y === points[i].y && source != points[i]){
            return points[i]
            }
        
        }
    }
    //=======================================================================================================================================
    coordToCoord(coord1,coord2,dir){
        //this function will move coord 1 closer to coord 2 by 1 pixel at a time
        //dir will a string denoting the direction that will be modified it can only be one of the two values : x or y.
        if (coord1.x < coord2.x && dir === 'x'){
            coord1.x += 1
        }else if (coord1.x > coord2.x && dir === 'x'){
            coord1.x -= 1
        }
        if (coord1.y < coord2.y && dir === 'y'){
            coord1.y += 1
        }else if (coord1.y > coord2.y && dir === 'y'){
            coord1.y -= 1
        }
    }
    coordsEq(coord1,coord2){
        //this will check if the coordinates are equal
        return Math.floor(coord1.x) === Math.floor(coord2.x) && Math.floor(coord1.y) === Math.floor(coord2.y)
    }
    progEdgeFromNode(node){
        let point = node === this._node1 ? this._node1 :this._node2
        this.progFrom(point)
        
    }
    _displayPoint(point){
        //this will neatly display the point x and y in as a comma seperated integer
        return `${point.x},${point.y}`
    }
    _updatePoints(){
        //this will update all 4 points in the object and NOT in the dom
        this._rectP1.x = parseInt(this.getX1(),10)
        this._rectP1.y = parseInt(this.getY1(),10)
        this._rectP3.x = parseInt(this.getX2(),10)
        this._rectP3.y = parseInt(this.getY2(),10)
        let x1 = this._rectP1.x
        let y1 = this._rectP1.y
        let x2 = this._rectP3.x
        let y2 = this._rectP3.y
        let xDelta = x1 - x2
        let yDelta = y1 - y2
        this._updateP2(x1,y2,xDelta,yDelta)
        this._updateP4(x2,y1,xDelta,yDelta)
    }
    _lineUp(){
        //this will eliminate the small differences between the points. Its gonna make it so that there are only 2 unique x coords and 2 unique y coords
        let xCoords = [this._rectP2,this._rectP3,this._rectP4]
        let yCoords = [this._rectP2,this._rectP3,this._rectP4]
        let curMinX = Number.POSITIVE_INFINITY
        let curIndexX = 0
        let curMinY = Number.POSITIVE_INFINITY
        let curIndexY = 0
        for (let i = 0; i<xCoords.length;i++){
            if (Math.abs(this._rectP1.x - xCoords[i].x) < curMinX){
                curMinX = Math.abs(this._rectP1.x - xCoords[i].x)
                curIndexX = i
            }
        }
        for (let i = 0; i<yCoords.length;i++){
            if (Math.abs(this._rectP1.y - yCoords[i].y) < curMinY){
                curMinY = Math.abs(this._rectP1.y - yCoords[i].y)
                curIndexY = i
            }
        }
        switch (curIndexX){
            case 0:
                //this means P2 is most similar
                this._rectP2.x = this._rectP1.x
                this._rectP3.x = this._rectP4.x
                break
            case 1:
                //this means P3 is most similar
                
                this._rectP3.x = this._rectP1.x
                this._rectP2.x = this._rectP4.x
                break
            case 2:
                //this means P4 is most similar
                this._rectP4.x = this._rectP1.x
                this._rectP2.x = this._rectP3.x
                break
        }
        switch (curIndexY){
            case 0:
                //this means P2 is most similar
                this._rectP2.y = this._rectP1.y
                this._rectP3.y = this._rectP4.y
                break
            case 1:
                //this means P3 is most similar
                this._rectP3.y = this._rectP1.y
                this._rectP2.y = this._rectP4.y
                break
            case 2:
                //this means P4 is most similar
                this._rectP4.y = this._rectP1.y
                this._rectP2.y = this._rectP3.y
                break
        }
    }
    _updateRectPointsDom(){
        //this will update the dom

        this._rect.setAttribute("points",`${this._displayPoint(this._rectP1)} ${this._displayPoint(this._rectP2)} ${this._displayPoint(this._rectP3)} ${this._displayPoint(this._rectP4)}`)            
    }
    _initRect(){
        this._updatePoints()
        this._updateRectPointsDom()
        this._clipPath.setAttribute("id",`edge${this._id}`)
        EdgeProg._appendTo(clipPath,this._rect)
    }
}
class EdgeGraph extends EdgeProg{ 
    //on creation the nodes to be appended onto the dom
    //move the dom manipulation to canvas.js
    constructor(canvas,pointer,id){
        super(canvas,pointer,id)
        this._eventListeners()//this might cause some bugs later on since an edge isnt clickable righ away
        this._canvas.addEdge(this)//this will pass this instance onto
        
    }
    setSecondNode(newNode){
        this._node2 = newNode
        this.updateNode2Endpoint(newNode.getCx(),newNode.getCy())
        this._edge.classList.replace("edge-unclickable","edge-clickable")
        this._setEndOrientation()
        this._lineUp()
    }
    setFirstNode(newNode){
        this._node1 = newNode
        this.updateNode1Endpoint(newNode.getCx(),newNode.getCy())
    }
    updateNode1Endpoint(newX,newY){
        this._edge.setAttribute("x1",newX)
        this._edge.setAttribute("y1",newY)
        this._progEdge.setAttribute("x1",newX)
        this._progEdge.setAttribute("y1",newY)   
    }
    updateNode2Endpoint(newX,newY){
        this._edge.setAttribute("x2",newX)
        this._edge.setAttribute("y2",newY)
        this._progEdge.setAttribute("x2",newX)
        this._progEdge.setAttribute("y2",newY)
        this._updatePoints()
        this._updateRectPointsDom()
    }
    updatePos(node,newX,newY){
        //node is the node that is being moved
        if (node === this._node1){
            this._updatePoints()
            this._updateRectPointsDom()
            this.updateNode1Endpoint(newX,newY)
        }else if (node === this._node2){
            this._updatePoints()
            this._updateRectPointsDom()
            this.updateNode2Endpoint(newX,newY)
            
        }
    }
    _eventListeners(){
        let pointer = this._pointer
        let instance = this
        this._edge.addEventListener("click",function(){
            switch (pointer.getState()){
                case (pointer.eraseState()):
                    instance.removeEdge()
            }
        })
    }
}