const express = require('express')
const { PostImage, GetImage, updateImageViews, updateImagedowload, updateImageshare, searchImage } = require('../controller/ImageController')
const router = express.Router()

router.post('/api/post-image', PostImage)
router.get('/api/get-images', GetImage)
router.post('/api/views/:imageId', updateImageViews)
router.post('/api/download/:imageId', updateImagedowload)
router.post('/api/share/:imageId', updateImageshare)
router.post('/api/search/:searchTerms', searchImage)

module.exports = router
