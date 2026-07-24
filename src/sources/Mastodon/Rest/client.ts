import { fetchFailedMessage } from '$/lib/http.ts'
import { sourceProviderDefinitions } from '$/sources/$sourceProviders.ts'
import type { SourcePublicEnv } from '$/sources/$sources.ts'
import { Source } from '$/sources/Source.ts'
import { SourceTargetKind } from '$/sources/SourceBinding.ts'
import {
	httpOriginsForBinding,
	sourceFetch,
} from '$/sources/_runtime/http.ts'

const mastodonRestBindings = sourceProviderDefinitions
	.flatMap((provider) => provider.bindings)
	.filter((binding) => binding.source === Source.Mastodon_Rest)

const mastodonInstanceBindingByOrigin = new Map(
	mastodonRestBindings.flatMap((binding) => {
		if (
			binding.target.kind !== SourceTargetKind.Global
			|| !binding.target.key.startsWith('mastodon-instance:')
		)
			return []

		const origins = httpOriginsForBinding(binding)
		if (
			origins.length !== 1
			|| binding.target.key !== `mastodon-instance:${origins[0].origin}`
		)
			throw new Error('Mastodon_Rest: invalid instance binding target')

		return [[origins[0].origin, binding] as const]
	})
)

const mastodonPublicTimelineBindingByOrigin = new Map(
	mastodonRestBindings.flatMap((binding) => {
		if (
			binding.target.kind !== SourceTargetKind.Feed
			|| !binding.target.key.startsWith('mastodon-public-timeline:')
		)
			return []

		const origins = httpOriginsForBinding(binding)
		if (
			origins.length !== 1
			|| binding.target.key !== `mastodon-public-timeline:${origins[0].origin}`
		)
			throw new Error('Mastodon_Rest: invalid public timeline binding target')

		return [[origins[0].origin, binding] as const]
	})
)

if (
	mastodonInstanceBindingByOrigin.size === 0
	|| mastodonPublicTimelineBindingByOrigin.size === 0
)
	throw new Error('Mastodon_Rest: instance or public timeline bindings are missing')

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
	const binding = mastodonInstanceBindingByOrigin.get(instanceOrigin)
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
	const binding = mastodonInstanceBindingByOrigin.get(instanceOrigin)
	if (binding == null)
		throw new Error(`Mastodon_Rest: instance binding is missing for ${instanceOrigin}`)

	return sourceFetch(
		binding,
		`${instanceOrigin}/api/${apiVersion}${path}${qs(search ?? {})}`
	)
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
