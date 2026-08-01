import type { JsonValue } from '$/typescript/JsonValue.ts'
import { getJson } from '$/sources/_shared/wire/HttpRest/client.ts'
import { chainServiceInfo } from '$/sources/LogosBlockchainNode/Rest/types.ts'
import bindings from '$/sources/LogosBlockchainNode/bindings.ts'
import { Source } from '$/sources/Source.ts'

export const getCryptarchiaInfo = async () => (
	chainServiceInfo.assert(
		await getJson<JsonValue>(
			bindings[Source.LogosBlockchainNode_Rest],
			'/cryptarchia/info'
		)
	)
)
