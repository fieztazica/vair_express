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
}

const categoryService = new CategoryService()
export default categoryService
