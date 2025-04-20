const mongoose = require('mongoose')

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

module.exports = mongoose.model('Image', ImageSchema)
