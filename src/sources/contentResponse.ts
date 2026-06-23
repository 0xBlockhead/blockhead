import { fileTypeFromBuffer } from 'file-type'

export type ContentDisplayType =
	| 'text'
	| 'image'
	| 'video'
	| 'audio'
	| 'json'
	| 'xml'
	| 'pdf'
	| 'iframe'
	| 'binary'

export type ParsedContentResponse = {
	contentLength?: number
	contentType?: string
	displayType: ContentDisplayType
	extension?: string
	fileName?: string
	isContentTypeInferred: boolean
	text?: string
}

const trimContentType = (value: string | null): string | undefined => (
	value?.split(';')[0]?.trim() || undefined
)

const maybeText = (bytes: Uint8Array): string | undefined => {
	try {
		return new TextDecoder().decode(bytes)
	} catch {
		return undefined
	}
}

const contentTypeFromText = (text: string | undefined): string | undefined => {
	const trimmed = text?.trim()
	if (trimmed == null || trimmed === '') return undefined

	if (
		trimmed.startsWith('<!doctype html')
		|| trimmed.startsWith('<html')
	) return 'text/html'

	if (
		trimmed.startsWith('<?xml')
		|| (
			trimmed.startsWith('<')
			&& trimmed.endsWith('>')
		)
	) return trimmed.includes('<svg') ? 'image/svg+xml' : 'application/xml'

	if (
		(trimmed.startsWith('{') && trimmed.endsWith('}'))
		|| (trimmed.startsWith('[') && trimmed.endsWith(']'))
	) {
		try {
			JSON.parse(trimmed)
			return 'application/json'
		} catch {
			return undefined
		}
	}

	const printableRatio = (
		[...trimmed].filter((character) => (
			character >= ' ' || character === '\n' || character === '\r' || character === '\t'
		)).length / trimmed.length
	)

	return printableRatio > 0.9 ? 'text/plain' : undefined
}

export const displayTypeFromContent = ({
	contentType,
	text,
}: {
	contentType?: string
	text?: string
}): ContentDisplayType => (
	contentType == null || contentType.startsWith('text/plain') ?
		'text'
	:
		contentType.startsWith('text/html') ?
			'iframe'
		:
			contentType.startsWith('text/') ?
				'text'
			:
				contentType.startsWith('image/') ?
					'image'
				:
					contentType.startsWith('video/') ?
						'video'
					:
						contentType.startsWith('audio/') ?
							'audio'
						:
							contentType.startsWith('application/json') ?
								'json'
							:
								contentType.startsWith('application/xml') || contentType.startsWith('text/xml') ?
									'xml'
								:
									contentType.startsWith('application/pdf') ?
										'pdf'
									:
										text != null ?
											'text'
										:
											'binary'
)

export const parseContentResponse = async ({
	response,
	fileName,
}: {
	response: Response
	fileName?: string
}): Promise<ParsedContentResponse> => {
	const bytes = new Uint8Array(await response.clone().arrayBuffer())
	const sniffedType = await fileTypeFromBuffer(bytes)
	const text = maybeText(bytes)
	const headerContentType = trimContentType(response.headers.get('content-type'))
	const inferredContentType = (
		sniffedType?.mime
		?? contentTypeFromText(text)
	)
	const contentType = headerContentType ?? inferredContentType
	const displayType = displayTypeFromContent({
		contentType,
		text,
	})

	return {
		contentLength: (
			Number.isFinite(Number(response.headers.get('content-length'))) ?
				Number(response.headers.get('content-length'))
			:
				bytes.byteLength > 0 ?
					bytes.byteLength
				:
					undefined
		),
		contentType,
		displayType,
		extension: sniffedType?.ext,
		fileName,
		isContentTypeInferred: headerContentType == null && inferredContentType != null,
		text: (
			displayType === 'binary'
			|| displayType === 'image'
			|| displayType === 'video'
			|| displayType === 'audio'
			|| displayType === 'pdf'
		) ?
			undefined
		:
			text,
	}
}
