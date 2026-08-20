import {
	describe,
	expect,
	it,
} from 'vitest'

import {
	normalizeBoundaryError,
	serializeError,
} from '$/lib/errors.ts'

describe('error helpers', () => {
	it('serializes and normalizes representative thrown values', () => {
		expect(serializeError(new Error('failed'))).toContain('Error: failed')

		expect(serializeError({
			message: 'wire failure',
			code: 500,
		})).toBe('{\n  "message": "wire failure",\n  "code": 500\n}')

		const cause = {
			message: 'wire failure',
		}
		const error = normalizeBoundaryError(cause)

		expect(error.message).toBe('wire failure')
		expect(error.cause).toBe(cause)
	})
})
