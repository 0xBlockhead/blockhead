export type SwarmBrowseResult = {
	reference: string
	contentPath: string
	gatewayOrigin: string
	gatewayUrl: string
	fileName?: string
	extension?: string
	contentType?: string
	contentLength?: number
	displayType: 'text' | 'image' | 'video' | 'audio' | 'json' | 'xml' | 'pdf' | 'iframe' | 'binary'
	isContentTypeInferred: boolean
	text?: string
}

export type SwarmResourceAddress = {
	reference: string
	contentPath: string
}

export type ParsedSwarmBrowseInput = {
	reference: string
	contentPath: string
}
