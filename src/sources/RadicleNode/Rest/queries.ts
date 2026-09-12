/**
 * Radicle HTTP JSON reads against the configured control URL.
 *
 * @see https://radicle.dev/guides/seeder/
 * @see https://seed.radicle.xyz/api/v1
 */
import {
	resolveEnvLocator,
	type SourcePublicEnv,
} from '$/sources/$sources.ts'
import { getJson } from '$/sources/_shared/wire/HttpRest/client.ts'
import bindings from '$/sources/RadicleNode/bindings.ts'
import {
	radicleNodeEnvelope,
	radicleReposEnvelope,
	radicleStatsEnvelope,
	type RadicleNodeConnectPeer,
	type RadicleNodeWire,
	type RadicleRepoWire,
	type RadicleStatsWire,
} from '$/sources/RadicleNode/Rest/types.ts'
import { Source } from '$/sources/Source.ts'
import type { SourceBinding } from '$/sources/SourceBinding.ts'

const sourceLabel = 'RadicleNode_Control'
const apiPath = '/api/v1'
const binding = bindings[Source.RadicleNode_Control][0]

export const localNodeBindingKey = binding.target.key

export const resolvedControlUrl = (
	publicEnv: SourcePublicEnv
) => {
	const url = new URL(
		resolveEnvLocator(binding.endpoints[0].locator, publicEnv)
	)
	if (
		(url.protocol !== 'http:' && url.protocol !== 'https:')
		|| url.username !== ''
		|| url.password !== ''
	)
		throw new Error(`${sourceLabel}: control URL must be an unauthenticated HTTP URL`)

	return url.toString().replace(/\/$/, '')
}

const configuredBinding = (
	publicEnv: SourcePublicEnv
) => (
	{
		...binding,
		endpoints: [{
			...binding.endpoints[0],
			locator: resolvedControlUrl(publicEnv),
		}],
	} satisfies SourceBinding
)

const assertEnvelope = <_Value>(
	envelope: {
		assert: (value: unknown) => _Value
	},
	value: unknown,
	label: string
): _Value => {
	try {
		return envelope.assert(value)
	} catch {
		throw new Error(`${sourceLabel}: invalid ${label} response envelope`)
	}
}

export const parseConnectPeer = (
	value: string
): RadicleNodeConnectPeer => {
	const separator = value.lastIndexOf('@')
	if (separator <= 0 || separator === value.length - 1)
		throw new Error(`${sourceLabel}: invalid connect peer ${value}`)

	return {
		nodeId: value.slice(0, separator),
		address: value.slice(separator + 1),
	}
}

export const getNode = async (
	publicEnv: SourcePublicEnv
): Promise<RadicleNodeWire> => (
	assertEnvelope(
		radicleNodeEnvelope,
		await getJson<unknown>(configuredBinding(publicEnv), `${apiPath}/node`),
		'node'
	)
)

export const getStats = async (
	publicEnv: SourcePublicEnv
): Promise<RadicleStatsWire> => (
	assertEnvelope(
		radicleStatsEnvelope,
		await getJson<unknown>(configuredBinding(publicEnv), `${apiPath}/stats`),
		'stats'
	)
)

export const listRepos = async (
	publicEnv: SourcePublicEnv
): Promise<RadicleRepoWire[]> => (
	assertEnvelope(
		radicleReposEnvelope,
		await getJson<unknown>(configuredBinding(publicEnv), `${apiPath}/repos`),
		'repos'
	)
)
