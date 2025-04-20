import express from 'express'
import ImageController from '../controller/ImageController.js'
const router = express.Router()

router.get('/', (req, res) => {
	res.send('Hello There!')
})

router.post('/post-image', (req, res) => ImageController.PostImage(req, res))
router.get('/get-images', (req, res) => ImageController.GetImage(req, res))
router.post('/views/:imageId', (req, res) => ImageController.updateImageViews(req, res))
router.post('/download/:imageId', (req, res) => ImageController.updateImagedowload(req, res))
router.post('/share/:imageId', (req, res) => ImageController.updateImageshare(req, res))
router.post('/search/:searchTerms', (req, res) => ImageController.searchImage(req, res))

export default router
