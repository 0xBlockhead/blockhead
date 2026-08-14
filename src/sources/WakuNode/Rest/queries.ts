import { getJson, getText } from '$/sources/_shared/wire/HttpRest/client.ts'
import type { SourceBinding } from '$/sources/SourceBinding.ts'
import { type } from 'arktype'

const debugInfoWire = type({
	listenAddresses: 'string[] > 0',
	'enrUri?': 'string > 0',
})

const peerWire = type({
	connectedness: 'string',
})

const peersWire = peerWire.array()

export const getDebugInfo = async (binding: SourceBinding) => {
	try {
		return debugInfoWire.assert(await getJson<unknown>(binding, '/debug/v1/info'))
	} catch {
		throw new Error('WakuNode_Rest: invalid debug info response envelope')
	}
}

export const getHealth = async (binding: SourceBinding) => {
	const health = await getText(binding, '/health')
	if (health.trim() === '')
		throw new Error('WakuNode_Rest: health response is empty')

	return health
}

export const getConnectedPeerCount = async (binding: SourceBinding) => {
	try {
		return peersWire.assert(await getJson<unknown>(binding, '/admin/v1/peers'))
			.filter((peer) => peer.connectedness === 'Connected')
			.length
	} catch {
		throw new Error('WakuNode_Rest: invalid peer response envelope')
	}
}

export const getVersion = async (binding: SourceBinding) => {
	const version = await getText(binding, '/debug/v1/version')
	if (version.trim() === '')
		throw new Error('WakuNode_Rest: version response is empty')

	return version.trim()
}
