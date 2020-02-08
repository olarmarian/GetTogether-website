export class Api{
    private static urlLocal:string = "http://localhost:5000/gettogether-55ba9/us-central1/api";
    private static urlFirebase:string = "https://us-central1-gettogether-55ba9.cloudfunctions.net/api";
    private static postMethod:string = 'POST'
    private static deleteMethod:string = 'DELETE'
    private static defaultHeaders = {
        'Content-Type': 'application/json'
    }

    private static getUrl():string{
        return this.urlFirebase || this.urlLocal;
    }

    static login(email:string,password:string){
        const user = {
            email,
            password
        }
        return fetch(this.getUrl()+"/login",{
            method:this.postMethod,
            headers:this.defaultHeaders,
            body:JSON.stringify(user)
        })
    }

    static signUp(name:string,phone:string,email:string,password:string,confirmedPassword:string){
        const user = {
            name,
            phone,
            email,
            password,
            confirmedPassword
        }
        return fetch(this.getUsersUrl()+'/signup',{
            method:this.postMethod,
            headers:this.defaultHeaders,
            body:JSON.stringify(user)
        })
    }

    static getUsersUrl():string{
        return this.getUrl()+"/users";
    }
    private static getLocalsUrl():string{
        return this.getUrl()+"/locals";
    }

    private static getLocalsByTagUrl():string{
        return this.getLocalsUrl()+"/tag/";
    }

    static getAllLocals(){
        return fetch(this.getLocalsUrl());
    }

    static getMetadataForLocals(){
        return fetch(this.getLocalsUrl()+"/metadata")
    }

    static getLocalByName(name:string){
        return fetch(this.getLocalsUrl()+`/name/${name}`);
    }
    static getLocalsByTag(tag:string){
        return fetch(this.getLocalsByTagUrl()+tag);
    }

    static getTheMostPopular(){
        return fetch(this.getLocalsUrl()+"/the-most-popular");
    }

    static getTheNewest(){
        return fetch(this.getLocalsUrl()+"/the-newest");
    }

    static getTheBiggestRate(){
        return fetch(this.getLocalsUrl()+"/the-biggest-rate");
    }

    static getReviewsByLocalId(id:string){
        return fetch(this.getLocalsUrl()+`/${id}/reviews`)
    }

    static postReviewForLocal(token:string,comment:string,localId:string,stars:number){
        const review = {
            text:comment,
            stars
        }
        return fetch(this.getLocalsUrl()+`/${localId}/review`,{
            method:'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization':`Bearer ${token}`
              },
            body:JSON.stringify(review)
        })
    }
}