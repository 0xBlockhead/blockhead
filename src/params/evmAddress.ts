import { matchSchemaPrimitiveParam } from '$/schema/$params.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { with0xHex } from '$/lib/hexLowerOfByteSize.ts'


export const match = (param: string): param is string => (
	matchSchemaPrimitiveParam(
		EntityType.EvmContract,
		'address',
		with0xHex(param)
	)
)
