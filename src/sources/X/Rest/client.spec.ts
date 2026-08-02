import { beforeEach, expect, it, vi } from 'vitest'

import {
	ApiFamily,
	SourceCredentialScope,
	SourceDelivery,
	SourceEndpointKind,
	SourceOperationGroup,
	SourceTargetKind,
	WireProtocol,
} from '$/sources/SourceBinding.ts'
import { Source } from '$/sources/Source.ts'
import bindings from '$/sources/X/bindings.ts'

const xBinding = bindings[Source.X_Rest][0]

const sourceFetch = vi.hoisted(() => vi.fn())

vi.mock('$/sources/_runtime/http.ts', () => ({
	firstHttpUrlForBinding: (binding: typeof xBinding) => binding.endpoints[0].locator,
	sourceFetch,
}))

const {
	listUserTweets,
	searchRecentTweets,
} = await import('$/sources/X/Rest/queries.ts')

beforeEach(() => {
	sourceFetch.mockReset()
	sourceFetch.mockResolvedValue({
		ok: true,
		json: () => Promise.resolve({ data: [] }),
	})
})

it('uses the proxied X origin with the configured bearer', async () => {
	await listUserTweets({
		PUBLIC_X_API_BEARER: 'bearer',
	}, 'user/with reserved', 25)

	expect(sourceFetch).toHaveBeenCalledTimes(1)
	expect(sourceFetch.mock.calls[0][0]).toMatchObject({
		source: Source.X_Rest,
		target: {
			kind: SourceTargetKind.Global,
			key: 'api-v2',
		},
		endpoints: [{
			endpointKind: SourceEndpointKind.HttpUrl,
			locator: 'https://api.x.com',
			corsEnabled: false,
		}],
		wireProtocol: WireProtocol.HttpRest,
		apiFamily: ApiFamily.RestJson,
		operationGroups: [SourceOperationGroup.GenericRead],
		delivery: SourceDelivery.HttpProxy,
		credentials: [{
			scope: SourceCredentialScope.PublicConfig,
		}],
	})
	expect(xBinding.credentials[0].env.props.map(({ key }) => String(key)))
		.toEqual(['PUBLIC_X_API_BEARER'])
	expect(sourceFetch.mock.calls[0][1]).toContain(
		'https://api.x.com/2/users/user%2Fwith%20reserved/tweets?'
	)
	expect(sourceFetch.mock.calls[0][2].headers.Authorization).toBe('Bearer bearer')
	expect(new URL(sourceFetch.mock.calls[0][1]).searchParams.get('max_results')).toBe('25')
	expect(new URL(sourceFetch.mock.calls[0][1]).searchParams.get('expansions'))
		.toContain('referenced_tweets.id.author_id')
})

it('clamps bounded windows and fails closed without provider authentication', async () => {
	await searchRecentTweets({
		PUBLIC_X_API_BEARER: 'bearer',
	}, 500)
	expect(new URL(sourceFetch.mock.calls[0][1]).searchParams.get('max_results')).toBe('100')

	await expect(searchRecentTweets({}, 10)).rejects.toThrow(
		'Missing or empty required env: PUBLIC_X_API_BEARER'
	)
})

it('preserves opaque user-timeline continuation tokens', async () => {
	await listUserTweets({
		PUBLIC_X_API_BEARER: 'bearer',
	}, 'user', 25, 'opaque/+ %=token')

	expect(new URL(sourceFetch.mock.calls[0][1]).searchParams.get('pagination_token'))
		.toBe('opaque/+ %=token')
})
