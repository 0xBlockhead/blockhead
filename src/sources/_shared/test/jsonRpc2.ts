import { expect } from 'vitest'

export const resetJsonRpc2Mock = (jsonRpc2: { mockReset: () => unknown }) => {
	jsonRpc2.mockReset()
}

export const expectJsonRpc2Call = (
	jsonRpc2: unknown,
	binding: unknown,
	method: string,
	params: unknown[]
) => {
	expect(jsonRpc2).toHaveBeenCalledWith(binding, method, params)
}
