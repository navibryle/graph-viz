class IdGen{
    constructor () {
        this._seed = 0;
    }
    getIdIncrement() {
        var temp = this._seed;
        this._seed += 1;
        return temp;
    }
    getId (){
        return this._seed
    }
    incrementId () {
        this._seed += 1;
    } 
}