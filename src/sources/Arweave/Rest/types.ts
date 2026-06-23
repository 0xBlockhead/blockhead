import type { ContentDisplayType } from '$/sources/contentResponse.ts'

export type ArweaveBrowseResult = {
	transactionId: string
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
