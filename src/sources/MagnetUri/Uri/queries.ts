export const parseMagnetUri = (uri: string) => {
	const url = new URL(uri)
	const params = url.searchParams
	const displayName = params.get('dn')

	return {
		uri,
		exactTopics: params.getAll('xt'),
		...(displayName != null && {
			displayName,
		}),
		trackers: params.getAll('tr'),
		webSeeds: params.getAll('ws'),
	}
}
