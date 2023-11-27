import { StrapiRes } from "strapiRes";
import AxiosService from "../axios";
import { CategoriType } from "./category.types";

class CategoryService extends AxiosService{
    constructor(){
        super('/categories')
    }

    async getAllCategories(){
        return await this.get<StrapiRes<CategoriType[]>>('')
    }
}

const categoryService = new CategoryService()
export default categoryService