import type { IpfsNamespace } from '$/lib/ipfs.ts'
import type { ContentDisplayType } from '$/sources/contentResponse.ts'

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
	displayType: ContentDisplayType
	isContentTypeInferred: boolean
	text?: string
}
