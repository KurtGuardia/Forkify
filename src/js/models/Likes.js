export default class Likes {
    constructor(){
        this.likes = []                                             //Where we will store all the Likes
    }

    addLike(id, title, author, img){                                //Like object creator
        const like = {id, title, author, img}
        this.likes.push(like);
        this.persistData();
        return like;
    }

    deleteLike(id){
        const index = this.likes.findIndex(el => el.id === id);     //finds the index of the given id
        this.likes.splice(index, 1);
        this.persistData();
    }

    isLiked(id){
        return this.likes.findIndex(el => el.id === id) !== -1;            //Looks for an index matching the one we pass as argument
    }

    getNumLikes(){
        return this.likes.length;                                    //Tells the numer of likes, useful to toggle the heart button on and off
    }

    persistData(){
        localStorage.setItem('likes', JSON.stringify(this.likes));  //Saving the likes in the localStorage (always as stings)
    }

    readStorage(){
        const storage = JSON.parse(localStorage.getItem('likes'));  //Retriving the likes and turning them back to an array asi before
        if(storage)  this.likes = storage;                          //Restoring the likes in its object
    }
}