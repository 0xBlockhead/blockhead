import { corsFetch, jsonErrorHintFromResponse } from '$/lib/http.ts'
import Ipfs from '$/sources/Ipfs/index.ts'
import { gatewayUrls } from '$/sources/Ipfs/Rest/constants.ts'
import type {
	IpfsBrowseResult,
	IpfsNamespace,
	ParsedIpfsBrowseInput,
} from '$/sources/Ipfs/Rest/types.ts'

const ipfsBrowseUriPattern = /^(ipfs|ipns):\/\/([^/?#]+)((?:\/[^?#]*)?)(?:[?#].*)?$/i
const ipfsBrowseGatewayPattern = /^https?:\/\/[^/]+\/(ipfs|ipns)\/([^/?#]+)((?:\/[^?#]*)?)(?:[?#].*)?$/i
const gatewayUrlLastSegment = /([^/]+)$/

const trimSlashes = (value: string) => (
	value.replace(/^\/+|\/+$/g, '')
)

const namespaceFromString = (value: string | undefined): IpfsNamespace | undefined => (
	value === 'ipfs' || value === 'ipns' ?
		value
	:
		undefined
)

export const parseBrowseInput = (value: string): ParsedIpfsBrowseInput => {
	const trimmedValue = value.trim()
	const uriMatch = ipfsBrowseUriPattern.exec(trimmedValue)
	if (uriMatch != null) {
		return {
			namespace: namespaceFromString(uriMatch[1].toLowerCase()),
			target: trimSlashes(uriMatch[2]),
			contentPath: trimSlashes(uriMatch[3]),
		}
	}

	const gatewayMatch = ipfsBrowseGatewayPattern.exec(trimmedValue)
	if (gatewayMatch != null) {
		return {
			namespace: namespaceFromString(gatewayMatch[1].toLowerCase()),
			target: trimSlashes(gatewayMatch[2]),
			contentPath: trimSlashes(gatewayMatch[3]),
		}
	}

	return {
		target: trimSlashes(trimmedValue),
		contentPath: '',
	}
}

export const getNamespaceForTarget = (target: string): IpfsNamespace => (
	/^(Qm[1-9A-HJ-NP-Za-km-z]{44}|bafy[a-z2-7]+|bafk[a-z2-7]+)$/i.test(target.trim()) ?
		'ipfs'
	:
		'ipns'
)

const resolvedIpfsNamespace = ({
	target,
	namespace,
}: {
	target: string
	namespace?: IpfsNamespace
}): IpfsNamespace => (
	namespace ?? getNamespaceForTarget(target)
)

export const getGatewayUrl = ({
	namespace,
	target,
	contentPath,
	gatewayOrigin,
}: {
	namespace?: IpfsNamespace
	target: string
	contentPath?: string
	gatewayOrigin: string
}): string => {
	const trimmedTarget = trimSlashes(target.trim())
	const trimmedPath = trimSlashes(contentPath?.trim() ?? '')
	return `${gatewayOrigin}/${resolvedIpfsNamespace({
		target: trimmedTarget,
		namespace,
	})}/${trimmedTarget}${trimmedPath ? `/${trimmedPath}` : ''}`
}

export const fetchBrowseResult = async ({
	namespace,
	target,
	contentPath,
	signal,
}: {
	namespace?: IpfsNamespace
	target: string
	contentPath?: string
	signal?: AbortSignal
}): Promise<IpfsBrowseResult> => {
	const trimmedTarget = trimSlashes(target.trim())
	const trimmedPath = trimSlashes(contentPath?.trim() ?? '')
	const resolvedNamespace = resolvedIpfsNamespace({
		target: trimmedTarget,
		namespace,
	})
	const failures: string[] = []

	for (const gatewayOrigin of gatewayUrls) {
		const gatewayUrl = getGatewayUrl({
			namespace: resolvedNamespace,
			target: trimmedTarget,
			contentPath: trimmedPath,
			gatewayOrigin,
		})

		const response = await corsFetch(gatewayUrl, {
			origins: Ipfs.origins,
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
			fileName: gatewayUrlLastSegment.exec(gatewayUrl)?.[1],
		})

		return {
			namespace: resolvedNamespace,
			target: trimmedTarget,
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
		`Unable to load ${resolvedNamespace}://${trimmedTarget}${trimmedPath ? `/${trimmedPath}` : ''} from public gateways: ${failures.join('; ')}`,
	)
}
