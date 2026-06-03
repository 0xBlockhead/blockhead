import { regex } from 'arkregex'
import { corsFetch, jsonErrorHintFromResponse } from '$/lib/http.ts'
import { gatewayUrls } from '$/sources/Swarm/Rest/constants.ts'
import type {
	ParsedSwarmBrowseInput,
	SwarmBrowseResult,
	SwarmResourceAddress,
} from '$/sources/Swarm/Rest/types.ts'

const swarmBrowseUriPattern = regex('^(?:bzz|swarm)://(?<reference>[^/?#]+)(?<contentPath>/[^?#]*)?(?:[?#].*)?$', 'i')
const swarmBrowseGatewayPattern = regex('^https?://[^/]+/bzz/(?<reference>[^/?#]+)(?<contentPath>/[^?#]*)?(?:[?#].*)?$', 'i')

const stripHexPrefix = (value: string) => (
	value.toLowerCase().startsWith('0x') ?
		value.slice(2)
	:
		value
)

const trimSlashes = (value: string) => (
	value.replace(/^\/+|\/+$/g, '')
)

export const normalizeReference = (reference: string) => {
	const trimmed = reference.trim()
	const withoutScheme = (
		trimmed.toLowerCase().startsWith('bzz://') ?
			trimmed.slice('bzz://'.length)
		: trimmed.toLowerCase().startsWith('swarm://') ?
			trimmed.slice('swarm://'.length)
		:
			trimmed
	)
	return stripHexPrefix(trimSlashes(withoutScheme))
}

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

export const parseBrowseInput = (value: string): ParsedSwarmBrowseInput => {
	const trimmedValue = value.trim()
	const uriMatch = swarmBrowseUriPattern.exec(trimmedValue)
	if (uriMatch?.groups.reference != null) {
		return {
			reference: normalizeReference(uriMatch.groups.reference),
			contentPath: trimSlashes(uriMatch.groups.contentPath ?? ''),
		}
	}

	const gatewayMatch = swarmBrowseGatewayPattern.exec(trimmedValue)
	if (gatewayMatch?.groups.reference != null) {
		return {
			reference: normalizeReference(gatewayMatch.groups.reference),
			contentPath: trimSlashes(gatewayMatch.groups.contentPath ?? ''),
		}
	}

	const split = splitRawTarget(normalizeReference(trimmedValue))

	return {
		reference: split.reference,
		contentPath: trimSlashes(split.contentPath),
	}
}

export const getResourceCanonicalUri = ({
	reference,
	contentPath,
}: SwarmResourceAddress) => {
	const normalizedReference = normalizeReference(reference)
	const normalizedPath = trimSlashes(contentPath)
	return (
		`bzz://${normalizedReference}${normalizedPath === '' ? '' : `/${normalizedPath}`}`
	)
}

export const getResourceHref = ({
	reference,
	contentPath,
}: SwarmResourceAddress) => {
	const normalizedReference = normalizeReference(reference)
	const normalizedPath = trimSlashes(contentPath)
	return (
		`/swarm/${encodeURIComponent(normalizedReference)}${normalizedPath === '' ? '' : `/path/${normalizedPath.split('/').map(encodeURIComponent).join('/')}`}`
	)
}

export const getResourceAddressFromInput = ({
	targetInput,
	contentPathInput = '',
}: {
	targetInput: string
	contentPathInput?: string
}): SwarmResourceAddress | undefined => {
	const parsedTarget = parseBrowseInput(targetInput)
	const reference = normalizeReference(parsedTarget.reference)
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

export const getResourceAddressFromRouteParams = ({
	reference,
	contentPath,
}: {
	reference: string | null | undefined
	contentPath?: string | null | undefined
}): SwarmResourceAddress | undefined => {
	const parsedReference = normalizeReference(reference ?? '')
	if (parsedReference === '') return undefined

	return {
		reference: parsedReference,
		contentPath: trimSlashes(contentPath ?? ''),
	}
}

export const getGatewayUrl = ({
	reference,
	contentPath,
	gatewayOrigin,
}: {
	reference: string
	contentPath?: string
	gatewayOrigin: string
}): string => {
	const trimmedReference = normalizeReference(reference)
	const trimmedPath = trimSlashes(contentPath?.trim() ?? '')
	return `${gatewayOrigin}/bzz/${trimmedReference}${trimmedPath ? `/${trimmedPath}` : ''}`
}

export const fetchBrowseResult = async ({
	reference,
	contentPath,
	signal,
}: {
	reference: string
	contentPath?: string
	signal?: AbortSignal
}): Promise<SwarmBrowseResult> => {
	const trimmedReference = normalizeReference(reference)
	const trimmedPath = trimSlashes(contentPath?.trim() ?? '')
	const failures: string[] = []

	for (const gatewayOrigin of gatewayUrls) {
		const gatewayUrl = getGatewayUrl({
			reference: trimmedReference,
			contentPath: trimmedPath,
			gatewayOrigin,
		})

		const response = await corsFetch(gatewayUrl, {
			origins: gatewayUrls.map((origin) => ({
				origin,
				corsEnabled: false,
			})),
			init: { signal },
		})
		if (!response.ok) {
			const hint = await jsonErrorHintFromResponse(response)
			failures.push(
				hint ?
					`${gatewayOrigin} (${response.status}): ${hint}`
				:
					`${gatewayOrigin} (${response.status} ${response.statusText})`,
			)
			continue
		}

		const { parseIpfsContentResponse } = await import('$/lib/contentType.ts')
		const parsedContent = await parseIpfsContentResponse({
			response,
			fileName: (
				trimmedPath !== '' ?
					trimmedPath.split('/').at(-1)
				:
					undefined
			),
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
