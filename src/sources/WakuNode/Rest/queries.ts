import { getJson, getText } from '$/sources/_shared/wire/HttpRest/client.ts'
import type { SourceBinding } from '$/sources/SourceBinding.ts'
import { type } from 'arktype'

const debugInfoWire = type({
	listenAddresses: 'string[] > 0',
	'enrUri?': 'string > 0',
})

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
