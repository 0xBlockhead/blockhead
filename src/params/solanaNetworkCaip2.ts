import { caip2ParamValueFromString } from '$/lib/caip2.ts'
import { matchSchemaPrimitiveParam } from '$/schema/$params.ts'
import { EntityType } from '$/schema/EntityType.ts'


export const match = (param: string): param is `solana:${string}` => {
	const caip2 = caip2ParamValueFromString(param)
	return (
		caip2 !== undefined
		&& caip2.namespace === 'solana'
		&& matchSchemaPrimitiveParam(
			EntityType.SolanaNetwork,
			'caip2',
			caip2
		)
	)
}
