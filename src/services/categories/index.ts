import { StrapiRes } from "strapiRes";
import AxiosService from "../axios";
import qs from 'qs'
import { CategoryType } from "./category.types";

class CategoryService extends AxiosService{
    constructor(){
        super('/categories')
    }

    async getAllCategories(){
        return await this.get<StrapiRes<CategoryType[]>>('')
    }

    async getTenCategories(){
        return await this.get<StrapiRes<CategoryType[]>>('?pagination[limit]=10')
    }
}

const categoryService = new CategoryService()
export default categoryService
