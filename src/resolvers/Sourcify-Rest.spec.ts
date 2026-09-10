import {
	beforeEach,
	describe,
	expect,
	it,
	vi,
} from 'vitest'
import { createResolverContext } from '../../tests/resolverContext.ts'

import { EntityMetaKey } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import type { SourcifyContractLookup } from '$/sources/Sourcify/Rest/types.ts'

const getContractLookup = vi.hoisted(() => vi.fn())
const listVerifiedContracts = vi.hoisted(() => vi.fn())

vi.mock('$/sources/Sourcify/Rest/queries.ts', () => ({
	getContractLookup,
	listVerifiedContracts,
}))

const { default: sourcifyRest } = await import('$/resolvers/Sourcify-Rest.ts')

const network = {
	caip2: {
		namespace: 'eip155',
		reference: '1',
	},
} as const
const contract = {
	$network: network,
	address: '0x00000000219ab540356cbb839cbe05303d7705fa',
} as const

const verifiedLookup = {
	match: 'exact_match',
	creationMatch: 'exact_match',
	runtimeMatch: 'exact_match',
	matchId: '2115',
	verifiedAt: '2024-08-08T10:05:44Z',
	chainId: '1',
	address: contract.address,
	abi: [
		{
			type: 'function',
			name: 'get_deposit_count',
			inputs: [],
			outputs: [
				{
					type: 'bytes',
				},
			],
			stateMutability: 'view',
		},
	],
	compilation: {
		language: 'Solidity',
		compiler: 'solc',
		compilerVersion: '0.6.11+commit.5ef660b1',
		name: 'DepositContract',
		fullyQualifiedName: 'deposit_contract.sol:DepositContract',
		compilerSettings: {
			optimizer: {
				enabled: true,
				runs: 5000000,
			},
		},
		storageLayout: {
			storage: [],
			types: {},
		},
	},
	deployment: {
		deployer: '0xb20a608c624Ca5003905aA834De7156C68b2E1d0',
		transactionHash: '0xe75fb554e433e03763a1560646ee22dcb74e5274b34c5ad644e7c0f619a7e1d0',
	},
	sources: {
		'deposit_contract.sol': {
			content: 'pragma solidity ^0.6.0; contract DepositContract {}',
		},
	},
	proxyResolution: {
		isProxy: false,
		implementations: [],
	},
} as const satisfies SourcifyContractLookup

const findResolver = (
	entityType: EntityType,
	selectorName: string
) => {
	const resolver = sourcifyRest.resolvers.find((candidate) => (
		candidate.entityType === entityType
		&& candidate.resolve[selectorName] != null
	))
	if (resolver == null)
		throw new Error(`Sourcify REST spec missing ${entityType}.${selectorName}`)
	return resolver
}

const networkContext = {
	...createResolverContext(),
	pagination: {
		limit: 16,
		offset: 0,
	},
}

describe('Sourcify REST resolvers', () => {
	beforeEach(() => {
		getContractLookup.mockReset()
		listVerifiedContracts.mockReset()
	})

	it('projects Network.Evm.$$contracts from verified-contract list', async () => {
		listVerifiedContracts.mockResolvedValue([
			{
				match: 'exact_match',
				chainId: '1',
				address: contract.address,
				matchId: '2115',
			},
			{
				match: 'exact_match',
				chainId: '1',
				address: 'not-an-address',
			},
		])

		const networkResolver = sourcifyRest.resolvers.find((candidate) => (
			candidate.entityType === EntityType.Network
		))
		if (networkResolver == null)
			throw new Error('Sourcify REST spec missing Network.Caip2 $$contracts')

		const contracts = await networkResolver.resolve.Caip2.resolve(network, networkContext)
		expect(networkResolver.projections.Evm.$$contracts.select(contracts)).toEqual([
			{
				[EntityMetaKey.Selector]: {
					$network: network,
					address: contract.address,
				},
			},
		])
		expect(listVerifiedContracts).toHaveBeenCalledWith({
			afterMatchId: undefined,
			chainId: 1,
			limit: 16,
			sort: 'desc',
		})
		expect(networkResolver.projections.Evm.$$contracts.continuation(
			contracts,
			network,
			networkContext
		)).toEqual({
			operation: 'verified-contracts',
			target: '1',
			terminal: true,
		})
	})

	it('continues Network.Evm.$$contracts from the last native match ID', async () => {
		listVerifiedContracts.mockResolvedValue(Array.from({ length: 16 }, (_value, index) => ({
			match: 'exact_match',
			chainId: '1',
			address: `0x${String(index + 1).padStart(40, '0')}`,
			matchId: String(300 - index),
		})))
		const networkResolver = sourcifyRest.resolvers.find((candidate) => (
			candidate.entityType === EntityType.Network
		))
		if (networkResolver == null)
			throw new Error('Sourcify REST spec missing Network.Caip2 $$contracts')

		const context = {
			...networkContext,
			providerContinuationToken: '301',
		}
		const contracts = await networkResolver.resolve.Caip2.resolve(network, context)
		expect(listVerifiedContracts).toHaveBeenCalledWith({
			afterMatchId: '301',
			chainId: 1,
			limit: 16,
			sort: 'desc',
		})
		expect(networkResolver.projections.Evm.$$contracts.continuation(
			contracts,
			network,
			context
		)).toEqual({
			operation: 'verified-contracts',
			target: '1',
			terminal: false,
			token: '285',
		})
	})

	it('returns a terminal empty page without transport for a zero-row request', async () => {
		const networkResolver = sourcifyRest.resolvers.find((candidate) => (
			candidate.entityType === EntityType.Network
		))
		if (networkResolver == null)
			throw new Error('Sourcify REST spec missing Network.Caip2 $$contracts')
		const context = {
			...networkContext,
			pagination: { limit: 0 },
		}
		const contracts = await networkResolver.resolve.Caip2.resolve(network, context)
		expect(networkResolver.projections.Evm.$$contracts.select(contracts)).toEqual([])
		expect(networkResolver.projections.Evm.$$contracts.continuation(
			contracts,
			network,
			context
		)).toMatchObject({ terminal: true })
		expect(listVerifiedContracts).not.toHaveBeenCalled()
	})

	it('fail-closes a full verified-contract page without an advancing match ID', async () => {
		const networkResolver = sourcifyRest.resolvers.find((candidate) => (
			candidate.entityType === EntityType.Network
		))
		if (networkResolver == null)
			throw new Error('Sourcify REST spec missing Network.Caip2 $$contracts')

		for (const matchId of [undefined, '301']) {
			listVerifiedContracts.mockResolvedValueOnce(Array.from({ length: 16 }, (_value, index) => ({
				match: 'exact_match',
				chainId: '1',
				address: `0x${String(index + 1).padStart(40, '0')}`,
				...(index === 15 && matchId != null && { matchId }),
			})))
			const context = {
				...networkContext,
				providerContinuationToken: '301',
			}
			const contracts = await networkResolver.resolve.Caip2.resolve(network, context)
			expect(() => networkResolver.projections.Evm.$$contracts.continuation(
				contracts,
				network,
				context
			)).toThrow(matchId == null ?
				'missing continuation matchId'
			:
				'continuation did not advance'
			)
		}
	})

	it('projects verification, compilation, and source bundle from one lookup', async () => {
		getContractLookup.mockResolvedValue(verifiedLookup)

		const verification = await findResolver(
			EntityType.EvmContractVerification,
			'EvmContract'
		).resolve.EvmContract.resolve({
			$contract: contract,
		})
		expect(verification).toMatchObject({
			match: 'exact_match',
			creationMatch: 'exact_match',
			runtimeMatch: 'exact_match',
			matchId: '2115',
			verifiedAtMs: Date.parse('2024-08-08T10:05:44Z'),
			$compilation: {
				[EntityMetaKey.Selector]: {
					$contract: contract,
				},
			},
			$sourceBundle: {
				[EntityMetaKey.Selector]: {
					$contract: contract,
				},
			},
		})

		const compilation = await findResolver(
			EntityType.EvmContractCompilation,
			'EvmContract'
		).resolve.EvmContract.resolve({
			$contract: contract,
		})
		expect(compilation).toMatchObject({
			language: 'Solidity',
			compiler: '0.6.11+commit.5ef660b1',
			compilerVersion: '0.6.11+commit.5ef660b1',
			name: 'DepositContract',
			fullyQualifiedName: 'deposit_contract.sol:DepositContract',
		})
		expect(compilation.storageLayoutJson).toContain('"storage"')

		const sourceBundle = await findResolver(
			EntityType.EvmContractSourceBundle,
			'EvmContract'
		).resolve.EvmContract.resolve({
			$contract: contract,
		})
		expect(JSON.parse(sourceBundle.files)).toEqual({
			'deposit_contract.sol': 'pragma solidity ^0.6.0; contract DepositContract {}',
		})
	})

	it('projects contract abi, verification ref, deployer, and creation transaction', async () => {
		getContractLookup.mockResolvedValue(verifiedLookup)

		const abiResolver = sourcifyRest.resolvers.find((candidate) => (
			candidate.entityType === EntityType.EvmContract
			&& 'abi' in candidate.projections
		))
		if (abiResolver == null)
			throw new Error('Sourcify REST spec missing EvmContract.abi')

		const abi = await abiResolver.resolve.EvmNetworkAddress.resolve(contract)
		expect(abi).toEqual([
			{
				type: 'function',
				name: 'get_deposit_count',
				inputs: [],
				outputs: [
					{
						type: 'bytes',
					},
				],
				stateMutability: 'view',
			},
		])

		const verificationResolver = sourcifyRest.resolvers.find((candidate) => (
			candidate.entityType === EntityType.EvmContract
			&& '$verification' in candidate.projections
		))
		if (verificationResolver == null)
			throw new Error('Sourcify REST spec missing EvmContract.$verification')

		await expect(verificationResolver.resolve.EvmNetworkAddress.resolve(contract)).resolves.toEqual({
			[EntityMetaKey.Selector]: {
				$contract: contract,
			},
		})

		const deployerResolver = sourcifyRest.resolvers.find((candidate) => (
			candidate.entityType === EntityType.EvmContract
			&& '$deployer' in candidate.projections
		))
		if (deployerResolver == null)
			throw new Error('Sourcify REST spec missing EvmContract.$deployer')

		await expect(deployerResolver.resolve.EvmNetworkAddress.resolve(contract)).resolves.toEqual({
			[EntityMetaKey.Selector]: {
				address: '0xb20a608c624ca5003905aa834de7156c68b2e1d0',
			},
		})

		const creationResolver = sourcifyRest.resolvers.find((candidate) => (
			candidate.entityType === EntityType.EvmContract
			&& '$creationTransaction' in candidate.projections
		))
		if (creationResolver == null)
			throw new Error('Sourcify REST spec missing EvmContract.$creationTransaction')

		await expect(creationResolver.resolve.EvmNetworkAddress.resolve(contract)).resolves.toEqual({
			[EntityMetaKey.Selector]: {
				$network: network,
				txHash: '0xe75fb554e433e03763a1560646ee22dcb74e5274b34c5ad644e7c0f619a7e1d0',
			},
		})
	})

	it('keeps deployment clock and proxyType leftovers unprojected', async () => {
		getContractLookup.mockResolvedValue({
			...verifiedLookup,
			compilation: {
				language: 'Solidity',
				compiler: 'solc',
				compilerVersion: '0.6.11+commit.5ef660b1',
				name: 'DepositContract',
				fullyQualifiedName: 'deposit_contract.sol:DepositContract',
				storageLayout: {
					storage: [],
					types: {},
				},
			},
			deployment: {
				...verifiedLookup.deployment,
				blockNumber: '11052984',
				transactionIndex: '2',
			},
			metadata: {
				compiler: {
					version: '0.6.11+commit.5ef660b1',
				},
				language: 'Solidity',
				output: {
					abi: [],
				},
				settings: {
					optimizer: {
						enabled: true,
					},
				},
				version: 1,
			},
			proxyResolution: {
				isProxy: false,
				proxyType: null,
				implementations: [],
			},
		})

		const deployerResolver = sourcifyRest.resolvers.find((candidate) => (
			candidate.entityType === EntityType.EvmContract
			&& '$deployer' in candidate.projections
		))
		if (deployerResolver == null)
			throw new Error('Sourcify REST spec missing EvmContract.$deployer')
		const deployer = await deployerResolver.resolve.EvmNetworkAddress.resolve(contract)
		expect(deployer).toEqual({
			[EntityMetaKey.Selector]: {
				address: '0xb20a608c624ca5003905aa834de7156c68b2e1d0',
			},
		})
		expect(deployer).not.toHaveProperty('blockNumber')
		expect(deployer).not.toHaveProperty('transactionIndex')

		const implementationResolver = sourcifyRest.resolvers.find((candidate) => (
			candidate.entityType === EntityType.EvmContract
			&& '$implementation' in candidate.projections
		))
		if (implementationResolver == null)
			throw new Error('Sourcify REST spec missing EvmContract.$implementation')
		await expect(implementationResolver.resolve.EvmNetworkAddress.resolve(contract)).resolves.toBeUndefined()

		const compilation = await findResolver(
			EntityType.EvmContractCompilation,
			'EvmContract'
		).resolve.EvmContract.resolve({
			$contract: contract,
		})
		expect(compilation.compilerSettingsJson).toBe(JSON.stringify({
			optimizer: {
				enabled: true,
			},
		}))
		expect(compilation).not.toHaveProperty('output')
		expect(compilation).not.toHaveProperty('settings')
		expect(compilation).not.toHaveProperty('version')
		expect(compilation).not.toHaveProperty('proxyType')
	})

	it('prefers compilation.compilerSettings over metadata.settings for compilerSettingsJson', async () => {
		getContractLookup.mockResolvedValue({
			...verifiedLookup,
			compilation: {
				...verifiedLookup.compilation,
				compilerSettings: {
					optimizer: {
						enabled: false,
						runs: 200,
					},
				},
			},
			metadata: {
				...verifiedLookup.metadata,
				settings: {
					optimizer: {
						enabled: true,
					},
				},
			},
		})

		const compilation = await findResolver(
			EntityType.EvmContractCompilation,
			'EvmContract'
		).resolve.EvmContract.resolve({
			$contract: contract,
		})
		expect(compilation.compilerSettingsJson).toBe(JSON.stringify({
			optimizer: {
				enabled: false,
				runs: 200,
			},
		}))
	})

	it('keeps source-bundle files from metadata when the top-level source response is empty', async () => {
		getContractLookup.mockResolvedValue({
			...verifiedLookup,
			sources: {},
			metadata: {
				...verifiedLookup.metadata,
				sources: {
					'contracts/DepositContract.sol': {
						content: 'contract DepositContract { }',
					},
				},
			},
		})

		await expect(findResolver(
			EntityType.EvmContractSourceBundle,
			'EvmContract'
		).resolve.EvmContract.resolve({
			$contract: contract,
		})).resolves.toEqual({
			files: JSON.stringify({
				'contracts/DepositContract.sol': 'contract DepositContract { }',
			}),
		})
	})

	it('preserves empty source files, metadata fallback, and direct content precedence', async () => {
		getContractLookup.mockResolvedValue({
			...verifiedLookup,
			metadata: {
				sources: {
					'empty-metadata.sol': { content: '' },
					'fallback.sol': { content: 'metadata fallback' },
					'overridden.sol': { content: 'metadata version' },
					'emptied.sol': { content: 'metadata version' },
				},
			},
			sources: {
				'empty-direct.sol': { content: '' },
				'fallback.sol': {},
				'overridden.sol': { content: 'direct version' },
				'emptied.sol': { content: '' },
				'absent.sol': {},
			},
		})

		await expect(findResolver(
			EntityType.EvmContractSourceBundle,
			'EvmContract'
		).resolve.EvmContract.resolve({
			$contract: contract,
		})).resolves.toEqual({
			files: JSON.stringify({
				'empty-metadata.sol': '',
				'fallback.sol': 'metadata fallback',
				'overridden.sol': 'direct version',
				'emptied.sol': '',
				'empty-direct.sol': '',
			}),
		})
	})

	it('projects implementation only when the source declares a proxy', async () => {
		const implementationResolver = sourcifyRest.resolvers.find((candidate) => (
			candidate.entityType === EntityType.EvmContract
			&& '$implementation' in candidate.projections
		))
		if (implementationResolver == null)
			throw new Error('Sourcify REST spec missing EvmContract.$implementation')

		getContractLookup.mockResolvedValue({
			...verifiedLookup,
			proxyResolution: {
				isProxy: false,
				implementations: [{
					address: '0x1111111111111111111111111111111111111111',
				}],
			},
		})
		await expect(implementationResolver.resolve.EvmNetworkAddress.resolve(contract)).resolves.toBeUndefined()

		getContractLookup.mockResolvedValue({
			...verifiedLookup,
			proxyResolution: {
				isProxy: true,
				implementations: [{
					address: '0x1111111111111111111111111111111111111111',
				}],
			},
		})
		await expect(implementationResolver.resolve.EvmNetworkAddress.resolve(contract)).resolves.toEqual({
			[EntityMetaKey.Selector]: {
				$network: network,
				address: '0x1111111111111111111111111111111111111111',
			},
		})
	})

	it('throws for missing verification snapshots and omits optional contract facets', async () => {
		getContractLookup.mockResolvedValue(null)

		await expect(findResolver(
			EntityType.EvmContractVerification,
			'EvmContract'
		).resolve.EvmContract.resolve({
			$contract: contract,
		})).rejects.toThrow('Sourcify_Rest: contract not verified')

		const abiResolver = sourcifyRest.resolvers.find((candidate) => (
			candidate.entityType === EntityType.EvmContract
			&& 'abi' in candidate.projections
		))
		if (abiResolver == null)
			throw new Error('Sourcify REST spec missing EvmContract.abi')

		await expect(abiResolver.resolve.EvmNetworkAddress.resolve(contract)).resolves.toBeUndefined()
	})

	it('propagates provider failures instead of inventing empty verification', async () => {
		getContractLookup.mockRejectedValue(new Error('Sourcify unavailable'))

		await expect(findResolver(
			EntityType.EvmContractVerification,
			'EvmContract'
		).resolve.EvmContract.resolve({
			$contract: contract,
		})).rejects.toThrow('Sourcify unavailable')
	})
})
