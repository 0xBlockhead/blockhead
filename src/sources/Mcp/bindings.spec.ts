import {
	describe,
	expect,
	it,
} from 'vitest'

import {
	ApiFamily,
	SourceDelivery,
	WireProtocol,
} from '$/sources/SourceBinding.ts'
import { sourceBindings } from '$/sources/$sourceProviders.ts'


describe('Mcp source bindings', () => {
	it('rejects collapsing McpProtocol onto HttpRest or non-local JsonRpc2 anywhere in the registry', () => {
		expect(
			sourceBindings.some((binding) => (
				binding.wireProtocol === WireProtocol.HttpRest
				&& binding.apiFamily === ApiFamily.McpProtocol
			))
		).toBe(false)

		expect(
			sourceBindings.some((binding) => (
				binding.wireProtocol === WireProtocol.JsonRpc2
				&& binding.apiFamily === ApiFamily.McpProtocol
				&& binding.delivery !== SourceDelivery.LocalOnly
			))
		).toBe(false)
	})
})
