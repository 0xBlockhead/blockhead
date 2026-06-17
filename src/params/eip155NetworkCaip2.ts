import {
	EntityFieldType,
	entityFieldPrimitiveValueIsValid,
} from '$/schema/$schema.ts'
import Network from '$/schema/Network.ts'


export const match = (param: string): param is `eip155:${string}` => {
	const separatorIndex = param.indexOf(':')
	return (
		separatorIndex === 'eip155'.length
		&& param.slice(0, separatorIndex) === 'eip155'
		&& Number.isSafeInteger(Number(param.slice(separatorIndex + 1)))
		&& Number(param.slice(separatorIndex + 1)) >= 0
		&& ((field) => (
			field?.type === EntityFieldType.Primitive
			&& entityFieldPrimitiveValueIsValid(field, {
				namespace: param.slice(0, separatorIndex),
				reference: param.slice(separatorIndex + 1),
			})
		))(Network.fields.find((field) => field.name === 'caip2'))
	)
}
