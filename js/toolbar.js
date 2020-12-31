class Toolbar{
    constructor(btnIds){
        //btnIds must be a list of id's of existing buttons
        this._btnIds = btnIds
        this._buttons = []//actual domnodes will be stored here
        this.init()
        this._active = null

    }
    init(){
        let len = this._btnIds.length
        for (let i = 0;i<len;i++){
            this._buttons.push(document.getElementById(this._btnIds[i]))
        }
    }
    setActive(btnId){
        let newBtn = document.getElementById(btnId)
        if (this._active === null){
            this._active = newBtn
            this.activateBtn(this._active)
            
        }else if (this._active.id === btnId){
            this.deactivateBtn(this._active)
            this._active = null
        }else{
            
            //there is an active btn but the btnId btn is different
            this.deactivateBtn(this._active)
            this.activateBtn(newBtn)
            this._active = newBtn
        }
    }
    activateBtn(btn){
        btn.classList.replace("idle","active")
    }
    deactivateBtn(btn){
        btn.classList.replace("active","idle")
    }
}