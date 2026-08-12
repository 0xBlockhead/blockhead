import { type as arktype } from 'arktype'

export const huggingFaceSiblingWire = arktype({
	rfilename: 'string > 0',
	'size?': 'number.integer >= 0',
	'blobId?': 'string > 0',
	'lfs?': {
		sha256: 'string > 0',
		size: 'number.integer >= 0',
		'pointerSize?': 'number.integer >= 0',
	},
})

export type HuggingFaceSibling = typeof huggingFaceSiblingWire.infer

export const huggingFaceModelWire = arktype({
	id: 'string > 0',
	'modelId?': 'string > 0',
	'author?': 'string > 0',
	'sha?': 'string > 0',
	'createdAt?': 'string > 0',
	'lastModified?': 'string > 0',
	'pipeline_tag?': 'string > 0',
	'tags?': 'string[]',
	'siblings?': huggingFaceSiblingWire.array(),
})

export type HuggingFaceModel = typeof huggingFaceModelWire.infer

export const huggingFaceModelListWire = huggingFaceModelWire.array()

export type HuggingFaceModelList = typeof huggingFaceModelListWire.infer
