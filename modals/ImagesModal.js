import mongoose from 'mongoose'

const ImageSchema = new mongoose.Schema(
	{
		image: {
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
			type: [String],
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
		}
	},
	{ timestamps: true }
)

export default mongoose.model('Image', ImageSchema)
