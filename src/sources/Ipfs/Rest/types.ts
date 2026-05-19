export type IpfsNamespace = 'ipfs' | 'ipns'

export type IpfsBrowseResult = {
	namespace: IpfsNamespace
	target: string
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

export type ParsedIpfsBrowseInput = {
	namespace?: IpfsNamespace
	target: string
	contentPath: string
}
