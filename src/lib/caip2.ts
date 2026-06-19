export const caip2ParamValueFromString = (
	param: string
) => {
	const [
		namespace,
		reference,
		extra,
	] = param.split(':')

	return (
		namespace
		&& reference
		&& extra === undefined ?
			{
				namespace,
				reference,
			}
		:
			undefined
	)
}

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
