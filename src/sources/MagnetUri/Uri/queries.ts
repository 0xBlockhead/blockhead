import type { MagnetUri } from '$/sources/MagnetUri/Uri/types.ts'

export const parseMagnetUri = (uri: string): MagnetUri => {
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
