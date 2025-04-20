import express from 'express'
import { PostImage, GetImage, updateImageViews, updateImagedowload, updateImageshare, searchImage } from '../controller/ImageController.js'
const router = express.Router()

router.get('/', (req, res) => res.send('Hello There'))
router.post('/post-image', PostImage)
router.get('/get-images', GetImage)
router.post('/views/:imageId', updateImageViews)
router.post('/download/:imageId', updateImagedowload)
router.post('/share/:imageId', updateImageshare)
router.post('/search/:searchTerms', searchImage)

export default router
