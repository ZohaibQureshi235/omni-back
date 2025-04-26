import express from 'express'
import { PostImage, GetImage, updateImageViews, updatedImageLike, updateImagedowload, updateImageshare, searchImage, sectionList, getSectionImage, fetchCat } from '../controller/ImageController.js'
import multer from 'multer'

const router = express.Router()
const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

router.get('/', (req, res) => res.send('Hello There'))
router.post('/post-image', upload.single('image'), PostImage)
router.get('/get-images', GetImage)
router.post('/views/:imageId', updateImageViews)
router.post('/like/:imageId', updatedImageLike)
router.post('/download/:imageId', updateImagedowload)
router.get('/:slug', searchImage)
router.get('/cat', fetchCat)
router.get('/find-section/:section', getSectionImage)

export default router
