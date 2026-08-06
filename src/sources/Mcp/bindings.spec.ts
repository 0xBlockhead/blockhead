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
	it('models declared MCP stdio and Streamable HTTP over WireProtocol.Mcp', () => {
		expect(WireProtocol.Mcp).toBe('Mcp')
		expect(mcpBindings[Source.McpDeclared_Protocol]).toEqual([
			expect.objectContaining({
				source: Source.McpDeclared_Protocol,
				wireProtocol: WireProtocol.Mcp,
				apiFamily: ApiFamily.McpProtocol,
				endpoints: [
					{
						endpointKind: SourceEndpointKind.LocalProcess,
						locator: 'mcp',
					},
				],
				delivery: SourceDelivery.LocalOnly,
			}),
			expect.objectContaining({
				source: Source.McpDeclared_Protocol,
				wireProtocol: WireProtocol.Mcp,
				apiFamily: ApiFamily.McpProtocol,
				endpoints: [
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'https://{mcp-host}',
						corsEnabled: false,
					},
				],
				delivery: SourceDelivery.RemoteQuery,
			}),
		])
	})

	it('keeps the package registry on HttpRest/RestJson, not WireProtocol.Mcp', () => {
		expect(mcpBindings[Source.McpPackageRegistry_Rest]).toEqual([
			expect.objectContaining({
				source: Source.McpPackageRegistry_Rest,
				wireProtocol: WireProtocol.HttpRest,
				apiFamily: ApiFamily.RestJson,
				endpoints: [
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'https://registry.modelcontextprotocol.io/v0.1/servers',
						corsEnabled: false,
					},
				],
				delivery: SourceDelivery.RemoteQuery,
			}),
		])
	})

	it('accepts only Mcp/McpProtocol and HttpRest/RestJson among MCP provider bindings', () => {
		expect(
			Object.values(mcpBindings)
				.flat()
				.map((binding) => `${binding.wireProtocol}/${binding.apiFamily}/${binding.delivery}`)
				.sort()
		).toEqual([
			`${WireProtocol.HttpRest}/${ApiFamily.RestJson}/${SourceDelivery.RemoteQuery}`,
			`${WireProtocol.Mcp}/${ApiFamily.McpProtocol}/${SourceDelivery.LocalOnly}`,
			`${WireProtocol.Mcp}/${ApiFamily.McpProtocol}/${SourceDelivery.RemoteQuery}`,
		])
	})

	it('rejects collapsing McpProtocol onto JsonRpc2 or HttpRest anywhere in the registry', () => {
		const invalidPairs = [
			[WireProtocol.JsonRpc2, ApiFamily.McpProtocol],
			[WireProtocol.HttpRest, ApiFamily.McpProtocol],
			[WireProtocol.Mcp, ApiFamily.RestJson],
			[WireProtocol.Mcp, ApiFamily.JsonRpcApi],
			[WireProtocol.Mcp, ApiFamily.AcpProtocol],
		] as const

		for (const [wireProtocol, apiFamily] of invalidPairs) {
			expect(
				sourceBindings.some((binding) => (
					binding.wireProtocol === wireProtocol
					&& binding.apiFamily === apiFamily
				)),
				`${wireProtocol}/${apiFamily}`
			).toBe(false)
		}
	})
})
