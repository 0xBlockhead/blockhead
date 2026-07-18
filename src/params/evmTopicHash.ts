import { matchSchemaPrimitiveParam } from '$/schema/$params.ts'
import { EntityType } from '$/schema/EntityType.ts'


export const match = (param: string): param is string => (
	matchSchemaPrimitiveParam(
		EntityType.EvmTopic,
		'hex',
		param
	)
)
