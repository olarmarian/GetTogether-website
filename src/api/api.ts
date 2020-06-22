export class Api{

    private static urlReservationMicroservice = "http://192.168.0.104:8080/reservations";
    private static urlLocal:string = "http://localhost:5000/gettogether-55ba9/us-central1/api";
    private static urlFirebase:string = "https://us-central1-gettogether-55ba9.cloudfunctions.net/api";
    // private static urlFirebase:string= "";
    private static postMethod:string = 'POST'
    private static deleteMethod:string = 'DELETE'
    private static defaultHeaders = {
        'Content-Type': 'application/json'
    }

    private static getUrl():string{
        return this.urlFirebase === "" ? this.urlLocal : this.urlFirebase;
    }

    //TODO: handle request for bad response to redirect at login page
    static handleRequest(response){
        if(!response.ok){
            if([400, 401, 403].indexOf(response.status) !== -1){
                sessionStorage.removeItem("token");
                sessionStorage.removeItem("userId");
                if(['/login'].indexOf(window.location.pathname) === -1){
                    window.location.assign('/login');
                }
            }
            return Promise.reject(response);
        }
        return response.json();
    }

    static addNewsletterEmail(email: string){
        const obj = {
            email: email
        }
        return fetch(this.getUrl() + "/newsletter",{
            method:this.postMethod,
            headers:this.defaultHeaders,
            body:JSON.stringify(obj)
        }).then(responseJson => responseJson.json())
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
        }).then(this.handleRequest)
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
        });
    }

    static updateUserProfile(user:any){
        return fetch(this.getUsersUrl() + `/${user.id}/edit`, {
            method: "PUT",
            headers: this.defaultHeaders,
            body: JSON.stringify(user)
        }).then(this.handleRequest)
    }
    static getUsersUrl():string{
        return this.getUrl()+"/users";
    }

    static getReservationsUrl(): string {
        return this.urlReservationMicroservice;
    }

    static getAccount(email:string){
        return fetch(this.getUsersUrl()+`/${email}`).then(this.handleRequest);
    }
    private static getLocalsUrl():string{
        return this.getUrl()+"/locals";
    }

    private static getLocalsByTagUrl():string{
        return this.getLocalsUrl()+"/tag/";
    }

    static getAllLocals(){
        return fetch(this.getLocalsUrl()).then(this.handleRequest);
    }

    static getUserLocal(userEmail: string){
        let token:string = sessionStorage.getItem('token');
        return fetch(this.getLocalsUrl() + `/user-local/${userEmail}`,{
            method:'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization':`Bearer ${token}`
            },
        }).then(this.handleRequest);
    }

    static getAllLocalTags(){
        return fetch(this.getLocalsUrl() + "/tags-categories").then(this.handleRequest);
    }

    static getAllLocalSpecifics(){
        return fetch(this.getLocalsUrl() + "/specifics-categories").then(this.handleRequest);
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

    static getFilteredLocals(tag:string = "", specific:string = ""){
        if(tag !== "" && specific !== ""){
            this.getAllLocals();
        }
        return fetch(this.getLocalsUrl() + `/tag=${tag}&specific=${specific}`)
        .then(this.handleRequest);
    }

    static getTheMostPopular(){
        return fetch(this.getLocalsUrl()+"/the-most-popular",{
            method:"POST"
        });
    }

    static getTheNewest(){
        return fetch(this.getLocalsUrl()+"/the-newest",{
            method:"POST"
        });
    }

    static getTheBiggestRate(){
        return fetch(this.getLocalsUrl()+"/the-biggest-rate",{
            method:"POST"
        });
    }

    static getReviewsByLocalId(id:string){
        return fetch(this.getLocalsUrl()+`/${id}/reviews`)
    }

    static postReviewForLocal(comment:string,localId:string,stars:number){
        let token:string = sessionStorage.getItem('token');
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
        }).then(response => this.handleRequest(response))
    }

    static getReservationHistory(userId:string){
        return fetch(this.getReservationsUrl() + `/user/${userId}/not-active`).then(response => {return response.json()})
    }

    static getActiveReservations(userId:string){
        return fetch(this.getReservationsUrl() + `/user/${userId}/active`).then(response => {return response.json()})
    }

    static saveLocal(local: any){
        let token:string = sessionStorage.getItem('token');
        return fetch(this.getLocalsUrl() + '/save',{
            method:'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization':`Bearer ${token}`
            },
            body:JSON.stringify(local)
        }).then(this.handleRequest)
    }

    
    static updateLocal(local: any){
        let token:string = sessionStorage.getItem('token');
        return fetch(this.getLocalsUrl() + `/${local.localId}/edit`,{
            method:'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization':`Bearer ${token}`
            },
            body:JSON.stringify(local)
        }).then(this.handleRequest)
    }

    static updateLocalImage(localId:string, image: any){
        let token:string = sessionStorage.getItem('token');

        const formData = new FormData();
        formData.append("image", image);
        return fetch(this.getLocalsUrl() + `/${localId}/upload`,{
            method:'POST',
            headers: {
                'Authorization':`Bearer ${token}`
            },
            body:formData
        }).then(this.handleRequest)
    }

    static removeLocalImage(imageId: any){
        let token:string = sessionStorage.getItem('token');

        return fetch(this.getLocalsUrl() + `/image`,{
            method: this.deleteMethod,
            headers: {
                "Content-Type": "application/json",
                'Authorization':`Bearer ${token}`
            },
            body:JSON.stringify({imageId: imageId})
        }).then(this.handleRequest)
    }

    static saveReservation(reservation: any){
        return fetch(this.getReservationsUrl(),{
            method:'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body:JSON.stringify(reservation)
        }).then(response => {return response.json()})
    }

    static getLocalsReservations(localId: string){
        return fetch(this.getReservationsUrl() + `/local/${localId}`).then(response => {return response.json()})
    }

    static updateStatusReservation(reservation: any){
        return fetch(this.getReservationsUrl() + `/${reservation.reservationId}/status`, {
            method: "PUT",
            headers:this.defaultHeaders,
            body:reservation.status
        })
    }

    static updateReservation(reservation: any){
        return fetch(this.getReservationsUrl() + `/${reservation.reservationId}`, {
            method: "PUT",
            headers:this.defaultHeaders,
            body:JSON.stringify(reservation)
        })
    }
}