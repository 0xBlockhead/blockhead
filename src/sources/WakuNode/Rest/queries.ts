import bindings from '$/sources/WakuNode/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { getJson, getText } from '$/sources/_shared/wire/HttpRest/client.ts'

const binding = bindings[Source.WakuNode]

export const getDebugInfo = () => (
	getJson<{
		listenAddresses: string[]
		enrUri?: string
	}>(binding, '/debug/v1/info')
)

export const getHealth = () => (
	getText(binding, '/health')
)
