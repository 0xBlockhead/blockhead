import { stringify } from '$/lib/json.ts'

export const serializeError = (error: unknown) => (
	error instanceof Error ?
		error.stack ?? `${error.name}: ${error.message}`
	: error ?
		stringify(error, null, 2)
	:
		String(error)
)
