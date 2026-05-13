import { stringify } from '$/lib/json.ts'

export const serializeError = (error: unknown) => (
	error instanceof Error ?
		error.stack ?? `${error.name}: ${error.message}`
	: error ?
		stringify(error, null, 2)
	:
		String(error)
)


const boundaryFailureLine = (error: unknown): string => (
	error instanceof Error ?
		error.message
	: (
		error != null
		&& typeof error === 'object'
		&& 'message' in error
		&& typeof (error as { message: unknown }).message === 'string'
	) ?
		(error as { message: string }).message
	:
		serializeError(error)
)


/** Coerce TanStack / persistence / wire failures into `Error` while preserving the original value as `cause`. */
export const normalizeBoundaryError = (cause: unknown): Error => (
	cause instanceof Error ?
		cause
	: new Error(boundaryFailureLine(cause), { cause })
)
