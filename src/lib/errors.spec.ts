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
	it('serializes Error values with their message', () => {
		expect(serializeError(new Error('failed'))).toContain('Error: failed')
	})

	it('serializes arbitrary thrown values without local message-shape parsing', () => {
		expect(serializeError({
			message: 'wire failure',
			code: 500,
		})).toBe('{\n  "message": "wire failure",\n  "code": 500\n}')
	})

	it('normalizes non-Error thrown values while preserving cause', () => {
		const cause = {
			message: 'wire failure',
		}
		const error = normalizeBoundaryError(cause)

		expect(error.message).toBe('{\n  "message": "wire failure"\n}')
		expect(error.cause).toBe(cause)
	})
})
