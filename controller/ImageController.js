import ImagesModal from '../modals/ImagesModal.js'
import Pagination from '../middlewares/Pagination.js'

const PostImage = async (req, res) => {
	try {
		await ImagesModal.create(req.body)
		return res.status(200).json({ success: true, message: 'Successfully created image' })
	} catch (error) {
		return res.status(500).json({ success: false, message: error.message })
	}
}

const GetImage = async (req, res) => {
	try {
		const { page } = req.query
		const offset = (page - 1) * 10
		const TotalImage = await ImagesModal.countDocuments()
		const Images = await ImagesModal.find({}).skip(offset).limit(10)
		const data = Pagination(Images, TotalImage, page, 10)
		return res.status(200).json({ success: true, message: 'Successfully fetched', data })
	} catch (error) {
		return res.status(500).json({ success: false, message: error.message })
	}
}

const updateImageViews = async (req, res) => {
	try {
		const { imageId } = req.query
		const updatedImage = await Image.findByIdAndUpdate(imageId, { $inc: { views: 1 } }, { new: true })

		if (!updatedImage) {
			return res.status(404).json({ success: false, message: 'image not found' })
		}

		return res.status(200).json({ success: true, message: 'viewed' })
	} catch (error) {
		return res.status(500).json({ success: false, message: error.message })
	}
}

const updateImagedowload = async (req, res) => {
	try {
		const { imageId } = req.query
		const updatedImage = await Image.findByIdAndUpdate(imageId, { $inc: { downloads: 1 } }, { new: true })

		if (!updatedImage) {
			return res.status(404).json({ success: false, message: 'image not found' })
		}

		return res.status(200).json({ success: true, message: 'downloaded' })
	} catch (error) {
		return res.status(500).json({ success: false, message: error.message })
	}
}

const updateImageshare = async (req, res) => {
	try {
		const { imageId } = req.query
		const updatedImage = await Image.findByIdAndUpdate(imageId, { $inc: { share: 1 } }, { new: true })

		if (!updatedImage) {
			return res.status(404).json({ success: false, message: 'image not found' })
		}

		return res.status(200).json({ success: true, message: 'shared' })
	} catch (error) {
		return res.status(500).json({ success: false, message: error.message })
	}
}

const findImage = async (req, res) => {
	try {
		const { imageId } = req.body
		const image = await Image.findById(imageId)
		if (!image) {
			return res.status(404).json({ success: false, message: 'Not found' })
		}
		const relatedImages = await ImagesModal.find({
			_id: { $ne: imageId },
			keywords: { $in: image.keywords }
		})
		return res.status(500).json({ success: true, message: 'fetched successfully', image, related_images: relatedImages })
	} catch (error) {
		return res.status(500).json({ success: false, message: error.message })
	}
}

const searchImage = async (req, res) => {
	try {
		const { searchTerms } = req.query
		const offset = (page - 1) * 10

		const Images = await Image.find({
			$or: [{ name: { $regex: searchTerms } }, { description: { $regex: searchTerms } }, { keywords: { $regex: searchTerms } }]
		})
			.skip(offset)
			.limit(10)
		const data = Pagination(Images, Images.length, page, 10)
		return res.status(500).json({ success: true, message: 'fetched successfully', data })
	} catch (error) {
		return res.status(500).json({ success: false, message: error.message })
	}
}

export { PostImage, GetImage, findImage, updateImageViews, updateImagedowload, updateImageshare, searchImage }
