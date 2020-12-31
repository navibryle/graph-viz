class NodeRect{
    constructor(node,offset){
        //x and y are the center of the node
        this.x = node.getCx()
        this.y = node.getCy()
        this._offset = offset //offset will be a json object containing the vertical and horizontal offsets for the rectangle
        this._node = node
    }
    intersects(rect){
        //rect is a NodeRect object this will check if both rectangles intersect
        let xInt = false
        let yInt = false //both xInt and yInt will be flags that will be raised if the x and y coordinate can intersect
        if (this.x+this._offset.horizontal > rect.getX()-this._offset.horizontal || this.x-this._offset.horizontal < rect.getX()+this._offset.horizontal){
            xInt = true
        }
        if (this.y+this._offset.vertical > rect.getY()-this._offset.vertical || this.y-this._offset.vertical < rect.getY()+this._offset.vertical){
            yInt = true
        } 
        return xInt && yInt
    }
    getNode(){
        return this._node
    }
    getX(){
        return this.x
    }
    getY(){
        return this.y
    }
}