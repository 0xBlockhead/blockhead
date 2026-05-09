import { regex } from 'arkregex'
import { gatewayUrls } from '$/sources/Swarm/Rest/constants.ts'

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

type ParsedSwarmBrowseInput = {
	reference: string
	contentPath: string
}

const swarmBrowseUriPattern = regex('^bzz://(?<reference>[^/?#]+)(?<contentPath>/[^?#]*)?(?:[?#].*)?$', 'i')
const swarmBrowseGatewayPattern = regex('^https?://[^/]+/bzz/(?<reference>[^/?#]+)(?<contentPath>/[^?#]*)?(?:[?#].*)?$', 'i')
const gatewayUrlLastSegment = regex('(?<fileName>[^/]+)$')

const trimSlashes = (value: string) => (
	value.replace(/^\/+|\/+$/g, '')
)

const splitRawTarget = (value: string): ParsedSwarmBrowseInput => {
	const trimmed = trimSlashes(value)
	const firstSlash = trimmed.indexOf('/')
	return (
		firstSlash === -1 ?
			{
				reference: trimmed,
				contentPath: '',
			}
		:
			{
				reference: trimSlashes(trimmed.slice(0, firstSlash)),
				contentPath: trimSlashes(trimmed.slice(firstSlash + 1)),
			}
	)
}

export const parseSwarmBrowseInput = (value: string): ParsedSwarmBrowseInput => {
	const trimmedValue = value.trim()
	const uriMatch = swarmBrowseUriPattern.exec(trimmedValue)
	if (uriMatch?.groups?.reference != null) {
		return {
			reference: trimSlashes(uriMatch.groups.reference),
			contentPath: trimSlashes(uriMatch.groups.contentPath ?? ''),
		}
	}

	const gatewayMatch = swarmBrowseGatewayPattern.exec(trimmedValue)
	if (gatewayMatch?.groups?.reference != null) {
		return {
			reference: trimSlashes(gatewayMatch.groups.reference),
			contentPath: trimSlashes(gatewayMatch.groups.contentPath ?? ''),
		}
	}

	return splitRawTarget(trimmedValue)
}

export const swarmResourceCanonicalUri = ({
	reference,
	contentPath,
}: SwarmResourceAddress) => (
	`bzz://${trimSlashes(reference)}${trimSlashes(contentPath) === '' ? '' : `/${trimSlashes(contentPath)}`}`
)

export const swarmResourceHref = ({
	reference,
	contentPath,
}: SwarmResourceAddress) => (
	`/swarm/${encodeURIComponent(trimSlashes(reference))}${trimSlashes(contentPath) === '' ? '' : `/path/${trimSlashes(contentPath).split('/').map(encodeURIComponent).join('/')}`}`
)

export const swarmResourceAddressFromInput = ({
	targetInput,
	contentPathInput = '',
}: {
	targetInput: string
	contentPathInput?: string
}): SwarmResourceAddress | undefined => {
	const parsedTarget = parseSwarmBrowseInput(targetInput)
	const reference = trimSlashes(parsedTarget.reference)
	if (reference === '') return undefined

	const contentPath = trimSlashes(
		contentPathInput.trim() !== '' ?
			contentPathInput
		:
			parsedTarget.contentPath,
	)

	return {
		reference,
		contentPath,
	}
}

export const swarmResourceAddressFromRouteParams = ({
	reference,
	contentPath,
}: {
	reference: string | null | undefined
	contentPath?: string | null | undefined
}): SwarmResourceAddress | undefined => {
	const parsedReference = trimSlashes(reference ?? '')
	if (parsedReference === '') return undefined

	return {
		reference: parsedReference,
		contentPath: trimSlashes(contentPath ?? ''),
	}
}

export const swarmGatewayUrl = ({
	reference,
	contentPath,
	gatewayOrigin,
}: {
	reference: string
	contentPath?: string
	gatewayOrigin: string
}): string => {
	const trimmedReference = trimSlashes(reference.trim())
	const trimmedPath = trimSlashes(contentPath?.trim() ?? '')
	return `${gatewayOrigin}/bzz/${trimmedReference}${trimmedPath ? `/${trimmedPath}` : ''}`
}

export const fetchSwarmBrowseResult = async ({
	reference,
	contentPath,
	signal,
}: {
	reference: string
	contentPath?: string
	signal?: AbortSignal
}): Promise<SwarmBrowseResult> => {
	const trimmedReference = trimSlashes(reference.trim())
	const trimmedPath = trimSlashes(contentPath?.trim() ?? '')
	const failures: string[] = []

	for (const gatewayOrigin of gatewayUrls) {
		const gatewayUrl = swarmGatewayUrl({
			reference: trimmedReference,
			contentPath: trimmedPath,
			gatewayOrigin,
		})

		const response = await fetch(gatewayUrl, { signal })
		if (!response.ok) {
			failures.push(`${gatewayOrigin} (${response.status} ${response.statusText})`)
			continue
		}

		const { parseIpfsContentResponse } = await import('$/lib/contentType.ts')
		const parsedContent = await parseIpfsContentResponse({
			response,
			fileName: gatewayUrlLastSegment.exec(gatewayUrl)?.groups?.fileName,
		})

		return {
			reference: trimmedReference,
			contentPath: trimmedPath,
			gatewayOrigin,
			gatewayUrl,
			fileName: parsedContent.fileName,
			extension: parsedContent.extension,
			contentType: parsedContent.contentType,
			contentLength: parsedContent.contentLength,
			displayType: parsedContent.displayType,
			isContentTypeInferred: parsedContent.isContentTypeInferred,
			text: parsedContent.text,
		}
	}

	throw new Error(
		`Unable to load bzz://${trimmedReference}${trimmedPath ? `/${trimmedPath}` : ''} from public gateways: ${failures.join('; ')}`,
	)
}
