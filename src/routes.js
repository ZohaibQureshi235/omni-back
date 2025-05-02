import express from 'express'
import { PostImage, GetImage, updateImageViews, updateImage, updatedImageLike, updateImagedowload, searchImage, getSectionImage, fetchCat, getAllImages, deleteImage, getImageByslug, getCatImageBySlug, sendMessage } from '../controller/ImageController.js'
import multer from 'multer'

const router = express.Router()
const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

router.get('/', (req, res) => res.send('Hello There'))
router.post('/post-image', upload.single('image'), PostImage)
router.post('/update-image', upload.single('image'), updateImage)
router.get('/get-images', GetImage)
router.post('/views/:imageId', updateImageViews)
router.post('/like/:imageId', updatedImageLike)
router.post('/download/:imageId', updateImagedowload)
router.get('/cat', fetchCat)
router.get('/find-section/:section', getSectionImage)
router.get('/image', getAllImages)
router.delete('/delete/:id', deleteImage)
router.get('/:cat/:slug', getImageByslug)
router.get(/^\/(.+)-wallpapers$/, getCatImageBySlug)
router.get('/:slug', searchImage)
router.post('/send-message', sendMessage)

export default router
