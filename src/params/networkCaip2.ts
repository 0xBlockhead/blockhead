import { caip2ParamValueFromString } from '$/lib/caip2.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { matchSchemaPrimitiveParam } from '$/schema/$params.ts'


export const match = (param: string): param is `${string}:${string}` => {
	const caip2 = caip2ParamValueFromString(param)
	if (caip2 === undefined)
		return false

	return matchSchemaPrimitiveParam(
		EntityType.Network,
		'caip2',
		caip2
	)
}
