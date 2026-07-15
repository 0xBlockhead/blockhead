export type HuggingFaceSibling = {
	rfilename: string
	size?: number
	blobId?: string
	lfs?: {
		sha256: string
		size: number
		pointerSize?: number
	}
}

export type HuggingFaceModel = {
	id: string
	modelId?: string
	author?: string
	sha?: string
	createdAt?: string
	lastModified?: string
	pipeline_tag?: string
	tags?: string[]
	siblings?: HuggingFaceSibling[]
}

export type HuggingFaceModelList = HuggingFaceModel[]
