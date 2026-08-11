export const swarmResourceHrefFromInput = (value: string) => {
	const match = /^(?:bzz|swarm):\/\/([^/?#]+)((?:\/[^?#]*)?)(?:[?#].*)?$/i.exec(value.trim())
	if (match?.[1] == null)
		return undefined

	const reference = match[1]
		.replace(/^0x/i, '')
		.replace(/^\/+|\/+$/g, '')
	if (reference === '')
		return undefined

	const contentPath = match[2].replace(/^\/+|\/+$/g, '')
	return `/swarm/${encodeURIComponent(reference)}${contentPath === '' ? '' : `/path/${contentPath.split('/').map(encodeURIComponent).join('/')}`}`
}

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
