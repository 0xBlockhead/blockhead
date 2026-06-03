const networkIdFromCaip2 = (caip2RouteSegment: string) => {
	const caip2 = decodeURIComponent(caip2RouteSegment)
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
