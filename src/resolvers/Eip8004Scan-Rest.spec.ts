import { beforeEach, describe, expect, it, vi } from 'vitest'

import { EntityMetaKey } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'

const fetchAgentDetail = vi.hoisted(() => vi.fn())
const fetchAgentList = vi.hoisted(() => vi.fn())

vi.mock('$/sources/Eip8004Scan/Rest/queries.ts', () => ({
	fetchAgentDetail,
	fetchAgentList,
}))

const { default: eip8004Scan } = await import('$/resolvers/Eip8004Scan-Rest.ts')

const context = {
	filters: [],
	sorts: [],
	pagination: {},
	selectorKeys: [],
	parentSelectorKeys: [],
	sources: [],
	publicEnv: {},
}

const identityRegistry = '0x1234567890abcdef1234567890abcdef12345678' as const
const registrationFile = {
	$registration: {
		namespace: 'eip155',
		chainId: 1,
		identityRegistry,
		agentId: '42',
	},
	fileUrl: 'https://agents.example/42.json',
} as const

const resolver = (entityType: EntityType) => {
	const definition = eip8004Scan.resolvers.find((candidate) => (
		candidate.entityType === entityType
	))
	if (definition == null)
		throw new Error(`Missing ${entityType} resolver`)
	return definition
}

describe('EIP-8004 Scan registration ownership', () => {
	beforeEach(() => {
		fetchAgentDetail.mockReset()
	})

	it('materializes the exact canonical registration, NFT reference, and file', async () => {
		fetchAgentDetail.mockResolvedValueOnce({
			data: {
				chain_id: 1,
				token_id: '42',
				contract_address: identityRegistry,
				raw_metadata: {
					offchain_uri: 'ipfs://agent',
					offchain_content: {
						type: 'https://eips.ethereum.org/EIPS/eip-8004#registration-v1',
						supportedTrust: ['reputation'],
						active: true,
					},
				},
				supported_trust_models: [],
				services: null,
			},
		})

		await expect(eip8004Scan.resolvers[0].resolve[
			'NamespaceChainIdIdentityRegistryAgentId'
		].resolve({
			namespace: 'eip155',
			chainId: 1,
			identityRegistry,
			agentId: '42',
		}, context)).resolves.toEqual({
			namespace: 'eip155',
			chainId: 1,
			identityRegistry,
			agentId: '42',
			$evmNft: {
				[EntityMetaKey.Selector]: {
					$contract: {
						$network: {
							caip2: {
								namespace: 'eip155',
								reference: '1',
							},
						},
						address: identityRegistry,
					},
					tokenId: '42',
				},
			},
			$$files: [{
				[EntityMetaKey.Selector]: {
					$registration: {
						namespace: 'eip155',
						chainId: 1,
						identityRegistry,
						agentId: '42',
					},
					fileUrl: 'ipfs://agent',
				},
			}],
		})
		expect(fetchAgentDetail).toHaveBeenCalledWith(
			{
				chainId: 1,
				tokenId: '42',
			}
		)
		expect(Object.keys(eip8004Scan.resolvers[0].projections).sort()).toEqual([
			'$$files',
			'$evmNft',
			'agentId',
			'chainId',
			'identityRegistry',
			'namespace',
		])
	})

	it('rejects unsupported namespaces and invalid chain IDs before transport', async () => {
		await expect(eip8004Scan.resolvers[0].resolve[
			'NamespaceChainIdIdentityRegistryAgentId'
		].resolve({
			namespace: 'solana',
			chainId: 1,
			identityRegistry,
			agentId: '42',
		}, context)).rejects.toThrow('unsupported registration namespace')
		await expect(eip8004Scan.resolvers[0].resolve[
			'NamespaceChainIdIdentityRegistryAgentId'
		].resolve({
			namespace: 'eip155',
			chainId: 0,
			identityRegistry,
			agentId: '42',
		}, context)).rejects.toThrow('invalid registration chain ID')
		expect(fetchAgentDetail).not.toHaveBeenCalled()
	})

	it('rejects absent and mismatched provider registrations', async () => {
		fetchAgentDetail.mockResolvedValueOnce({})
		await expect(eip8004Scan.resolvers[0].resolve[
			'NamespaceChainIdIdentityRegistryAgentId'
		].resolve({
			namespace: 'eip155',
			chainId: 1,
			identityRegistry,
			agentId: '42',
		}, context)).rejects.toThrow('agent registration not found')

		for (const mismatchedDetail of [
			{
				chain_id: 10,
				token_id: '42',
				contract_address: identityRegistry,
			},
			{
				chain_id: 1,
				token_id: '43',
				contract_address: identityRegistry,
			},
			{
				chain_id: 1,
				token_id: '42',
				contract_address: '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd',
			},
		]) {
			fetchAgentDetail.mockResolvedValueOnce({
				data: {
					...mismatchedDetail,
					raw_metadata: {
						offchain_uri: 'ipfs://agent',
					},
				},
			})
			await expect(eip8004Scan.resolvers[0].resolve[
				'NamespaceChainIdIdentityRegistryAgentId'
			].resolve({
				namespace: 'eip155',
				chainId: 1,
				identityRegistry,
				agentId: '42',
			}, context)).rejects.toThrow('response registration does not match request')
		}
	})
})

describe('EIP-8004 Scan registration file ownership', () => {
	beforeEach(() => {
		fetchAgentDetail.mockReset()
	})

	it('materializes the exact registration file for the offchain URI', async () => {
		fetchAgentDetail.mockResolvedValueOnce({
			data: {
				chain_id: 1,
				token_id: '42',
				contract_address: identityRegistry,
				raw_metadata: {
					offchain_uri: registrationFile.fileUrl,
				},
			},
		})
		const fileResolver = resolver(EntityType.Eip8004AgentRegistrationFile)

		await expect(fileResolver.resolve.RegistrationFileUrl.resolve({
			$registration: registrationFile.$registration,
			fileUrl: registrationFile.fileUrl,
		}, context)).resolves.toEqual({
			$registration: registrationFile.$registration,
			fileUrl: registrationFile.fileUrl,
		})
		expect(Object.keys(fileResolver.projections).sort()).toEqual([
			'$registration',
			'fileUrl',
		])
	})

	it('rejects unsupported identity and mismatched file URLs', async () => {
		const resolve = resolver(EntityType.Eip8004AgentRegistrationFile).resolve.RegistrationFileUrl.resolve

		await expect(resolve({
			$registration: {
				...registrationFile.$registration,
				namespace: 'solana',
			},
			fileUrl: registrationFile.fileUrl,
		}, context)).rejects.toThrow('unsupported registration file namespace')
		expect(fetchAgentDetail).not.toHaveBeenCalled()

		fetchAgentDetail.mockResolvedValueOnce({
			data: {
				chain_id: 1,
				token_id: '42',
				contract_address: identityRegistry,
				raw_metadata: {
					offchain_uri: 'https://agents.example/other.json',
				},
			},
		})
		await expect(resolve({
			$registration: registrationFile.$registration,
			fileUrl: registrationFile.fileUrl,
		}, context)).rejects.toThrow('registration file does not match request')
	})
})

describe('EIP-8004 Scan service endpoint ownership', () => {
	beforeEach(() => {
		fetchAgentDetail.mockReset()
	})

	it('materializes only the exact typed service from its registration file', async () => {
		fetchAgentDetail.mockResolvedValueOnce({
			data: {
				chain_id: 1,
				token_id: '42',
				contract_address: identityRegistry,
				raw_metadata: {
					offchain_uri: registrationFile.fileUrl,
				},
				services: {
					a2a: {
						endpoint: 'https://agents.example/a2a',
						name: 'Trading agent',
						version: '1.2.0',
						protocol: 'https',
						active: true,
					},
				},
			},
		})
		const endpointResolver = resolver(EntityType.Eip8004AgentServiceEndpoint)

		await expect(endpointResolver.resolve[
			'RegistrationFileEndpointKindEndpointUrl'
		].resolve({
			$registrationFile: registrationFile,
			endpointKind: 'a2a',
			endpointUrl: 'https://agents.example/a2a',
		}, context)).resolves.toEqual({
			$registrationFile: registrationFile,
			endpointKind: 'a2a',
			endpointUrl: 'https://agents.example/a2a',
			name: 'Trading agent',
			version: '1.2.0',
			protocolKind: 'https',
			active: true,
		})
		expect(fetchAgentDetail).toHaveBeenCalledWith(
			{
				chainId: 1,
				tokenId: '42',
			}
		)
		expect(Object.keys(endpointResolver.projections).sort()).toEqual([
			'$registrationFile',
			'active',
			'endpointKind',
			'endpointUrl',
			'name',
			'protocolKind',
			'version',
		])
	})

	it('rejects unsupported registration identity before transport', async () => {
		const resolve = resolver(EntityType.Eip8004AgentServiceEndpoint).resolve[
			'RegistrationFileEndpointKindEndpointUrl'
		].resolve

		await expect(resolve({
			$registrationFile: {
				...registrationFile,
				$registration: {
					...registrationFile.$registration,
					namespace: 'solana',
				},
			},
			endpointKind: 'a2a',
			endpointUrl: 'https://agents.example/a2a',
		}, context)).rejects.toThrow('unsupported service endpoint namespace')
		await expect(resolve({
			$registrationFile: {
				...registrationFile,
				$registration: {
					...registrationFile.$registration,
					chainId: 0,
				},
			},
			endpointKind: 'a2a',
			endpointUrl: 'https://agents.example/a2a',
		}, context)).rejects.toThrow('invalid service endpoint chain ID')
		expect(fetchAgentDetail).not.toHaveBeenCalled()
	})

	it('rejects absent, mismatched, and undeclared provider endpoints', async () => {
		const resolve = resolver(EntityType.Eip8004AgentServiceEndpoint).resolve[
			'RegistrationFileEndpointKindEndpointUrl'
		].resolve
		const selector = {
			$registrationFile: registrationFile,
			endpointKind: 'a2a',
			endpointUrl: 'https://agents.example/a2a',
		} as const

		fetchAgentDetail.mockResolvedValueOnce({})
		await expect(resolve(selector, context)).rejects.toThrow('service endpoint registration not found')

		fetchAgentDetail.mockResolvedValueOnce({
			data: {
				chain_id: 1,
				token_id: '42',
				contract_address: identityRegistry,
				raw_metadata: {
					offchain_uri: 'https://agents.example/other.json',
				},
				services: {},
			},
		})
		await expect(resolve(selector, context)).rejects.toThrow(
			'service endpoint registration does not match request'
		)

		fetchAgentDetail.mockResolvedValueOnce({
			data: {
				chain_id: 1,
				token_id: '42',
				contract_address: identityRegistry,
				raw_metadata: {
					offchain_uri: registrationFile.fileUrl,
				},
				services: {
					mcp: {
						endpoint: 'https://agents.example/mcp',
					},
				},
			},
		})
		await expect(resolve(selector, context)).rejects.toThrow('service endpoint not found')
	})
})

describe('EIP-8004 Scan global agent NFT list', () => {
	beforeEach(() => {
		fetchAgentList.mockReset()
	})

	it('projects schema-shaped NFT refs with authoritative pagination total', async () => {
		fetchAgentList.mockResolvedValueOnce({
			success: true,
			data: [{
				chain_id: 56,
				token_id: '250983',
				contract_address: '0x8004a169fb4a3325136eb29fa0ceb6d2e539a432',
				name: 'Ave.ai Trading Agent',
			}, {
				chain_id: 1,
				token_id: 'bad',
				contract_address: 'invalid',
			}],
			meta: {
				pagination: {
					page: 1,
					limit: 100,
					total: 699983,
					hasMore: true,
				},
			},
		})
		const globalResolver = resolver(EntityType._Global)
		const snapshot = await globalResolver.resolve.Scope.resolve({
			scope: Source.Eip8004Scan_Rest,
		}, context)

		expect(snapshot).toEqual({
			totalCount: 699983,
			$$eip8004Services: [{
				[EntityMetaKey.Selector]: {
					$contract: {
						$network: {
							caip2: {
								namespace: 'eip155',
								reference: '56',
							},
						},
						address: '0x8004a169fb4a3325136eb29fa0ceb6d2e539a432',
					},
					tokenId: '250983',
				},
			}],
		})
		expect(globalResolver.projections.$$eip8004Services.select(snapshot)).toEqual(snapshot.$$eip8004Services)
		expect(globalResolver.projections.$$eip8004Services.resolveCount(snapshot)).toBe(699983)
	})

	it('hard-fails malformed list envelopes instead of soft-emptying', async () => {
		const resolve = resolver(EntityType._Global).resolve.Scope.resolve

		fetchAgentList.mockResolvedValueOnce({
			success: true,
		})
		await expect(resolve({
			scope: Source.Eip8004Scan_Rest,
		}, context)).rejects.toThrow('agent list missing data')

		fetchAgentList.mockResolvedValueOnce({
			success: true,
			data: [],
			meta: {
				pagination: {
					page: 1,
					limit: 100,
				},
			},
		})
		await expect(resolve({
			scope: Source.Eip8004Scan_Rest,
		}, context)).rejects.toThrow('agent list missing pagination total')
	})
})
