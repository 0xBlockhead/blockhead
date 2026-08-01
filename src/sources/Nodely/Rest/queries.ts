import { getJson } from '$/sources/_shared/wire/HttpRest/client.ts'
import bindings from '$/sources/Nodely/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { ApiFamily } from '$/sources/SourceBinding.ts'
import type { JsonValue } from '$/typescript/JsonValue.ts'

const bindingByApiFamily = Object.fromEntries(
	bindings[Source.Nodely].map((binding) => [
		binding.apiFamily,
		binding,
	])
)

export const getAlgodStatus = () => (
	getJson<JsonValue>(bindingByApiFamily[ApiFamily.AlgodRestApi], '/v2/status')
)

export const getIndexerHealth = () => (
	getJson<JsonValue>(bindingByApiFamily[ApiFamily.AlgorandIndexerRestApi], '/health')
)
