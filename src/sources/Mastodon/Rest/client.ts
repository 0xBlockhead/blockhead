import { fetchFailedMessage } from '$/lib/http.ts'
import {
	firstHttpUrlForBinding,
	sourceFetch,
} from '$/sources/_runtime/http.ts'
import { httpUrl } from '$/sources/_shared/wire/HttpRest/client.ts'
import type { SourceBinding } from '$/sources/SourceBinding.ts'

export const mastodonGet = async (
	binding: SourceBinding,
	path: string,
	search?: Record<string, string | undefined>,
	apiVersion = 'v1'
) => {
	const url = httpUrl(binding, `/api/${apiVersion}${path}`, search)
	const response = await sourceFetch(binding, url)
	if (!response.ok)
		throw new Error(await fetchFailedMessage(url, response))

	return response.json()
}

export const mastodonFetch = async (
	binding: SourceBinding,
	path: string,
	search?: Record<string, string | undefined>,
	apiVersion = 'v1'
) => {
	return sourceFetch(binding, httpUrl(binding, `/api/${apiVersion}${path}`, search))
}

export const mastodonFetchUrl = async (
	binding: SourceBinding,
	url: string
) => {
	const parsedUrl = new URL(url)
	if (
		parsedUrl.username !== ''
		|| parsedUrl.password !== ''
		|| parsedUrl.hash !== ''
	)
		throw new Error('Mastodon_Rest: invalid instance URL')

	if (parsedUrl.origin !== new URL(firstHttpUrlForBinding(binding)).origin)
		throw new Error('Mastodon_Rest: instance URL does not match binding')

	return sourceFetch(binding, url)
}

export const mastodonFetchPublicTimelineUrl = async (
	binding: SourceBinding,
	url: string
) => {
	const parsedUrl = new URL(url)
	if (
		parsedUrl.pathname !== '/api/v1/timelines/public'
		|| parsedUrl.username !== ''
		|| parsedUrl.password !== ''
		|| parsedUrl.hash !== ''
	)
		throw new Error('Mastodon_Rest: invalid public timeline URL')

	if (parsedUrl.origin !== new URL(firstHttpUrlForBinding(binding)).origin)
		throw new Error('Mastodon_Rest: public timeline URL does not match binding')

	return sourceFetch(binding, url)
}
