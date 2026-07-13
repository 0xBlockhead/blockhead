export const caip2ParamValueFromString = (
	param: string
) => {
	const parts = param.split(':')

	return (
		parts.length === 2
		&& parts[0] !== ''
		&& parts[1] !== '' ?
			{
				namespace: parts[0],
				reference: parts[1],
			}
		:
			undefined
	)
}

export const caip2SelectorValueFromString = (
	param: string
) => caip2ParamValueFromString(param) ?? {
	namespace: '',
	reference: '',
}

export const caip2StringFromValue = (
	caip2: {
		namespace: string
		reference: string
	}
) => `${caip2.namespace}:${caip2.reference}`

export const networkSelectorFromCaip2 = (
	caip2: `${string}:${string}`
) => {
	const [
		namespace = '',
		reference = '',
	] = caip2.split(':')

	return {
		caip2: {
			namespace,
			reference,
		},
	}
}

export const eip155NetworkSelectorFromCaip2 = (
	caip2: `eip155:${string}`
) => ({
	caip2: {
		namespace: 'eip155' as const,
		reference: caip2.split(':')[1] ?? '',
	},
})
