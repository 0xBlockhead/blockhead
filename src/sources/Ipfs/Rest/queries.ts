import { regex } from 'arkregex'
import { jsonErrorHintFromResponse } from '$/lib/http.ts'
import { gatewayUrls } from '$/sources/Ipfs/Rest/constants.ts'

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

const ipfsBrowseUriPattern = regex('^(?<namespace>ipfs|ipns)://(?<target>[^/?#]+)(?<contentPath>/[^?#]*)?(?:[?#].*)?$', 'i')
const ipfsBrowseGatewayPattern = regex('^https?://[^/]+/(?<namespace>ipfs|ipns)/(?<target>[^/?#]+)(?<contentPath>/[^?#]*)?(?:[?#].*)?$', 'i')
const gatewayUrlLastSegment = regex('(?<fileName>[^/]+)$')

const trimSlashes = (value: string) => (
	value.replace(/^\/+|\/+$/g, '')
)

const namespaceFromString = (value: string | undefined): IpfsNamespace | undefined => (
	value === 'ipfs' || value === 'ipns' ?
		value
	:
		undefined
)

export const parseIpfsBrowseInput = (value: string): ParsedIpfsBrowseInput => {
	const trimmedValue = value.trim()
	const uriMatch = ipfsBrowseUriPattern.exec(trimmedValue)
	if (uriMatch?.groups?.target != null) {
		return {
			namespace: namespaceFromString(uriMatch.groups.namespace.toLowerCase()),
			target: trimSlashes(uriMatch.groups.target),
			contentPath: trimSlashes(uriMatch.groups.contentPath ?? ''),
		}
	}

	const gatewayMatch = ipfsBrowseGatewayPattern.exec(trimmedValue)
	if (gatewayMatch?.groups?.target != null) {
		return {
			namespace: namespaceFromString(gatewayMatch.groups.namespace.toLowerCase()),
			target: trimSlashes(gatewayMatch.groups.target),
			contentPath: trimSlashes(gatewayMatch.groups.contentPath ?? ''),
		}
	}

	return {
		target: trimSlashes(trimmedValue),
		contentPath: '',
	}
}

export const ipfsNamespaceForTarget = (target: string): IpfsNamespace => (
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
	namespace ?? ipfsNamespaceForTarget(target)
)

export const ipfsGatewayUrl = ({
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

export const fetchIpfsBrowseResult = async ({
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
		const gatewayUrl = ipfsGatewayUrl({
			namespace: resolvedNamespace,
			target: trimmedTarget,
			contentPath: trimmedPath,
			gatewayOrigin,
		})

		const response = await fetch(gatewayUrl, { signal })
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
			fileName: gatewayUrlLastSegment.exec(gatewayUrl)?.groups?.fileName,
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
