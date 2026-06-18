import { caip2ParamValueFromString } from '$/lib/caip2.ts'
import {
	matchDecimalNonNegativeIntegerParam,
	matchSchemaPrimitiveParam,
} from '$/schema/$params.ts'
import { EntityType } from '$/schema/EntityType.ts'


export const match = (param: string): param is `eip155:${string}` => {
	const caip2 = caip2ParamValueFromString(param)
	return (
		caip2 !== undefined
		&& caip2.namespace === 'eip155'
		&& matchDecimalNonNegativeIntegerParam(caip2.reference)
		&& matchSchemaPrimitiveParam(
			EntityType.Network,
			'caip2',
			caip2
		)
	)
}
