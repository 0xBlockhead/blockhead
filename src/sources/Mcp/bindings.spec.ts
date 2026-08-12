import {
	describe,
	expect,
	it,
} from 'vitest'

import mcpBindings from '$/sources/Mcp/bindings.ts'
import { Source } from '$/sources/Source.ts'
import {
	ApiFamily,
	SourceDelivery,
	SourceEndpointKind,
	WireProtocol,
} from '$/sources/SourceBinding.ts'
import { sourceBindings } from '$/sources/$sourceProviders.ts'


describe('Mcp source bindings', () => {
	it('models declared MCP stdio over JsonRpc2/McpProtocol from APP', () => {
		expect(mcpBindings[Source.McpDeclared_Protocol]).toEqual([
			expect.objectContaining({
				source: Source.McpDeclared_Protocol,
				wireProtocol: WireProtocol.JsonRpc2,
				apiFamily: ApiFamily.McpProtocol,
				endpoints: [
					{
						endpointKind: SourceEndpointKind.LocalProcess,
						locator: 'mcp',
					},
				],
				delivery: SourceDelivery.LocalOnly,
			}),
		])
	})

	it('keeps the package registry on HttpRest/RestJson', () => {
		expect(mcpBindings[Source.McpPackageRegistry_Rest]).toEqual([
			expect.objectContaining({
				source: Source.McpPackageRegistry_Rest,
				wireProtocol: WireProtocol.HttpRest,
				apiFamily: ApiFamily.RestJson,
				endpoints: [
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'https://registry.modelcontextprotocol.io/v0.1/servers/',
						corsEnabled: false,
					},
				],
				delivery: SourceDelivery.RemoteQuery,
			}),
		])
	})

	it('accepts only JsonRpc2/McpProtocol local and HttpRest/RestJson among MCP provider bindings', () => {
		expect(
			Object.values(mcpBindings)
				.flat()
				.map((binding) => `${binding.wireProtocol}/${binding.apiFamily}/${binding.delivery}`)
				.sort()
		).toEqual([
			`${WireProtocol.HttpRest}/${ApiFamily.RestJson}/${SourceDelivery.RemoteQuery}`,
			`${WireProtocol.JsonRpc2}/${ApiFamily.McpProtocol}/${SourceDelivery.LocalOnly}`,
		])
	})

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
