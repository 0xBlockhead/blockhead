import {
	matchDecimalNonNegativeIntegerParam,
	matchSchemaPrimitiveParam,
} from '$/schema/$params.ts'
import { EntityType } from '$/schema/EntityType.ts'


export const match = (param: string): param is string => (
	matchDecimalNonNegativeIntegerParam(param)
	&& matchSchemaPrimitiveParam(
		EntityType.Network,
		'caip2',
		{
			namespace: 'eip155',
			reference: String(Number(param)),
		}
	)
)
