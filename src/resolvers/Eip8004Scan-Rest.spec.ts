import { beforeEach, describe, expect, it, vi } from 'vitest'

import { EntityMetaKey } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { SourceTargetKind } from '$/sources/SourceBinding.ts'

const fetchAgentDetail = vi.hoisted(() => vi.fn())

vi.mock('$/sources/Eip8004Scan/Rest/queries.ts', () => ({
	fetchAgentDetail,
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

	it('materializes the exact canonical registration and NFT reference', async () => {
		fetchAgentDetail.mockResolvedValueOnce({
			data: {
				chain_id: 1,
				token_id: '42',
				contract_address: identityRegistry,
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
		})
		expect(fetchAgentDetail).toHaveBeenCalledWith(
			{
				chainId: 1,
				tokenId: '42',
			}
		)
		expect(Object.keys(eip8004Scan.resolvers[0].projections).sort()).toEqual([
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
