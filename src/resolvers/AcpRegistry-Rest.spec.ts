import { beforeEach, describe, expect, it, vi } from 'vitest'

import { EntityMetaKey } from '$/schema/$schema.ts'
import { loadResolvers } from '$/resolvers/index.ts'
import { Source } from '$/sources/Source.ts'

const fetchRegistry = vi.hoisted(() => vi.fn())

vi.mock('$/sources/Acp/Rest/queries.ts', () => ({
	fetchRegistry,
}))

const resolverContext = {
	filters: [],
	sorts: [],
	pagination: {},
	selectorKeys: [],
	parentSelectorKeys: [],
	publicEnv: {},
}

describe('ACP registry resolver', () => {
	beforeEach(() => {
		fetchRegistry.mockReset()
		fetchRegistry.mockResolvedValue({
			version: '1',
			agents: [{
				id: 'acme-agent',
				name: 'Acme agent',
				version: '2.0.0',
				description: 'An ACP agent',
				distribution: {
					binary: {
						'darwin-arm64': {
							archive: 'https://example.test/acme-agent.tar.gz',
							cmd: 'acme-agent',
							args: ['serve'],
							env: {
								ACME_TOKEN: 'required',
							},
						},
					},
				},
			}],
		})
	})

	it('maps the exact registry program version and unambiguous binary metadata', async () => {
		const { default: acpRegistry } = await import('$/resolvers/AcpRegistry-Rest.ts')
		const resolver = acpRegistry.resolvers[0]
		const agent = await resolver.resolve['ProgramVersion'].resolve({
			$program: {
				registryAgentId: 'acme-agent',
			},
			version: '2.0.0',
		}, resolverContext)

		expect(resolver.projections.$program(agent, {
			$program: {
				registryAgentId: 'acme-agent',
			},
			version: '2.0.0',
		}, resolverContext)).toEqual({
			[EntityMetaKey.Selector]: {
				registryAgentId: 'acme-agent',
			},
		})
		expect(resolver.projections.version(agent)).toBe('2.0.0')
		expect(resolver.projections.distributionKind(agent)).toBe('binary')
		expect(resolver.projections.command(agent)).toBe('acme-agent')
		expect(resolver.projections.arguments(agent)).toEqual(['serve'])
		expect(resolver.projections.environmentKeys(agent)).toEqual(['ACME_TOKEN'])
		expect(fetchRegistry).toHaveBeenCalledWith()
	})

	it('does not collapse multiple distribution variants into a fabricated command', async () => {
		fetchRegistry.mockResolvedValueOnce({
			version: '1',
			agents: [{
				id: 'acme-agent',
				name: 'Acme agent',
				version: '2.0.0',
				description: 'An ACP agent',
				distribution: {
					npx: {
						package: '@acme/agent',
					},
					uvx: {
						package: 'acme-agent',
					},
				},
			}],
		})
		const { default: acpRegistry } = await import('$/resolvers/AcpRegistry-Rest.ts')
		const resolver = acpRegistry.resolvers[0]
		const agent = await resolver.resolve['ProgramVersion'].resolve({
			$program: {
				registryAgentId: 'acme-agent',
			},
			version: '2.0.0',
		}, resolverContext)

		expect(resolver.projections.distributionKind(agent)).toBeUndefined()
		expect(resolver.projections.command(agent)).toBeUndefined()
		expect(resolver.projections.arguments(agent)).toBeUndefined()
		expect(resolver.projections.environmentKeys(agent)).toBeUndefined()
	})

	it('preserves explicit package-runner arguments without inventing a command', async () => {
		fetchRegistry.mockResolvedValueOnce({
			version: '1',
			agents: [{
				id: 'acme-agent',
				name: 'Acme agent',
				version: '2.0.0',
				description: 'An ACP agent',
				distribution: {
					npx: {
						package: '@acme/agent',
						args: ['--stdio'],
					},
				},
			}],
		})
		const { default: acpRegistry } = await import('$/resolvers/AcpRegistry-Rest.ts')
		const resolver = acpRegistry.resolvers[0]
		const agent = await resolver.resolve['ProgramVersion'].resolve({
			$program: {
				registryAgentId: 'acme-agent',
			},
			version: '2.0.0',
		}, resolverContext)

		expect(resolver.projections.distributionKind(agent)).toBe('npx')
		expect(resolver.projections.command(agent)).toBeUndefined()
		expect(resolver.projections.arguments(agent)).toEqual(['--stdio'])
	})

	it('rejects non-registry program selectors before loading the registry', async () => {
		const { default: acpRegistry } = await import('$/resolvers/AcpRegistry-Rest.ts')
		const resolver = acpRegistry.resolvers[0]

		await expect(resolver.resolve['ProgramVersion'].resolve({
			$program: {
				packageName: '@acme/agent',
			},
			version: '2.0.0',
		}, resolverContext)).rejects.toThrow('program selector must identify a registry agent')
		expect(fetchRegistry).not.toHaveBeenCalled()
	})

	it('registers the ACP registry source lazily', async () => {
		await expect(loadResolvers(new Set([
			Source.AcpRegistry_Rest,
		]))).resolves.toMatchObject([{
			source: Source.AcpRegistry_Rest,
		}])
	})
})
