import { fetchFailedMessage } from '$/lib/http.ts'
import {
	firstHttpUrlForBinding,
	sourceFetch,
} from '$/sources/_runtime/http.ts'
import { httpUrl } from '$/sources/_shared/wire/HttpRest/client.ts'
import { Source } from '$/sources/Source.ts'
import {
	SourceTargetKind,
} from '$/sources/SourceBinding.ts'
import bindings from '$/sources/Mastodon/bindings.ts'

const mastodonInstanceBindingByOrigin = new Map(
	bindings[Source.Mastodon_Rest]
		.filter(({ target }) => target.kind === SourceTargetKind.Global)
		.map((binding) => [
			new URL(firstHttpUrlForBinding(binding)).origin,
			binding,
		] as const)
)

const mastodonPublicTimelineBindingByOrigin = new Map(
	bindings[Source.Mastodon_Rest]
		.filter(({ target }) => target.kind === SourceTargetKind.Feed)
		.map((binding) => [
			new URL(firstHttpUrlForBinding(binding)).origin,
			binding,
		] as const)
)

export const mastodonInstanceOrigins = [...mastodonInstanceBindingByOrigin.keys()]
export const mastodonPublicTimelineOrigins = [...mastodonPublicTimelineBindingByOrigin.keys()]

export const mastodonGet = async (
	instanceOrigin: string,
	path: string,
	search?: Record<string, string | undefined>,
	apiVersion = 'v1'
) => {
	const binding = mastodonInstanceBindingByOrigin.get(new URL(instanceOrigin).origin)
	if (binding == null)
		throw new Error(`Mastodon_Rest: instance binding is missing for ${instanceOrigin}`)

	const url = httpUrl(binding, `/api/${apiVersion}${path}`, search)
	const response = await sourceFetch(binding, url)
	if (!response.ok)
		throw new Error(await fetchFailedMessage(url, response))

	return response.json()
}

export const mastodonFetch = async (
	instanceOrigin: string,
	path: string,
	search?: Record<string, string | undefined>,
	apiVersion = 'v1'
) => {
	const binding = mastodonInstanceBindingByOrigin.get(new URL(instanceOrigin).origin)
	if (binding == null)
		throw new Error(`Mastodon_Rest: instance binding is missing for ${instanceOrigin}`)

	return sourceFetch(binding, httpUrl(binding, `/api/${apiVersion}${path}`, search))
}

export const mastodonFetchUrl = async (
	url: string
) => {
	const parsedUrl = new URL(url)
	if (
		parsedUrl.username !== ''
		|| parsedUrl.password !== ''
		|| parsedUrl.hash !== ''
	)
		throw new Error('Mastodon_Rest: invalid instance URL')

	const binding = mastodonInstanceBindingByOrigin.get(parsedUrl.origin)
	if (binding == null)
		throw new Error(`Mastodon_Rest: instance binding is missing for ${parsedUrl.origin}`)

	return sourceFetch(binding, url)
}

export const mastodonFetchPublicTimelineUrl = async (
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

	const binding = mastodonPublicTimelineBindingByOrigin.get(parsedUrl.origin)
	if (binding == null)
		throw new Error(`Mastodon_Rest: public timeline binding is missing for ${parsedUrl.origin}`)

	return sourceFetch(binding, url)
}
