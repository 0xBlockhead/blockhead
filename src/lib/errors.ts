import { stringify } from '$/lib/json.ts'

export const serializeError = (error: unknown) => (
	error instanceof Error ?
		error.stack ?? `${error.name}: ${error.message}`
	:
		error ?
			stringify(error, null, 2)
		:
			String(error)
)

export const errorDisplayMessage = (error: unknown) => (
	error instanceof Error ?
		error.message
	: Object.getOwnPropertyDescriptor(Object(error), 'message')?.value != null ?
		String(Object.getOwnPropertyDescriptor(Object(error), 'message')?.value)
	:
		'Error'
)


/** Coerce TanStack / persistence / wire failures into `Error` while preserving the original value as `cause`. */
export const normalizeBoundaryError = (cause: unknown): Error => (
	cause instanceof Error ?
		cause
	:
		new Error(errorDisplayMessage(cause), { cause })
)
