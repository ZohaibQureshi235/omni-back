import mongoose from 'mongoose'
import { ImagesModal, SectionsModal } from '../modals/ImagesModal.js'
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
		const { title, desc, keywords, image_type, short_desc } = req.body
		const file = req.file

		if (!file) {
			return res.status(400).json({ success: false, message: 'No image file provided' })
		}

		// Compress image with sharp
		const compressedImageBuffer = await sharp(file.buffer).resize({ width: 1080, withoutEnlargement: true }).jpeg({ quality: 70, progressive: true }).toBuffer()

		// Upload to Cloudinary
		const uploadStream = cloudinary.uploader.upload_stream(
			{
				resource_type: 'image',
				public_id: title,
				tags: keywords,
				short_desc,
				image_type
			},
			async (error, result) => {
				if (error) {
					return res.status(500).json({ success: false, message: error.message })
				}

				const imageData = {
					title,
					desc,
					keywords,
					short_desc,
					image_type,
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
		const { page = 1 } = req.query
		const offset = (page - 1) * 16

		const TotalImage = await ImagesModal.countDocuments()

		const Images = await ImagesModal.find({}, 'image section views _id').skip(offset).limit(16)

		const data = Pagination(Images, TotalImage, page, 'get-images')
		return res.status(200).json({ success: true, message: 'Successfully fetched', data })
	} catch (error) {
		console.error('Error in GetImage function:', error)
		return res.status(500).json({ success: false, message: error.message })
	}
}

const updateImageViews = async (req, res) => {
	try {
		const { slug } = req.params
		const updatedImage = await ImagesModal.findByIdAndUpdate(slug, { $inc: { views: 1 } }, { new: true })
		return updatedImage
	} catch (error) {
		return res.status(500).json({ success: false, message: error.message })
	}
}

const updatedImageLike = async (req, res) => {
	try {
		const { imageId } = req.params
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
		const { imageId } = req.params
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
		const { imageId } = req.params
		const updatedImage = await ImagesModal.findByIdAndUpdate(imageId, { $inc: { share: 1 } }, { new: true })

		if (!updatedImage) {
			return res.status(404).json({ success: false, message: 'image not found' })
		}

		return res.status(200).json({ success: true, message: 'shared' })
	} catch (error) {
		return res.status(500).json({ success: false, message: error.message })
	}
}

const searchImage = async (req, res) => {
	try {
		const { slug } = req.params
		let image = null

		// Check if slug is a valid ObjectId
		if (mongoose.Types.ObjectId.isValid(slug)) {
			image = await ImagesModal.findOne({ _id: slug })
		}

		if (image) {
			await updateImageViews(req, res)
			const keywordArray = image.keywords.split(',').filter(Boolean)

			const keywordRegexConditions = keywordArray.map((word) => ({
				keywords: { $regex: word, $options: 'i' } // added case insensitive search
			}))

			const relatedImages = await ImagesModal.find({
				_id: { $ne: image._id },
				$or: keywordRegexConditions
			})

			return res.status(200).json({
				success: true,
				page_type: 'image',
				message: 'fetched successfully',
				image,
				related_images: relatedImages
			})
		} else {
			const { page = 1 } = req.query
			const offset = (page - 1) * 16

			const Images = await ImagesModal.find({
				$or: [{ name: { $regex: slug, $options: 'i' } }, { section: { $regex: slug, $options: 'i' } }, { slug: { $regex: slug, $options: 'i' } }, { description: { $regex: slug, $options: 'i' } }, { keywords: { $regex: slug, $options: 'i' } }]
			})
				.skip(offset)
				.limit(16)

			const data = Pagination(Images, Images.length, page, slug)

			return res.status(200).json({
				success: true,
				page_type: 'search',
				message: 'fetched successfully',
				data
			})
		}
	} catch (error) {
		return res.status(500).json({ success: false, message: error.message })
	}
}

const sectionList = async (req, res) => {
	try {
		const sections = await SectionsModal.find()
		return res.status(200).json({ success: true, message: 'fetched successfully', sections })
	} catch (error) {
		return res.status(500).json({ success: false, message: error.message })
	}
}

const getSectionImage = async (req, res) => {
	try {
		const { section } = req.params
		const { page = 1 } = req.query
		const offset = (page - 1) * 16
		const TotalImage = await ImagesModal.countDocuments({ section })
		const Images = await ImagesModal.find({ section }, 'image section views _id').skip(offset).limit(16)
		const data = Pagination(Images, TotalImage, page)
		return res.status(200).json({ success: true, message: 'Successfully fetched', data })
	} catch (error) {
		return res.status(500).json({ success: false, message: error.message })
	}
}

export { PostImage, GetImage, updatedImageLike, updateImageViews, updateImagedowload, updateImageshare, searchImage, sectionList, getSectionImage }
