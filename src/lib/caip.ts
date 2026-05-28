export const caip2Key = (networkId: {
	namespace: string
	reference: string
}) => `${networkId.namespace}:${networkId.reference}`

export const caip2FromEvmChainId = (chainId: number) => (
	`eip155:${chainId}`
)

export const caip2RouteParams = (networkId: {
	caip2: {
		namespace: string
		reference: string
	}
}) => ({
	caip2Namespace: networkId.caip2.namespace,
	caip2Reference: networkId.caip2.reference,
})

export const caip2RouteParamsFromEvmChainId = (chainId: number) => ({
	caip2Namespace: 'eip155',
	caip2Reference: `${chainId}`,
})

export const caip2FromRouteParams = (params: {
	caip2Namespace: string
	caip2Reference: string
}) => `${params.caip2Namespace}:${params.caip2Reference}`

export const networkIdFromCaip2RouteParams = (params: {
	caip2Namespace: string
	caip2Reference: string
}) => ({
	caip2: {
		namespace: params.caip2Namespace,
		reference: params.caip2Reference,
	},
})

export const encodeCaipRouteSegment = (value: string) => (
	encodeURIComponent(value)
)

export const decodeCaipRouteSegment = (value: string) => (
	decodeURIComponent(value)
)

export const networkIdFromCaip2 = (caip2RouteSegment: string) => {
	const caip2 = decodeCaipRouteSegment(caip2RouteSegment)
	const separatorIndex = caip2.indexOf(':')
	if (separatorIndex <= 0 || separatorIndex === caip2.length - 1) {
		throw new Error(`Invalid CAIP-2 network id: ${caip2RouteSegment}`)
	}
	return {
		namespace: caip2.slice(0, separatorIndex),
		reference: caip2.slice(separatorIndex + 1),
	}
}

export const evmChainIdFromCaip2 = (caip2: string) => {
	const networkId = networkIdFromCaip2(caip2)
	if (networkId.namespace !== 'eip155') {
		throw new Error(`Expected eip155 CAIP-2 network id: ${caip2}`)
	}
	const chainId = Number(networkId.reference)
	if (!Number.isSafeInteger(chainId) || chainId < 0) {
		throw new Error(`Invalid eip155 chain id: ${caip2}`)
	}
	return chainId
}

export const evmChainIdFromCaip2RouteParams = (params: {
	caip2Namespace: string
	caip2Reference: string
}) => evmChainIdFromCaip2(caip2FromRouteParams(params))
