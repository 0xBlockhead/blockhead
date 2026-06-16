export type IpfsNamespace = 'ipfs' | 'ipns'

export type IpfsResourceAddress = {
	namespace: IpfsNamespace
	target: string
	contentPath: string
}

const ipfsBrowseUriPattern = /^(ipfs|ipns):\/\/([^/?#]+)((?:\/[^?#]*)?)(?:[?#].*)?$/i
const ipfsBrowseGatewayPattern = /^https?:\/\/[^/]+\/(ipfs|ipns)\/([^/?#]+)((?:\/[^?#]*)?)(?:[?#].*)?$/i

export const trimIpfsSlashes = (value: string) => (
	value.replace(/^\/+|\/+$/g, '')
)

export const ipfsNamespaceFromString = (value: string | null | undefined): IpfsNamespace | null => (
	value === 'ipfs' || value === 'ipns' ?
		value
	:
		null
)

export const ipfsResourceAddressFromInput = ({
	targetInput,
	contentPathInput = '',
}: {
	targetInput: string
	contentPathInput?: string
}): IpfsResourceAddress | null => {
	const trimmedInput = targetInput.trim()
	const parsedTarget = (
		((match) => (
			match == null ?
				undefined
			:
				{
					namespace: ipfsNamespaceFromString(match[1].toLowerCase()),
					target: trimIpfsSlashes(match[2]),
					contentPath: trimIpfsSlashes(match[3]),
				}
		))(ipfsBrowseUriPattern.exec(trimmedInput))
		?? ((match) => (
			match == null ?
				undefined
			:
				{
					namespace: ipfsNamespaceFromString(match[1].toLowerCase()),
					target: trimIpfsSlashes(match[2]),
					contentPath: trimIpfsSlashes(match[3]),
				}
		))(ipfsBrowseGatewayPattern.exec(trimmedInput))
		?? {
			namespace: null,
			target: trimIpfsSlashes(trimmedInput),
			contentPath: '',
		}
	)
	const target = trimIpfsSlashes(parsedTarget.target)
	if (target === '') return null

	return {
		namespace: parsedTarget.namespace ?? ipfsNamespaceForTarget(target),
		target,
		contentPath: trimIpfsSlashes(
			contentPathInput.trim() !== '' ?
				contentPathInput
			:
				parsedTarget.contentPath
		),
	}
}

export const ipfsNamespaceForTarget = (target: string): IpfsNamespace => (
	/^(Qm[1-9A-HJ-NP-Za-km-z]{44}|bafy[a-z2-7]+|bafk[a-z2-7]+)$/i.test(target.trim()) ?
		'ipfs'
	:
		'ipns'
)

export const ipfsResourceCanonicalUri = ({
	namespace,
	target,
	contentPath,
}: IpfsResourceAddress) => (
	`${namespace}://${trimIpfsSlashes(target)}${trimIpfsSlashes(contentPath) === '' ? '' : `/${trimIpfsSlashes(contentPath)}`}`
)

export const ipfsResourceHref = ({
	namespace,
	target,
	contentPath,
}: IpfsResourceAddress) => (
	`/ipfs/${encodeURIComponent(trimIpfsSlashes(namespace))}/${encodeURIComponent(trimIpfsSlashes(target))}${trimIpfsSlashes(contentPath) === '' ? '' : `/path/${trimIpfsSlashes(contentPath).split('/').map(encodeURIComponent).join('/')}`}`
)

export const ipfsResourceAddressFromRouteParams = ({
	namespace,
	target,
	contentPath,
}: {
	namespace: string | null | undefined
	target: string | null | undefined
	contentPath?: string | null | undefined
}): IpfsResourceAddress | null => {
	const parsedNamespace = ipfsNamespaceFromString(namespace)
	const parsedTarget = trimIpfsSlashes(target ?? '')
	if (parsedNamespace == null || parsedTarget === '') return null

	return {
		namespace: parsedNamespace,
		target: parsedTarget,
		contentPath: trimIpfsSlashes(contentPath ?? ''),
	}
}
