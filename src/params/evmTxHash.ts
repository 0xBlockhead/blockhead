import { matchSchemaPrimitiveParam } from '$/schema/$params.ts'
import { EntityType } from '$/schema/EntityType.ts'


export const match = (param: string): param is `0x${string}` => (
	matchSchemaPrimitiveParam(
		EntityType.EvmTransaction,
		'txHash',
		param
	)
)
