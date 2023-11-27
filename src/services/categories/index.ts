import { StrapiRes } from "strapiRes";
import AxiosService from "../axios";

class CategoryService extends AxiosService{
    constructor(){
        super('/categories')
    }

    async getAllCategories(){
        return await this.get<StrapiRes<string[]>>
    }
}

const categoryService = new CategoryService()
export default categoryService