import {Step} from './Step'
import {Ingridient} from './Ingridient'

 
export class Post {
    time : Date;
    recipe_title: String;
    category: String;
    co_author: Array<any>;   //array containing all co-authors
    ingredients: Array<Ingridient>; //array of all ingrediants
    description: String;
    instructions: Array<Step>
    amount_of_likes: number;
    amount_of_dislike: number;
    comments: Array<any>;  //array containing all comments




}