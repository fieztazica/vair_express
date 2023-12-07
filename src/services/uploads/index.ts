import AxiosService from '../axios'
import { Blob } from 'buffer'
// import { CategoryType } from "./category.types";

class UploadService extends AxiosService {
    constructor() {
        super('/upload')
    }

    async uploadImage(multerFile: Express.Multer.File) {
        const form = new FormData()
        const file = new Blob([multerFile.buffer], {
            type: multerFile.mimetype,
        })
        form.append('files', file, multerFile.originalname)

        return await this.post<ImageType[]>('/', form)
    }
}

const uploadService = new UploadService()
export default uploadService
