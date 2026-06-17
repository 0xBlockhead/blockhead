import {
	EntityFieldType,
	entityFieldPrimitiveValueIsValid,
} from '$/schema/$schema.ts'
import Network from '$/schema/Network.ts'


export const match = (param: string): param is `${string}:${string}` => {
	const separatorIndex = param.indexOf(':')
	return (
		separatorIndex > 0
		&& separatorIndex < param.length - 1
		&& ((field) => (
			field?.type === EntityFieldType.Primitive
			&& entityFieldPrimitiveValueIsValid(field, {
				namespace: param.slice(0, separatorIndex),
				reference: param.slice(separatorIndex + 1),
			})
		))(Network.fields.find((field) => field.name === 'caip2'))
	)
}
