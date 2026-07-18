import { beforeEach, describe, expect, it, vi } from 'vitest'

import { EntityMetaKey } from '$/schema/$schema.ts'
import { Eip8004AgentRegistrationSelector } from '$/schema/Eip8004AgentRegistration.ts'
import { Eip8004AgentServiceEndpointSelector } from '$/schema/Eip8004AgentServiceEndpoint.ts'
import { EntityType } from '$/schema/EntityType.ts'

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
			chainId: 1,
			tokenId: '42',
			contractAddress: identityRegistry,
			agentUri: 'ipfs://agent',
			fetchedAt: 1_720_000_000_000,
		})

		await expect(eip8004Scan.resolvers[0].resolve[
			Eip8004AgentRegistrationSelector.NamespaceChainIdIdentityRegistryAgentId
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
		expect(fetchAgentDetail).toHaveBeenCalledWith({
			chainId: 1,
			tokenId: '42',
		})
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
			Eip8004AgentRegistrationSelector.NamespaceChainIdIdentityRegistryAgentId
		].resolve({
			namespace: 'solana',
			chainId: 1,
			identityRegistry,
			agentId: '42',
		}, context)).rejects.toThrow('unsupported registration namespace')
		await expect(eip8004Scan.resolvers[0].resolve[
			Eip8004AgentRegistrationSelector.NamespaceChainIdIdentityRegistryAgentId
		].resolve({
			namespace: 'eip155',
			chainId: 0,
			identityRegistry,
			agentId: '42',
		}, context)).rejects.toThrow('invalid registration chain ID')
		expect(fetchAgentDetail).not.toHaveBeenCalled()
	})

	it('rejects absent and mismatched provider registrations', async () => {
		fetchAgentDetail.mockResolvedValueOnce(undefined)
		await expect(eip8004Scan.resolvers[0].resolve[
			Eip8004AgentRegistrationSelector.NamespaceChainIdIdentityRegistryAgentId
		].resolve({
			namespace: 'eip155',
			chainId: 1,
			identityRegistry,
			agentId: '42',
		}, context)).rejects.toThrow('agent registration not found')

		for (const mismatchedDetail of [
			{
				chainId: 10,
				tokenId: '42',
				contractAddress: identityRegistry,
			},
			{
				chainId: 1,
				tokenId: '43',
				contractAddress: identityRegistry,
			},
			{
				chainId: 1,
				tokenId: '42',
				contractAddress: '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd',
			},
		]) {
			fetchAgentDetail.mockResolvedValueOnce({
				...mismatchedDetail,
				agentUri: 'ipfs://agent',
				fetchedAt: 1_720_000_000_000,
			})
			await expect(eip8004Scan.resolvers[0].resolve[
				Eip8004AgentRegistrationSelector.NamespaceChainIdIdentityRegistryAgentId
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
			chainId: 1,
			tokenId: '42',
			contractAddress: identityRegistry,
			agentUri: registrationFile.fileUrl,
			fetchedAt: 1_720_000_000_000,
			services: [{
				endpointKind: 'a2a',
				endpointUrl: 'https://agents.example/a2a',
				name: 'Trading agent',
				version: '1.2.0',
				protocolKind: 'https',
				active: true,
			}],
		})
		const endpointResolver = resolver(EntityType.Eip8004AgentServiceEndpoint)

		await expect(endpointResolver.resolve[
			Eip8004AgentServiceEndpointSelector.RegistrationFileEndpointKindEndpointUrl
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
		expect(fetchAgentDetail).toHaveBeenCalledWith({
			chainId: 1,
			tokenId: '42',
		})
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
			Eip8004AgentServiceEndpointSelector.RegistrationFileEndpointKindEndpointUrl
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
			Eip8004AgentServiceEndpointSelector.RegistrationFileEndpointKindEndpointUrl
		].resolve
		const selector = {
			$registrationFile: registrationFile,
			endpointKind: 'a2a',
			endpointUrl: 'https://agents.example/a2a',
		} as const

		fetchAgentDetail.mockResolvedValueOnce(undefined)
		await expect(resolve(selector, context)).rejects.toThrow('service endpoint registration not found')

		fetchAgentDetail.mockResolvedValueOnce({
			chainId: 1,
			tokenId: '42',
			contractAddress: identityRegistry,
			agentUri: 'https://agents.example/other.json',
			fetchedAt: 1_720_000_000_000,
			services: [],
		})
		await expect(resolve(selector, context)).rejects.toThrow(
			'service endpoint registration does not match request'
		)

		fetchAgentDetail.mockResolvedValueOnce({
			chainId: 1,
			tokenId: '42',
			contractAddress: identityRegistry,
			agentUri: registrationFile.fileUrl,
			fetchedAt: 1_720_000_000_000,
			services: [{
				endpointKind: 'mcp',
				endpointUrl: 'https://agents.example/mcp',
			}],
		})
		await expect(resolve(selector, context)).rejects.toThrow('service endpoint not found')
	})
})
