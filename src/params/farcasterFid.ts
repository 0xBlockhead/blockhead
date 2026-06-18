import { matchSchemaNumberParam } from '$/schema/$params.ts'
import { EntityType } from '$/schema/EntityType.ts'


export const match = (param: string): param is string => (
	matchSchemaNumberParam(
		EntityType.FarcasterUser,
		'fid',
		param
	)
)
