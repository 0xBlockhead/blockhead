import type { IpfsNamespace } from '$/sources/Ipfs/Rest/types.ts'
import {
	ipfsNamespaceForTarget,
	parseIpfsBrowseInput,
} from '$/sources/Ipfs/Rest/queries.ts'

export type IpfsResourceAddress = {
	namespace: IpfsNamespace
	target: string
	contentPath: string
}

const trimSlashes = (value: string) => (
	value.replace(/^\/+|\/+$/g, '')
)

export const ipfsNamespaceFromString = (value: string | null | undefined): IpfsNamespace | null => (
	value === 'ipfs' || value === 'ipns' ?
		value
	:
		null
)

export const ipfsResourceCanonicalUri = ({
	namespace,
	target,
	contentPath,
}: IpfsResourceAddress) => (
	`${namespace}://${trimSlashes(target)}${trimSlashes(contentPath) === '' ? '' : `/${trimSlashes(contentPath)}`}`
)

export const ipfsResourceHref = ({
	namespace,
	target,
	contentPath,
}: IpfsResourceAddress) => (
	`/ipfs/${encodeURIComponent(trimSlashes(namespace))}/${encodeURIComponent(trimSlashes(target))}${trimSlashes(contentPath) === '' ? '' : `/path/${trimSlashes(contentPath).split('/').map(encodeURIComponent).join('/')}`}`
)

export const ipfsResourceAddressFromInput = ({
	targetInput,
	contentPathInput = '',
}: {
	targetInput: string
	contentPathInput?: string
}): IpfsResourceAddress | null => {
	const parsedTarget = parseIpfsBrowseInput(targetInput)
	const target = trimSlashes(parsedTarget.target)
	if (target === '') return null

	const contentPath = trimSlashes(
		contentPathInput.trim() !== '' ?
			contentPathInput
		:
			parsedTarget.contentPath,
	)

	return {
		namespace: parsedTarget.namespace ?? ipfsNamespaceForTarget(target),
		target,
		contentPath,
	}
}

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
	const parsedTarget = trimSlashes(target ?? '')
	if (parsedNamespace == null || parsedTarget === '') return null

	return {
		namespace: parsedNamespace,
		target: parsedTarget,
		contentPath: trimSlashes(contentPath ?? ''),
	}
}
