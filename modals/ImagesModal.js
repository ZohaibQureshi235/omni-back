import mongoose from 'mongoose'

const ImageSchema = new mongoose.Schema(
	{
		image: {
			type: String,
			required: true
		},

		section: {
			type: String,
			required: true
		},

		title: {
			type: String,
			required: true
		},

		desc: {
			type: String,
			required: true
		},

		keywords: {
			type: String,
			default: []
		},

		views: {
			type: Number,
			default: 0
		},

		downloads: {
			type: Number,
			default: 0
		},

		shares: {
			type: Number,
			default: 0
		},

		like: {
			type: Number,
			default: 0
		},

		slug: {
			type: String,
			required: true
		}
	},
	{ timestamps: true }
)

const SectionSchema = new mongoose.Schema({
	section_list: {
		type: String,
		required: true
	}
})

const ImagesModal = mongoose.model('Image', ImageSchema)
const SectionsModal = mongoose.model('Section', SectionSchema)

export { ImagesModal, SectionsModal }
