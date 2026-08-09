import { getJson, getText } from '$/sources/_shared/wire/HttpRest/client.ts'
import type { SourceBinding } from '$/sources/SourceBinding.ts'

export const getDebugInfo = async (binding: SourceBinding) => {
	const debugInfo = await getJson<{
		listenAddresses: string[]
		enrUri?: string
	}>(binding, '/debug/v1/info')
	if (
		debugInfo == null
		|| debugInfo.listenAddresses == null
		|| debugInfo.listenAddresses.length === 0
	)
		throw new Error('WakuNode_Rest: debug info missing listen addresses')

	return debugInfo
}

export const getHealth = async (binding: SourceBinding) => {
	const health = await getText(binding, '/health')
	if (health.trim() === '')
		throw new Error('WakuNode_Rest: health response is empty')

	return health
}
