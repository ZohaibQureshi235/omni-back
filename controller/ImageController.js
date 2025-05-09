import { ImagesModal, SectionsModal } from '../modals/ImagesModal.js'
import { v2 as cloudinary } from 'cloudinary'
import sharp from 'sharp'
import Pagination from '../Help/Pagination.js'
import mongoose from 'mongoose'
import nodemailer from 'nodemailer'

cloudinary.config({
	cloud_name: 'dobuzvxes',
	api_key: '339545666221576',
	api_secret: 'ALV9xB-T87Bryo3luxgoT86d_Ow'
})

const PostImage = async (req, res) => {
	try {
		const { title, keywords, short_desc, category } = req.body
		const file = req.file

		if (!file) {
			return res.status(400).json({ success: false, message: 'No image file provided' })
		}

		const checkCategory = await SectionsModal.find({ category })
		if (checkCategory?.length !== 1) {
			await SectionsModal.create({ category })
		}

		// Compress image with sharp
		const compressedImageBuffer = await sharp(file.buffer).resize({ width: 1080, withoutEnlargement: true }).jpeg({ quality: 70, progressive: true }).toBuffer()

		// Helper function to upload buffer
		const uploadToCloudinary = (buffer, publicId) =>
			new Promise((resolve, reject) => {
				cloudinary.uploader
					.upload_stream({ resource_type: 'image', public_id: publicId }, (error, result) => {
						if (error) return reject(error)
						resolve(result)
					})
					.end(buffer)
			})

		// Upload compressed image
		const compressedResult = await uploadToCloudinary(compressedImageBuffer, `${title.replace(/\s+/g, '-').toLowerCase()}-compressed`)

		// Upload original image
		const originalResult = await uploadToCloudinary(file.buffer, `${title.replace(/\s+/g, '-').toLowerCase()}-original`)

		const imageData = {
			title,
			keywords,
			short_desc,
			category,
			image: compressedResult.secure_url,
			original_image: originalResult.secure_url,
			cloudinaryPublicId: compressedResult.public_id,
			slug: title.replace(/\s+/g, '-').toLowerCase()
		}

		// Add the new image to the top of the array
		await ImagesModal.create(imageData)

		const updatedImages = await ImagesModal.find().sort({ _id: -1 }) // Sort by newest first

		return res.status(200).json({ success: true, message: 'Successfully uploaded both images', data: updatedImages })
	} catch (error) {
		return res.status(500).json({ success: false, message: error.message })
	}
}

const updateImage = async (req, res) => {
	try {
		const { title, keywords, short_desc, category, image_id } = req.body
		const file = req.file

		if (!image_id) {
			return res.status(400).json({ success: false, message: 'Image ID is required' })
		}

		const checkCategory = await SectionsModal.find({ category })
		if (checkCategory?.length !== 1) {
			await SectionsModal.create({ category })
		}
		if (file) {
			const compressedImageBuffer = await sharp(file.buffer).resize({ width: 1080, withoutEnlargement: true }).jpeg({ quality: 70, progressive: true }).toBuffer()

			// Helper function to upload buffer
			const uploadToCloudinary = (buffer, publicId) =>
				new Promise((resolve, reject) => {
					cloudinary.uploader
						.upload_stream({ resource_type: 'image', public_id: publicId }, (error, result) => {
							if (error) return reject(error)
							resolve(result)
						})
						.end(buffer)
				})

			// Upload compressed image
			const compressedResult = await uploadToCloudinary(compressedImageBuffer, `${title.replace(/\s+/g, '-').toLowerCase()}-compressed`)

			// Upload original image
			const originalResult = await uploadToCloudinary(file.buffer, `${title.replace(/\s+/g, '-').toLowerCase()}-original`)

			const imageData = {
				title,
				keywords,
				short_desc,
				category,
				image: compressedResult.secure_url,
				original_image: originalResult.secure_url,
				cloudinaryPublicId: compressedResult.public_id,
				slug: title.replace(/\s+/g, '-').toLowerCase()
			}

			// Add the new image to the top of the array

			await ImagesModal.updateOne({ _id: image_id }, imageData)

			return res.status(200).json({ success: true, message: 'Successfully updated image' })
		} else {
			await ImagesModal.updateOne({ _id: image_id }, { title, keywords, short_desc, category })
			return res.status(200).json({ success: true, message: 'Successfully updated image' })
		}
	} catch (error) {
		return res.status(500).json({ success: false, message: error.message })
	}
}

const GetImage = async (req, res) => {
	try {
		const { page = 1 } = req.query
		const offset = (page - 1) * 16

		const TotalImage = await ImagesModal.countDocuments()

		let Images = await ImagesModal.find({}, 'image category slug downloads original_image views _id').skip(offset).limit(16)

		// Shuffle only if it's the first page
		if (Number(page) === 1) {
			Images = Images.sort(() => Math.random() - 0.5)
		}

		const data = Pagination(Images, TotalImage, page, 'get-images')
		return res.status(200).json({ success: true, message: 'Successfully fetched', data })
	} catch (error) {
		return res.status(500).json({ success: false, message: error.message })
	}
}

const updateImageViews = async (req, res) => {
	try {
		const { cat, slug } = req.params
		const updatedImage = await ImagesModal.findOneAndUpdate({ slug }, { $inc: { views: 1 } }, { new: true })

		return updatedImage
	} catch (error) {
		return null
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
		const stopWords = new Set(['on', 'is', 'the', 'a', 'of', 'an', 'and', 'in', 'to', 'for', 'with', 'by', 'at', 'from', 'that', 'this', 'it'])
		let { slug } = req.params

		// Step 1: Preprocess slug
		slug = slug.replace(/-/g, ' ').toLowerCase()
		console.log('Processed slug:', slug)

		// Step 2: Extract search words, filter out stop words and 'wallpaper'
		const searchWords = slug
			.split(' ')
			.map((word) => word.trim())
			.filter((word) => word && word !== 'wallpaper' && !stopWords.has(word))

		console.log('Search words:', searchWords)

		// Step 3: Build regex conditions
		const regexConditions = searchWords.map((word) => ({
			keywords: { $regex: new RegExp(word, 'i') }
		}))

		console.log('Regex Conditions:', JSON.stringify(regexConditions))

		let Images = []

		// Step 4: Use aggregation if many words, else simple query
		if (searchWords.length > 2) {
			Images = await ImagesModal.aggregate([
				{ $match: { $or: regexConditions } },
				{
					$addFields: {
						matchCount: {
							$size: {
								$setIntersection: [searchWords, { $split: ['$keywords', ','] }]
							}
						}
					}
				},
				{ $sort: { matchCount: -1 } },
				{ $limit: 30 } // optional: limit to top 30 matches
			])
		} else {
			Images = await ImagesModal.find({ $or: regexConditions }).limit(30)
		}

		console.log('Images found:', Images.length)

		return res.status(200).json({
			success: true,
			page_type: 'search',
			message: 'Fetched successfully',
			data: Images
		})
	} catch (err) {
		console.error('Error fetching images:', err)
		return res.status(500).json({
			success: false,
			message: 'Server error',
			error: err.message
		})
	}
}

const getImageByslug = async (req, res) => {
	try {
		const { cat, slug } = req.params
		let image = null
		if (mongoose.Types.ObjectId.isValid(slug)) {
			image = await ImagesModal.findOne({ slug })
		}
		image = await ImagesModal.findOne({ slug })

		// Check if image exists BEFORE doing anything
		if (!image) {
			return res.status(404).json({ success: false, message: 'No page found' })
		}

		await updateImageViews(req, res) // Ensure this doesn't send a response itself

		const keywordArray = image.keywords.split(',').filter(Boolean)
		const keywordRegexConditions = keywordArray.map((word) => ({
			keywords: { $regex: word }
		}))

		const relatedImages = await ImagesModal.find({
			_id: { $ne: image._id },
			$or: keywordRegexConditions
		})
		if (image) {
			return res.status(200).json({
				success: true,
				message: 'Fetched successfully',
				page_type: 'image',
				image,
				related_images: relatedImages
			})
		} else {
			return res.status(404).json({ success: false, message: '404' })
		}
	} catch (error) {
		return res.status(500).json({ success: false, message: error.message })
	}
}

const getCatImageBySlug = async (req, res) => {
	try {
		let slug = req.params[0]
		slug = slug.charAt(0).toUpperCase() + slug.slice(1)
		slug = slug.replace(/-/g, ' ')
		const Images = await ImagesModal.find({ category: slug?.includes('accident') ? 'Crash & Accidents' : slug })

		// Shuffle the images
		for (let i = Images.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1))
			;[Images[i], Images[j]] = [Images[j], Images[i]]
		}

		return res.status(200).json({
			success: true,
			page_type: 'category',
			message: 'fetched successfully',
			data: Images
		})
	} catch (error) {
		return res.status(500).json({ success: false, message: error.message })
	}
}

const sectionList = async (req, res) => {
	try {
		const category = await SectionsModal.find()
		return res.status(200).json({ success: true, message: 'fetched successfully', category })
	} catch (error) {
		return res.status(500).json({ success: false, message: error.message })
	}
}

const getSectionImage = async (req, res) => {
	try {
		const { section } = req.params
		const Images = await ImagesModal.find({ section })
		return res.status(200).json({ success: true, message: 'Successfully fetched', data: Images })
	} catch (error) {
		return res.status(500).json({ success: false, message: error.message })
	}
}

const fetchCat = async (req, res) => {
	try {
		const Cat = await SectionsModal.find()
		return res.status(200).json({ success: true, message: 'Successfully fetched', data: Cat })
	} catch (error) {
		return res.status(500).json({ success: false, message: error.message })
	}
}

const getAllImages = async (req, res) => {
	try {
		const data = await ImagesModal.find({})
		return res.status(200).json({ success: true, message: 'Successfully fetched', data })
	} catch (error) {
		return res.status(500).json({ success: false, message: error.message })
	}
}

const deleteImage = async (req, res) => {
	try {
		const { id } = req.params
		await ImagesModal.deleteOne({ _id: id })
		return res.status(200).json({ success: true, message: 'Deleted Succcessfuly' })
	} catch (error) {
		return res.status(500).json({ success: false, message: error.message })
	}
}

const sendMessage = async (req, res) => {
	try {
		try {
			const { full_name, subject, email, message } = req.body

			const mail1 = {
				from: 'hello@iamzohaib.com',
				to: 'zohaibqureshi754@gmail.com',
				subject,
				html: `
          <div style="width: 100%; background-color: #f3f9ff; padding: 5rem 0">
            <div style="max-width: 700px; background-color: white; margin: 0 auto">
              <div style="width: 100%; background-color: #00efbc; padding: 20px 0">
                <h1 style="display:flex;align-items:center;justify-content:center; text-align: center">${email}</h1>
              </div>
              <div style="width: 100%; gap: 10px; padding: 30px 0; display: grid">
                <p style="font-weight: 800; font-size: 1.2rem; padding: 0 30px">
                  Form Shoeshop Store
                </p>
                <div style="font-size: .8rem; margin: 0 30px">
                  <p>FullName: <b>${full_name}</b></p>
                  <p>Email: <b>${email}</b></p>
                  <p>Message: <i>${message}</i></p>
                </div>
              </div>
            </div>
          </div>
        `
			}

			const transporter = nodemailer.createTransport({
				host: 'live.smtp.mailtrap.io',
				port: 587,
				secure: false,
				auth: {
					user: 'api',
					pass: 'efc1a9569a36d90c5407c8a78c248f03'
					// user: process.env.NODE_MAIL_USER_NAME || 'api',
					// pass: process.env.NODE_MAIL_PASSWORD || 'efc1a9569a36d90c5407c8a78c248f03'
				}
			})

			// Send both emails in parallel
			await Promise.all([transporter.sendMail(mail1)])

			res.json({
				success: true,
				message: 'Your message was sent successfully'
			})
		} catch (error) {
			console.error('Error sending email:', error)
			res.status(500).json({
				success: false,
				error: 'Failed to send message. Please try again later.'
			})
		}
	} catch (error) {
		return res.status(500).json({ success: false, message: error.message })
	}
}

export { PostImage, GetImage, sendMessage, getCatImageBySlug, getImageByslug, deleteImage, updateImage, fetchCat, updatedImageLike, updateImageViews, updateImagedowload, updateImageshare, searchImage, sectionList, getSectionImage, getAllImages }
