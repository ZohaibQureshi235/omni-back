import express from 'express'
import { PostImage, GetImage, updateImageViews, updateImagedowload, updateImageshare, searchImage, findImage } from '../controller/ImageController.js'
import multer from 'multer'

const router = express.Router()
const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

router.get('/', (req, res) => res.send('Hello There'))
router.post('/post-image', upload.single('image'), PostImage)
router.get('/get-images', GetImage)
router.post('/find-image', findImage)
router.post('/views/:imageId', updateImageViews)
router.post('/like/:imageId', updateImageViews)
router.post('/download/:imageId', updateImagedowload)
router.post('/share/:imageId', updateImageshare)
router.post('/search/:searchTerms', searchImage)

export default router
