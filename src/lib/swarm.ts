export const swarmResourceReferenceFromRouteParam = (
	reference: string
) => reference
	.replace(/^bzz:\/\//, '')
	.replace(/^swarm:\/\//, '')
	.replace(/^0x/, '')
	.replace(/^\/+/, '')
	.replace(/\/+$/, '')

export const swarmResourceContentPathFromRouteParam = (
	contentPath: string
) => contentPath
	.replace(/^\/+/, '')
	.replace(/\/+$/, '')
