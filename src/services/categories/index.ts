import { StrapiRes } from "strapiRes";
import AxiosService from "../axios";
import qs from 'qs'
import { CategoriType } from "./category.types";

class CategoryService extends AxiosService{
    constructor(){
        super('/categories')
    }

    async getAllCategories(){
        return await this.get<StrapiRes<CategoriType[]>>('')
    }

    async getTenCategories(){
        return await this.get<StrapiRes<CategoriType[]>>('?pagination[limit]=10')
    }
}

const categoryService = new CategoryService()
export default categoryService