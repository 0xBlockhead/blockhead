import { fetchFailedMessage } from '$/lib/http.ts'
import type { SourcePublicEnv } from '$/sources/$sources.ts'
import {
	sourceFetch,
} from '$/sources/_runtime/http.ts'
import { Source } from '$/sources/Source.ts'
import { SourceTargetKind } from '$/sources/SourceBinding.ts'
import bindings from '$/sources/Mastodon/bindings.ts'

const mastodonInstanceBindingByOrigin = new Map(
	bindings[Source.Mastodon_Rest]
		.filter(({ target }) => target.kind === SourceTargetKind.Global)
		.map((binding) => [
			binding.endpoints[0].origin,
			binding,
		] as const)
)

const mastodonPublicTimelineBindingByOrigin = new Map(
	bindings[Source.Mastodon_Rest]
		.filter(({ target }) => target.kind === SourceTargetKind.Feed)
		.map((binding) => [
			binding.endpoints[0].origin,
			binding,
		] as const)
)

export const mastodonInstanceOrigins = [...mastodonInstanceBindingByOrigin.keys()]
export const mastodonPublicTimelineOrigins = [...mastodonPublicTimelineBindingByOrigin.keys()]

const qs = (search: Record<string, string | undefined>) => {
	const searchParameters = new URLSearchParams()
	for (const [key, value] of Object.entries(search)) {
		if (value == null) continue
		searchParameters.set(key, value)
	}
	const query = searchParameters.toString()
	return query === '' ? '' : `?${query}`
}

export const mastodonGet = async <T>(
	_publicEnv: SourcePublicEnv,
	instanceOrigin: string,
	path: string,
	search?: Record<string, string | undefined>,
	apiVersion = 'v1'
) => {
	const url = `${instanceOrigin}/api/${apiVersion}${path}${qs(search ?? {})}`
	const binding = mastodonInstanceBindingByOrigin.get(new URL(instanceOrigin).origin)
	if (binding == null)
		throw new Error(`Mastodon_Rest: instance binding is missing for ${instanceOrigin}`)

	const response = await sourceFetch(binding, url)
	if (!response.ok)
		throw new Error(await fetchFailedMessage(url, response))

	return response.json<T>()
}

export const mastodonFetch = async (
	_publicEnv: SourcePublicEnv,
	instanceOrigin: string,
	path: string,
	search?: Record<string, string | undefined>,
	apiVersion = 'v1'
) => {
	const binding = mastodonInstanceBindingByOrigin.get(new URL(instanceOrigin).origin)
	if (binding == null)
		throw new Error(`Mastodon_Rest: instance binding is missing for ${instanceOrigin}`)

	return sourceFetch(binding, `${instanceOrigin}/api/${apiVersion}${path}${qs(search ?? {})}`)
}

export const mastodonFetchUrl = async (
	_publicEnv: SourcePublicEnv,
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
	_publicEnv: SourcePublicEnv,
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
