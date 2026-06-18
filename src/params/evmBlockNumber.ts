import { matchSchemaBigIntParam } from '$/schema/$params.ts'
import { EntityType } from '$/schema/EntityType.ts'


export const match = (param: string): param is string => (
	matchSchemaBigIntParam(
		EntityType.EvmBlock,
		'blockNumber',
		param
	)
)
