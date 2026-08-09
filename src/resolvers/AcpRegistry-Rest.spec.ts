import {
	beforeEach,
	describe,
	expect,
	it,
	vi,
} from 'vitest'

import { EntityMetaKey, entityFieldAddressKey } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
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

const binaryAgent = {
	id: 'acme-agent',
	name: 'Acme agent',
	version: '2.0.0',
	description: 'An ACP agent',
	repository: 'https://github.com/acme/agent',
	authors: [
		'Acme',
	],
	license: 'MIT',
	distribution: {
		binary: {
			'darwin-aarch64': {
				archive: 'https://example.test/acme-agent.tar.gz',
				cmd: 'acme-agent',
				args: [
					'serve',
				],
				env: {
					ACME_TOKEN: 'required',
				},
			},
		},
	},
} as const

describe('ACP registry resolver', () => {
	beforeEach(() => {
		fetchRegistry.mockReset()
		fetchRegistry.mockResolvedValue({
			version: '1.0.0',
			agents: [
				binaryAgent,
			],
		})
	})

	it('maps enrolled AcpAgentProgram leftovers from the registry agent', async () => {
		const { default: acpRegistry } = await import('$/resolvers/AcpRegistry-Rest.ts')
		const resolver = acpRegistry.resolvers[0]
		const agent = await resolver.resolve.RegistryAgentId.resolve({
			registryAgentId: 'acme-agent',
		}, resolverContext)

		expect(resolver.projections.registryAgentId(agent)).toBe('acme-agent')
		expect(resolver.projections.label(agent)).toBe('Acme agent')
		expect(resolver.projections.authors(agent)).toEqual([
			'Acme',
		])
		expect(resolver.projections.repositoryUrl(agent)).toBe('https://github.com/acme/agent')
		expect(resolver.projections.packageName(agent)).toBeUndefined()
		expect(fetchRegistry).toHaveBeenCalledWith()
	})

	it('resolves PackageName when a single package runner is present', async () => {
		fetchRegistry.mockResolvedValueOnce({
			version: '1.0.0',
			agents: [{
				...binaryAgent,
				distribution: {
					npx: {
						package: '@acme/agent@2.0.0',
						args: [
							'--stdio',
						],
						env: {
							ACME_TOKEN: 'required',
						},
					},
				},
			}],
		})
		const { default: acpRegistry } = await import('$/resolvers/AcpRegistry-Rest.ts')
		const resolver = acpRegistry.resolvers[0]
		const agent = await resolver.resolve.PackageName.resolve({
			packageName: '@acme/agent@2.0.0',
		}, resolverContext)

		expect(resolver.projections.packageName(agent)).toBe('@acme/agent@2.0.0')
		expect(resolver.projections.label(agent)).toBe('Acme agent')
	})

	it('maps the exact registry program version and unambiguous binary metadata', async () => {
		const { default: acpRegistry } = await import('$/resolvers/AcpRegistry-Rest.ts')
		const resolver = acpRegistry.resolvers[1]
		const agent = await resolver.resolve.ProgramVersion.resolve({
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
		}, resolverContext)).toMatchObject({
			[EntityMetaKey.Selector]: {
				registryAgentId: 'acme-agent',
			},
			[EntityMetaKey.Fields]: {
				[entityFieldAddressKey(EntityType.AcpAgentProgram, [], 'label')]:
					'Acme agent',
				[entityFieldAddressKey(EntityType.AcpAgentProgram, [], 'repositoryUrl')]:
					'https://github.com/acme/agent',
			},
		})
		expect(resolver.projections.version(agent)).toBe('2.0.0')
		expect(resolver.projections.distributionKind(agent)).toBe('binary')
		expect(resolver.projections.command(agent)).toBe('acme-agent')
		expect(resolver.projections.arguments(agent)).toEqual([
			'serve',
		])
		expect(resolver.projections.environmentKeys(agent)).toEqual([
			'ACME_TOKEN',
		])
		expect(fetchRegistry).toHaveBeenCalledWith()
	})

	it('does not collapse multiple distribution variants into a fabricated command', async () => {
		fetchRegistry.mockResolvedValueOnce({
			version: '1.0.0',
			agents: [{
				...binaryAgent,
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
		const resolver = acpRegistry.resolvers[1]
		const agent = await resolver.resolve.ProgramVersion.resolve({
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

	it('preserves explicit package-runner arguments and environment keys without inventing a command', async () => {
		fetchRegistry.mockResolvedValueOnce({
			version: '1.0.0',
			agents: [{
				...binaryAgent,
				distribution: {
					npx: {
						package: '@acme/agent',
						args: [
							'--stdio',
						],
						env: {
							ACME_TOKEN: 'required',
						},
					},
				},
			}],
		})
		const { default: acpRegistry } = await import('$/resolvers/AcpRegistry-Rest.ts')
		const resolver = acpRegistry.resolvers[1]
		const agent = await resolver.resolve.ProgramVersion.resolve({
			$program: {
				registryAgentId: 'acme-agent',
			},
			version: '2.0.0',
		}, resolverContext)

		expect(resolver.projections.distributionKind(agent)).toBe('npx')
		expect(resolver.projections.command(agent)).toBeUndefined()
		expect(resolver.projections.arguments(agent)).toEqual([
			'--stdio',
		])
		expect(resolver.projections.environmentKeys(agent)).toEqual([
			'ACME_TOKEN',
		])
	})

	it('rejects non-registry program selectors before loading the registry', async () => {
		const { default: acpRegistry } = await import('$/resolvers/AcpRegistry-Rest.ts')
		const resolver = acpRegistry.resolvers[1]

		await expect(resolver.resolve.ProgramVersion.resolve({
			$program: {
				packageName: '@acme/agent',
			},
			version: '2.0.0',
		}, resolverContext)).rejects.toThrow('program selector must identify a registry agent')
		expect(fetchRegistry).not.toHaveBeenCalled()
	})

	it('projects hub $$acpPrograms and tip observation leftovers', async () => {
		const { default: acpRegistry } = await import('$/resolvers/AcpRegistry-Rest.ts')
		const resolver = acpRegistry.resolvers[2]
		const snapshot = await resolver.resolve.NetworkId.resolve({
			networkId: 'acp',
		}, resolverContext)

		expect(resolver.projections.$$acpPrograms.resolveCount(snapshot)).toBe(1)
		expect(resolver.projections.$$acpPrograms.select(snapshot)).toEqual([
			expect.objectContaining({
				[EntityMetaKey.Selector]: {
					registryAgentId: 'acme-agent',
				},
			}),
		])
		expect(resolver.projections.$$timestamps(snapshot)).toEqual([
			expect.objectContaining({
				[EntityMetaKey.Selector]: expect.objectContaining({
					$network: {
						networkId: 'acp',
					},
					source: Source.AcpRegistry_Rest,
				}),
				[EntityMetaKey.Fields]: expect.objectContaining({
					[entityFieldAddressKey(EntityType._GlobalAgentNetwork_Timestamp, [], 'sourceReportedAgentCount')]:
						1,
					[entityFieldAddressKey(EntityType._GlobalAgentNetwork_Timestamp, [], 'seededAgentCount')]:
						1,
					[entityFieldAddressKey(EntityType._GlobalAgentNetwork_Timestamp, [], 'reachableEndpointCount')]:
						1,
					[entityFieldAddressKey(EntityType._GlobalAgentNetwork_Timestamp, [], 'status')]:
						'ok',
				}),
			}),
		])
	})

	it('reuses hub tip fields on NetworkTimestampMsSource', async () => {
		const { default: acpRegistry } = await import('$/resolvers/AcpRegistry-Rest.ts')
		const resolver = acpRegistry.resolvers[3]
		const observation = await resolver.resolve.NetworkTimestampMsSource.resolve({
			$network: {
				networkId: 'acp',
			},
			timestampMs: 1_700_000_000_000,
			source: Source.AcpRegistry_Rest,
		}, resolverContext)

		expect(resolver.projections.sourceReportedAgentCount(observation)).toBe(1)
		expect(resolver.projections.seededAgentCount(observation)).toBe(1)
		expect(resolver.projections.status(observation)).toBe('ok')
	})

	it('registers the ACP registry source lazily', async () => {
		await expect(loadResolvers(new Set([
			Source.AcpRegistry_Rest,
		]))).resolves.toMatchObject([{
			source: Source.AcpRegistry_Rest,
		}])
	})
})
