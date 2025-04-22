import ImagesModal from '../modals/ImagesModal.js'
import { v2 as cloudinary } from 'cloudinary'
import sharp from 'sharp'
import Pagination from '../Help/Pagination.js'

cloudinary.config({
	cloud_name: 'dobuzvxes',
	api_key: '339545666221576',
	api_secret: 'ALV9xB-T87Bryo3luxgoT86d_Ow'
})

const PostImage = async (req, res) => {
	try {
		const { title, desc, keywords } = req.body
		const file = req.file

		if (!file) {
			return res.status(400).json({ success: false, message: 'No image file provided' })
		}

		// Compress image with sharp
		const compressedImageBuffer = await sharp(file.buffer).resize({ width: 1080, withoutEnlargement: true }).jpeg({ quality: 75, progressive: true }).toBuffer()

		// Upload to Cloudinary
		const uploadStream = cloudinary.uploader.upload_stream(
			{
				resource_type: 'image',
				public_id: title,
				tags: keywords
			},
			async (error, result) => {
				if (error) {
					return res.status(500).json({ success: false, message: error.message })
				}

				const imageData = {
					title,
					desc,
					keywords,
					image: result.secure_url,
					cloudinaryPublicId: result.public_id,
					slug: title.replace(/\s+/g, '-').toLowerCase()
				}

				await ImagesModal.create(imageData)

				return res.status(200).json({ success: true, message: 'Successfully uploaded image' })
			}
		)

		uploadStream.end(compressedImageBuffer)
	} catch (error) {
		return res.status(500).json({ success: false, message: error.message })
	}
}

const GetImage = async (req, res) => {
	try {
		const { page } = req.query
		const offset = (page - 1) * 10
		const TotalImage = await ImagesModal.countDocuments()
		const Images = await ImagesModal.find({}, 'image views _id').skip(offset).limit(8)

		const data = Pagination(Images, TotalImage, page)
		return res.status(200).json({ success: true, message: 'Successfully fetched', data })
	} catch (error) {
		return res.status(500).json({ success: false, message: error.message })
	}
}

const updateImageViews = async (req, res) => {
	try {
		const { imageId } = req.query
		const updatedImage = await ImagesModal.findByIdAndUpdate(imageId, { $inc: { views: 1 } }, { new: true })

		if (!updatedImage) {
			return res.status(404).json({ success: false, message: 'image not found' })
		}

		return res.status(200).json({ success: true, message: 'viewed' })
	} catch (error) {
		return res.status(500).json({ success: false, message: error.message })
	}
}

const updatedImageLike = async (req, res) => {
	try {
		const { imageId } = req.query
		const updatedImage = await ImagesModal.findByIdAndUpdate(imageId, { $inc: { like: 1 } }, { new: true })

		if (!updatedImage) {
			return res.status(404).json({ success: false, message: 'image not found' })
		}

		return res.status(200).json({ success: true, message: 'liked' })
	} catch (error) {
		return res.status(500).json({ success: false, message: error.message })
	}
}

const updateImagedowload = async (req, res) => {
	try {
		const { imageId } = req.query
		const updatedImage = await ImagesModal.findByIdAndUpdate(imageId, { $inc: { downloads: 1 } }, { new: true })

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
		const updatedImage = await ImagesModal.findByIdAndUpdate(imageId, { $inc: { share: 1 } }, { new: true })

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
		const image = await ImagesModal.findOne({ _id: imageId })
		if (!image) {
			return res.status(404).json({ success: false, message: 'Not found' })
		}
		const relatedImages = await ImagesModal.find({
			_id: { $ne: imageId },
			keywords: { $in: image.keywords }
		})
		return res.status(200).json({ success: true, message: 'fetched successfully', image, related_images: relatedImages })
	} catch (error) {
		return res.status(500).json({ success: false, message: error.message })
	}
}

const searchImage = async (req, res) => {
	try {
		const { searchTerms } = req.query
		const offset = (page - 1) * 10

		const Images = await ImagesModal.find({
			$or: [{ name: { $regex: searchTerms } }, { description: { $regex: searchTerms } }, { keywords: { $regex: searchTerms } }]
		})
			.skip(offset)
			.limit(8)
		const data = Pagination(Images, Images.length, page, 8)
		return res.status(500).json({ success: true, message: 'fetched successfully', data })
	} catch (error) {
		return res.status(500).json({ success: false, message: error.message })
	}
}

export { PostImage, GetImage, updatedImageLike, findImage, updateImageViews, updateImagedowload, updateImageshare, searchImage }
