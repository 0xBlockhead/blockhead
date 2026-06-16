import type { IpfsNamespace } from '$/lib/ipfs.ts'

export type { IpfsNamespace }

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
