import {
	describe,
	expect,
	it,
} from 'vitest'

import constantsResolvers from '$/resolvers/Constants.ts'
import { CoinId } from '$/constants/Coin.ts'
import {
	ConsensusProtocol,
} from '$/schema/NetworkUpgradeProtocols.ts'
import {
	NetworkNamespace,
	networkBySlug,
	networks,
} from '$/constants/Network.ts'
import { networkNamespaceByNamespace } from '$/constants/NetworkNamespace.ts'
import { NetworkStackId } from '$/constants/NetworkStack.ts'
import {
	nostrNetworkSeedNotes,
	nostrNetworkSeedProfiles,
} from '$/constants/Social/Nostr.ts'
import {
	indexResolvers,
	resolverContextRowLimit,
} from '$/resolvers/$resolvers.ts'
import { EntityMetaKey, entityFieldAddressKey } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { Source } from '$/sources/Source.ts'
import sourceProviders from '$/sources/$sourceProviders.ts'

const resolverContext = {
	filters: [],
	sorts: [],
	pagination: {},
	selectorKeys: [],
	parentSelectorKeys: [],
	sources: [],
	publicEnv: {},
}

const networkUpgradesResolver = constantsResolvers.resolvers.find((resolver) => (
	resolver.entityType === EntityType.Network
	&& 'Evm' in resolver.projections
	&& '$$upgrades' in resolver.projections.Evm
))
const networkExecutionUpgradesResolver = constantsResolvers.resolvers.find((resolver) => (
	resolver.entityType === EntityType.Network
	&& 'Evm' in resolver.projections
	&& '$$executionUpgrades' in resolver.projections.Evm
))
const networkConsensusUpgradesResolver = constantsResolvers.resolvers.find((resolver) => (
	resolver.entityType === EntityType.Network
	&& 'Evm' in resolver.projections
	&& '$$consensusUpgrades' in resolver.projections.Evm
))
const ethereumNetworkUpgradeResolver = constantsResolvers.resolvers.find((resolver) => (
	resolver.entityType === EntityType.EthereumNetworkUpgrade
))
const ethereumExecutionUpgradeResolver = constantsResolvers.resolvers.find((resolver) => (
	resolver.entityType === EntityType.EthereumExecutionUpgrade
))
const ethereumConsensusUpgradeResolver = constantsResolvers.resolvers.find((resolver) => (
	resolver.entityType === EntityType.EthereumConsensusUpgrade
))
const networkNativeAssetsResolver = constantsResolvers.resolvers.find((resolver) => (
	resolver.entityType === EntityType.Network
	&& '$$nativeAssets' in resolver.projections
))
const networkMevRelaysResolver = constantsResolvers.resolvers.find((resolver) => (
	resolver.entityType === EntityType.Network
	&& 'Evm' in resolver.projections
	&& '$$mevRelays' in resolver.projections.Evm
))
const networkConsensusProtocolResolver = constantsResolvers.resolvers.find((resolver) => (
	resolver.entityType === EntityType.Network
	&& 'Evm' in resolver.projections
	&& 'consensusProtocol' in resolver.projections.Evm
))
const eigenLayerProtocolResolver = constantsResolvers.resolvers.find((resolver) => (
	resolver.entityType === EntityType.EigenLayerProtocol
))
const globalIpfsAccessResolver = constantsResolvers.resolvers.find((resolver) => (
	resolver.entityType === EntityType._GlobalIpfsAccess
))
const globalArweaveNetworkResolver = constantsResolvers.resolvers.find((resolver) => (
	resolver.entityType === EntityType._GlobalArweaveNetwork
))
const globalSwarmAccessResolver = constantsResolvers.resolvers.find((resolver) => (
	resolver.entityType === EntityType._GlobalSwarmAccess
))
const accountResolver = constantsResolvers.resolvers.find((resolver) => (
	resolver.entityType === EntityType.Account
))
const nostrProfileResolver = constantsResolvers.resolvers.find((resolver) => (
	resolver.entityType === EntityType.NostrProfile
))
const xPostUrlResolver = constantsResolvers.resolvers.find((resolver) => (
	resolver.entityType === EntityType.XPost
	&& 'postUrl' in resolver.projections
))
const blockheadSourceResolver = constantsResolvers.resolvers.find((resolver) => (
	resolver.entityType === EntityType.BlockheadSource
))
const blockheadSourcesResolver = constantsResolvers.resolvers.find((resolver) => (
	resolver.entityType === EntityType._Global
	&& '$$blockheadSources' in resolver.projections
))

if (networkUpgradesResolver == null)
	throw new Error('Constants spec missing Network.Evm.$$upgrades resolver')

if (networkExecutionUpgradesResolver == null)
	throw new Error('Constants spec missing Network.Evm.$$executionUpgrades resolver')

if (networkConsensusUpgradesResolver == null)
	throw new Error('Constants spec missing Network.Evm.$$consensusUpgrades resolver')

if (ethereumNetworkUpgradeResolver == null)
	throw new Error('Constants spec missing EthereumNetworkUpgrade resolver')

if (ethereumExecutionUpgradeResolver == null)
	throw new Error('Constants spec missing EthereumExecutionUpgrade resolver')

if (ethereumConsensusUpgradeResolver == null)
	throw new Error('Constants spec missing EthereumConsensusUpgrade resolver')

if (networkNativeAssetsResolver == null)
	throw new Error('Constants spec missing Network.$$nativeAssets resolver')

if (networkMevRelaysResolver == null)
	throw new Error('Constants spec missing Network.Evm.$$mevRelays resolver')

if (networkConsensusProtocolResolver == null)
	throw new Error('Constants spec missing Network.Evm.consensusProtocol resolver')

if (globalIpfsAccessResolver == null)
	throw new Error('Constants spec missing _GlobalIpfsAccess resolver')

if (globalArweaveNetworkResolver == null)
	throw new Error('Constants spec missing _GlobalArweaveNetwork resolver')

if (globalSwarmAccessResolver == null)
	throw new Error('Constants spec missing _GlobalSwarmAccess resolver')

if (accountResolver == null)
	throw new Error('Constants spec missing Account resolver')

if (nostrProfileResolver == null)
	throw new Error('Constants spec missing NostrProfile resolver')

if (xPostUrlResolver == null)
	throw new Error('Constants spec missing XPost URL resolver')

if (blockheadSourceResolver == null || blockheadSourcesResolver == null)
	throw new Error('Constants spec missing Blockhead source catalog resolvers')

describe('Constants resolver projections', () => {
	it('resolves the canonical source registry without displacing editable local rows', async () => {
		const snapshot = await blockheadSourcesResolver.resolve.Scope.resolve({
			scope: '$$blockheadSources',
		}, resolverContext)
		const sourceReferences = blockheadSourcesResolver.projections.$$blockheadSources.select(snapshot)
		const sourceCount = sourceProviders.reduce((count, provider) => (
			count + Object.keys(provider.sources).length
		), 0)
		expect(sourceReferences).toHaveLength(Math.min(
			sourceCount,
			resolverContextRowLimit(resolverContext)
		))
		const sourceReference = sourceReferences.find((reference) => (
			reference[EntityMetaKey.Selector].id === Source.AcpLocal_JsonRpc
		))
		expect(sourceReference).toEqual({
			[EntityMetaKey.Selector]: {
				id: Source.AcpLocal_JsonRpc,
			},
			[EntityMetaKey.Fields]: {
				[entityFieldAddressKey(EntityType.BlockheadSource, [], 'authKind')]: 'LocalSecret',
				[entityFieldAddressKey(EntityType.BlockheadSource, [], 'environmentScope')]: 'LocalDevice',
				[entityFieldAddressKey(EntityType.BlockheadSource, [], 'label')]: 'ACP local JSON-RPC',
				[entityFieldAddressKey(EntityType.BlockheadSource, [], 'provider')]: 'Acp',
				[entityFieldAddressKey(EntityType.BlockheadSource, [], 'proxyMode')]: 'LocalOnly',
				[entityFieldAddressKey(EntityType.BlockheadSource, [], 'source')]: Source.AcpLocal_JsonRpc,
				[entityFieldAddressKey(EntityType.BlockheadSource, [], 'transportKind')]: 'JsonRpc2',
			},
		})
		expect(blockheadSourcesResolver.projections.$$blockheadSources.resolveCount(snapshot)).toBe(sourceCount)
		expect(blockheadSourcesResolver.projections.$$blockheadSources.continuation(snapshot)).toEqual({
			operation: 'source-registry',
			target: 'global',
			terminal: false,
			token: String(resolverContextRowLimit(resolverContext)),
		})
		if (sourceReference == null)
			throw new Error('Constants source catalog omitted AcpLocal_JsonRpc')

		const blockheadSource = await blockheadSourceResolver.resolve.Id.resolve(
			sourceReference[EntityMetaKey.Selector],
			resolverContext
		)
		expect({
			id: blockheadSourceResolver.projections.id(blockheadSource),
			label: blockheadSourceResolver.projections.label(blockheadSource),
			provider: blockheadSourceResolver.projections.provider(blockheadSource),
			source: blockheadSourceResolver.projections.source(blockheadSource),
		}).toEqual({
			id: Source.AcpLocal_JsonRpc,
			label: 'ACP local JSON-RPC',
			provider: 'Acp',
			source: Source.AcpLocal_JsonRpc,
		})
		expect(blockheadSourceResolver.resolve.Id.resolve({
			id: Source.Local_Internal,
		}, resolverContext)).toMatchObject({
			id: Source.Local_Internal,
			label: 'Local Internal',
			provider: 'Local',
			source: Source.Local_Internal,
		})
		const mempoolSpaceSource = await blockheadSourceResolver.resolve.Id.resolve({
			id: Source.MempoolSpace_Rest,
		}, resolverContext)
		expect({
			endpointUrl: blockheadSourceResolver.projections.endpointUrl(mempoolSpaceSource),
			transportKind: blockheadSourceResolver.projections.transportKind(mempoolSpaceSource),
			authKind: blockheadSourceResolver.projections.authKind(mempoolSpaceSource),
			corsMode: blockheadSourceResolver.projections.corsMode(mempoolSpaceSource),
			proxyMode: blockheadSourceResolver.projections.proxyMode(mempoolSpaceSource),
			environmentScope: blockheadSourceResolver.projections.environmentScope(mempoolSpaceSource),
		}).toEqual({
			endpointUrl: 'https://mempool.space/api',
			transportKind: 'HttpRest',
			authKind: 'None',
			corsMode: 'Browser CORS',
			proxyMode: 'BrowserDirect',
			environmentScope: 'Caip2Network',
		})
		expect(schema.find(({ entityType }) => (
			entityType === EntityType._Global
		))?.fields.find(({ name }) => name === '$$blockheadSources')?.defaultSources).toEqual([
			Source.Constants_Internal,
			Source.Local_Internal,
		])
	})

	it('derives every X post URL synchronously from its required ID', async () => {
		const post = await xPostUrlResolver.resolve['Id'].resolve({
			id: 'not-a-seeded-post',
		}, resolverContext)
		expect(xPostUrlResolver.projections.postUrl(post, resolverContext)).toBe(
			'https://x.com/i/web/status/not-a-seeded-post'
		)
		expect(schema.find(({ entityType }) => (
			entityType === EntityType.XPost
		))?.fields.find(({ name }) => name === 'postUrl')).toMatchObject({
			cardinality: EntityFieldCardinality.One,
			defaultSources: [Source.Constants_Internal],
		})
	})

	it('leaves global OHLC observations to their live field owner', () => {
		expect(schema.find(({ entityType }) => (
			entityType === EntityType._Global
		))?.fields.find(({ name }) => (
			name === '$$marketTimeIntervalTimestamps'
		))?.defaultSources).toEqual([
			Source.Coingecko_Rest,
		])
		expect(constantsResolvers.resolvers.some((resolver) => (
			resolver.entityType === EntityType._Global
			&& '$$marketTimeIntervalTimestamps' in resolver.projections
		))).toBe(false)
	})

	it('keeps beacon consensus domain facts without materializing transport endpoints', async () => {
		const network = await networkConsensusProtocolResolver.resolve.Caip2.resolve({
			caip2: networkBySlug.ethereum.caip2,
		}, resolverContext)

		expect(network.evmConsensusProtocol).toBe(ConsensusProtocol.EthereumBeacon)
		expect(network).not.toHaveProperty('consensusEndpoints')
		expect(networkConsensusProtocolResolver.projections.Evm).not.toHaveProperty('consensusEndpoints')
	})

	it('names the Ethereum EigenLayer protocol from its internal product catalog', async () => {
		const protocol = await eigenLayerProtocolResolver.resolve.Network.resolve({
			$network: {
				caip2: networkBySlug.ethereum.caip2,
			},
		}, resolverContext)

		expect(eigenLayerProtocolResolver.resolve.Network.appliesTo).toEqual([
			{
				$network: {
					caip2: networkBySlug.ethereum.caip2,
				},
			},
			{
				$network: {
					slug: networkBySlug.ethereum.slug,
				},
			},
		])
		expect(eigenLayerProtocolResolver.projections.protocolName(protocol)).toBe('EigenLayer')
	})

	it('keeps unsigned Nostr seeds on stable identity and note relationships only', async () => {
		expect(nostrNetworkSeedNotes.every((note) => !Object.hasOwn(note, 'signature'))).toBe(true)
		expect(Object.keys(nostrProfileResolver.projections).toSorted()).toEqual([
			'$$notes',
			'pubkey',
		])

		await expect(nostrProfileResolver.resolve['CanonicalPubkey'].resolve({
			pubkey: nostrNetworkSeedProfiles[0].pubkey,
		}, resolverContext)).resolves.toEqual({
			pubkey: nostrNetworkSeedProfiles[0].pubkey,
			$$notes: [{
				[EntityMetaKey.Selector]: {
					eventId: nostrNetworkSeedNotes[0].eventId,
				},
			}],
		})
	})

	it('derives and indexes public account facets by namespace', async () => {
		expect(indexResolvers(
			schema,
			[constantsResolvers],
			new Set([Source.Constants_Internal])
		).resolverParts.filter(({ entityType }) => (
			entityType === EntityType.Account
		)).map(({ facetPath, fieldName }) => [
			facetPath,
			fieldName,
		])).toEqual([
			[[], 'namespace'],
			[[], '$network'],
			[[], 'address'],
			[['Evm'], '$account'],
			[['Aptos'], '$account'],
			[['Cardano'], '$account'],
			[['Cosmos'], '$account'],
			[['Hedera'], '$account'],
			[['Polkadot'], '$account'],
			[['Solana'], '$account'],
			[['Starknet'], '$account'],
			[['Tron'], '$account'],
			[['Ton'], '$account'],
			[['Xrpl'], '$account'],
			[['Utxo'], '$account'],
		])

		for (const { caip10, facet, selector } of [
			{
				caip10: {
					namespace: 'eip155',
					reference: '1',
					accountAddress: '0xd8da6bf26964af9d7eed9e403e826090792bed6a',
				},
				facet: 'Evm',
				selector: {
					$network: {
						caip2: {
							namespace: 'eip155',
							reference: '1',
						},
					},
					$actor: {
						address: '0xd8da6bf26964af9d7eed9e403e826090792bed6a',
					},
				},
			},
			{
				caip10: {
					namespace: 'aptos',
					reference: '1',
					accountAddress: '0x1',
				},
				facet: 'Aptos',
				selector: {
					$network: {
						$network: {
							caip2: {
								namespace: 'aptos',
								reference: '1',
							},
						},
					},
					address: '0x1',
				},
			},
			{
				caip10: {
					namespace: 'cip34',
					reference: '1-764824073',
					accountAddress: 'addr1account',
				},
				facet: 'Cardano',
				selector: {
					$network: {
						caip2: {
							namespace: 'cip34',
							reference: '1-764824073',
						},
					},
					address: 'addr1account',
				},
			},
			{
				caip10: {
					namespace: 'cosmos',
					reference: 'cosmoshub-4',
					accountAddress: 'cosmos1account',
				},
				facet: 'Cosmos',
				selector: {
					$network: {
						caip2: {
							namespace: 'cosmos',
							reference: 'cosmoshub-4',
						},
					},
					address: 'cosmos1account',
				},
			},
			{
				caip10: {
					namespace: 'hedera',
					reference: 'mainnet',
					accountAddress: '0.0.1234',
				},
				facet: 'Hedera',
				selector: {
					$network: {
						caip2: {
							namespace: 'hedera',
							reference: 'mainnet',
						},
					},
					accountId: '0.0.1234',
				},
			},
			{
				caip10: {
					namespace: 'polkadot',
					reference: '91b171bb158e2d3848fa23a9f1c25182',
					accountAddress: '5Account',
				},
				facet: 'Polkadot',
				selector: {
					$network: {
						caip2: {
							namespace: 'polkadot',
							reference: '91b171bb158e2d3848fa23a9f1c25182',
						},
					},
					accountId: '5Account',
				},
			},
			{
				caip10: {
					namespace: 'solana',
					reference: '5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp',
					accountAddress: '11111111111111111111111111111111',
				},
				facet: 'Solana',
				selector: {
					$network: {
						caip2: {
							namespace: 'solana',
							reference: '5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp',
						},
					},
					pubkey: '11111111111111111111111111111111',
				},
			},
			{
				caip10: {
					namespace: 'starknet',
					reference: 'SN_MAIN',
					accountAddress: '0x0123',
				},
				facet: 'Starknet',
				selector: {
					$network: {
						$network: {
							caip2: {
								namespace: 'starknet',
								reference: 'SN_MAIN',
							},
						},
					},
					address: '0x0123',
				},
			},
			{
				caip10: {
					namespace: 'tron',
					reference: '0x2b6653dc',
					accountAddress: 'TAccount',
				},
				facet: 'Tron',
				selector: {
					$network: {
						caip2: {
							namespace: 'tron',
							reference: '0x2b6653dc',
						},
					},
					address: 'TAccount',
				},
			},
			{
				caip10: {
					namespace: 'ton',
					reference: '-239',
					accountAddress: 'EQ/a+b',
				},
				facet: 'Ton',
				selector: {
					$network: {
						caip2: {
							namespace: 'ton',
							reference: '-239',
						},
					},
					address: 'EQ/a+b',
				},
			},
			{
				caip10: {
					namespace: 'xrpl',
					reference: '0',
					accountAddress: 'rAccount',
				},
				facet: 'Xrpl',
				selector: {
					$network: {
						caip2: {
							namespace: 'xrpl',
							reference: '0',
						},
					},
					account: 'rAccount',
				},
			},
			{
				caip10: {
					namespace: 'bip122',
					reference: '000000000019d6689c085ae165831e93',
					accountAddress: 'bc1qaccount',
				},
				facet: 'Utxo',
				selector: {
					$network: {
						caip2: {
							namespace: 'bip122',
							reference: '000000000019d6689c085ae165831e93',
						},
					},
					address: 'bc1qaccount',
				},
			},
		] as const) {
			const account = await accountResolver.resolve['Caip10'].resolve({
				caip10,
			}, resolverContext)
			expect(account).toEqual({
				caip10,
				namespace: caip10.namespace,
				$network: {
					[EntityMetaKey.Selector]: {
						caip2: {
							namespace: caip10.namespace,
							reference: caip10.reference,
						},
					},
				},
				address: caip10.accountAddress,
			})
			expect(accountResolver.projections[facet].$account(account)).toEqual({
				[EntityMetaKey.Selector]: selector,
			})
		}
		expect(networkBySlug.tron.caip2).toEqual({
			namespace: 'tron',
			reference: '0x2b6653dc',
		})
	})

	it('materializes fixed Arweave, IPFS, and Swarm hubs without fabricating live fields', async () => {
		await expect(globalArweaveNetworkResolver.resolve[
			'Scope'
		].resolve({
			scope: '_GlobalArweaveNetwork',
		}, resolverContext)).resolves.toEqual({
			scope: '_GlobalArweaveNetwork',
		})
		await expect(globalIpfsAccessResolver.resolve[
			'Scope'
		].resolve({
			scope: '_GlobalIpfsAccess',
		}, resolverContext)).resolves.toEqual({
			scope: '_GlobalIpfsAccess',
		})
		await expect(globalSwarmAccessResolver.resolve[
			'Scope'
		].resolve({
			scope: '_GlobalSwarmAccess',
		}, resolverContext)).resolves.toEqual({
			scope: '_GlobalSwarmAccess',
		})
	})

	it('derives the Cardano stack and native ADA from the canonical namespace catalog', async () => {
		expect(networkBySlug.cardano.namespace).toBe(NetworkNamespace.Cardano)
		expect(networkNamespaceByNamespace[NetworkNamespace.Cardano]).toEqual({
			namespace: NetworkNamespace.Cardano,
			networkStackId: NetworkStackId.Cardano,
			executionEnvironmentIds: [],
			consensusMechanismIds: [],
			nativeAssetCoinId: CoinId.ADA,
		})

		const network = await networkNativeAssetsResolver.resolve['Slug'].resolve({
			slug: 'cardano',
		}, resolverContext)

		expect(network.nativeAssets).toEqual([
			{
				[EntityMetaKey.Selector]: {
					$network: {
						slug: 'cardano',
					},
					kind: 'Native',
					assetKey: CoinId.ADA,
				},
			},
		])
	})

	it('returns empty EVM-only relationships for a slug-only Cardano network', async () => {
		await expect(Promise.all([
			networkMevRelaysResolver.resolve['Slug'].resolve({ slug: 'cardano' }, resolverContext),
			networkUpgradesResolver.resolve['Slug'].resolve({ slug: 'cardano' }, resolverContext),
			networkExecutionUpgradesResolver.resolve['Slug'].resolve({ slug: 'cardano' }, resolverContext),
			networkConsensusUpgradesResolver.resolve['Slug'].resolve({ slug: 'cardano' }, resolverContext),
		])).resolves.toEqual([
			[],
			[],
			[],
			[],
		])
	})

	it('maps the XRPL native asset to the canonical XRP coin', async () => {
		const network = await networkNativeAssetsResolver.resolve['Slug'].resolve({
			slug: 'xrpl',
		}, resolverContext)

		expect(network.nativeAssets).toEqual([
			{
				[EntityMetaKey.Selector]: {
					$network: {
						slug: 'xrpl',
					},
					kind: 'Native',
					assetKey: CoinId.XRP,
				},
			},
		])
	})

	it('maps the Hedera native asset to the canonical HBAR coin', async () => {
		const network = await networkNativeAssetsResolver.resolve['Slug'].resolve({
			slug: 'hedera',
		}, resolverContext)

		expect(network.nativeAssets).toEqual([
			{
				[EntityMetaKey.Selector]: {
					$network: {
						slug: 'hedera',
					},
					kind: 'Native',
					assetKey: CoinId.HBAR,
				},
			},
		])
	})

	it('keeps native-asset facts equivalent across slug and CAIP-2 selectors', async () => {
		for (const network of networks) {
			if (
				!('caip2' in network)
				|| networkNamespaceByNamespace[network.namespace].nativeAssetCoinId == null
			)
				continue

			const bySlug = await networkNativeAssetsResolver.resolve['Slug'].resolve({
				slug: network.slug,
			}, resolverContext)
			const byCaip2 = await networkNativeAssetsResolver.resolve['Caip2'].resolve({
				caip2: network.caip2,
			}, resolverContext)

			expect(bySlug.nativeCoin).toEqual(byCaip2.nativeCoin)
			expect(bySlug.nativeCoinInstance).toEqual(byCaip2.nativeCoinInstance)
			expect(bySlug.nativeAssets[0][EntityMetaKey.Selector]).toEqual({
				$network: {
					slug: network.slug,
				},
				kind: byCaip2.nativeAssets[0][EntityMetaKey.Selector].kind,
				assetKey: byCaip2.nativeAssets[0][EntityMetaKey.Selector].assetKey,
			})
		}
	})

	it('preserves assetless networks without failing unrelated network fields', async () => {
		for (const slug of [
			'avail',
			'lightning',
			'logos-testnet',
		]) {
			const network = await networkNativeAssetsResolver.resolve['Slug'].resolve({
				slug,
			}, resolverContext)

			expect(network.nativeCoin).toBeUndefined()
			expect(network.nativeCoinInstance).toBeUndefined()
			expect(network.nativeAssets).toEqual([])
		}
	})

	it('materializes Network.Evm.$$upgrades with only declared child fields', async () => {
		const upgrades = await networkUpgradesResolver.resolve['Caip2'].resolve({
			caip2: {
				namespace: 'eip155',
				reference: '1',
			},
		}, resolverContext)

		expect(upgrades.length).toBeGreaterThan(0)
		expect(upgrades.every((upgrade) => (
			Object.keys(upgrade).toSorted().join() === [
				EntityMetaKey.Fields,
				EntityMetaKey.Selector,
			].toSorted().join()
			&& Object.keys(upgrade[EntityMetaKey.Fields]).every((fieldAddress) => new Set([
				entityFieldAddressKey(EntityType.EthereumNetworkUpgrade, [], 'name'),
				entityFieldAddressKey(EntityType.EthereumNetworkUpgrade, [], 'slug'),
				entityFieldAddressKey(EntityType.EthereumNetworkUpgrade, [], 'activationBlock'),
				entityFieldAddressKey(EntityType.EthereumNetworkUpgrade, [], 'activationTimestampMs'),
				entityFieldAddressKey(EntityType.EthereumNetworkUpgrade, [], 'activationEpoch'),
				entityFieldAddressKey(EntityType.EthereumNetworkUpgrade, [], '$$proposals'),
			]).has(fieldAddress))
		))).toBe(true)
	})

	it('keeps upgrade ID, route alias, network slug, and CAIP-2 resolution equivalent', async () => {
		const networkSelector = {
			caip2: {
				namespace: 'eip155',
				reference: '1',
			},
		}

		await expect(
			ethereumNetworkUpgradeResolver.resolve['EvmNetworkSlug'].resolve({
				$network: networkSelector,
				slug: 'paris',
			}, resolverContext)
		).resolves.toEqual(
			await ethereumNetworkUpgradeResolver.resolve['EvmNetworkUpgradeId'].resolve({
				$network: networkSelector,
				upgradeId: 'Merge',
			}, resolverContext)
		)
		await expect(
			ethereumExecutionUpgradeResolver.resolve['EvmNetworkSlug'].resolve({
				$network: networkSelector,
				slug: 'paris',
			}, resolverContext)
		).resolves.toEqual(
			await ethereumExecutionUpgradeResolver.resolve['EvmNetworkUpgradeId'].resolve({
				$network: networkSelector,
				upgradeId: 'Paris',
			}, resolverContext)
		)
		await expect(
			ethereumConsensusUpgradeResolver.resolve['EvmNetworkSlug'].resolve({
				$network: networkSelector,
				slug: 'bellatrix',
			}, resolverContext)
		).resolves.toEqual(
			await ethereumConsensusUpgradeResolver.resolve['EvmNetworkUpgradeId'].resolve({
				$network: networkSelector,
				upgradeId: 'Bellatrix',
			}, resolverContext)
		)

		for (const resolver of [
			networkUpgradesResolver,
			networkExecutionUpgradesResolver,
			networkConsensusUpgradesResolver,
		])
			await expect(
				resolver.resolve['Slug'].resolve({
					slug: 'ethereum',
				}, resolverContext)
			).resolves.toEqual(
				await resolver.resolve['Caip2'].resolve(networkSelector, resolverContext)
			)
	})

	it('materializes Network.Evm.$$executionUpgrades with only declared child fields', async () => {
		const upgrades = await networkExecutionUpgradesResolver.resolve['Caip2'].resolve({
			caip2: {
				namespace: 'eip155',
				reference: '1',
			},
		}, resolverContext)

		expect(upgrades.length).toBeGreaterThan(0)
		expect(upgrades.every((upgrade) => (
			Object.keys(upgrade).toSorted().join() === [
				EntityMetaKey.Fields,
				EntityMetaKey.Selector,
			].toSorted().join()
			&& Object.keys(upgrade[EntityMetaKey.Fields]).every((fieldAddress) => new Set([
				entityFieldAddressKey(EntityType.EthereumExecutionUpgrade, [], 'name'),
				entityFieldAddressKey(EntityType.EthereumExecutionUpgrade, [], 'slug'),
				entityFieldAddressKey(EntityType.EthereumExecutionUpgrade, [], 'activationBlock'),
				entityFieldAddressKey(EntityType.EthereumExecutionUpgrade, [], 'activationTimestampMs'),
				entityFieldAddressKey(EntityType.EthereumExecutionUpgrade, [], 'activationEpoch'),
				entityFieldAddressKey(EntityType.EthereumExecutionUpgrade, [], 'protocol'),
				entityFieldAddressKey(EntityType.EthereumExecutionUpgrade, [], 'layer'),
				entityFieldAddressKey(EntityType.EthereumExecutionUpgrade, [], 'forkHash'),
				entityFieldAddressKey(EntityType.EthereumExecutionUpgrade, [], 'linkEthereumOrg'),
				entityFieldAddressKey(EntityType.EthereumExecutionUpgrade, [], 'linkExecutionDocs'),
				entityFieldAddressKey(EntityType.EthereumExecutionUpgrade, [], 'linkForkcast'),
				entityFieldAddressKey(EntityType.EthereumExecutionUpgrade, [], 'executionSpecsPinnedMarkdownFilename'),
				entityFieldAddressKey(EntityType.EthereumExecutionUpgrade, [], '$$proposals'),
			]).has(fieldAddress))
		))).toBe(true)
	})

	it('materializes Network.Evm.$$consensusUpgrades with only declared child fields', async () => {
		const upgrades = await networkConsensusUpgradesResolver.resolve['Caip2'].resolve({
			caip2: {
				namespace: 'eip155',
				reference: '1',
			},
		}, resolverContext)

		expect(upgrades.length).toBeGreaterThan(0)
		expect(upgrades.every((upgrade) => (
			Object.keys(upgrade).toSorted().join() === [
				EntityMetaKey.Fields,
				EntityMetaKey.Selector,
			].toSorted().join()
			&& Object.keys(upgrade[EntityMetaKey.Fields]).every((fieldAddress) => new Set([
				entityFieldAddressKey(EntityType.EthereumConsensusUpgrade, [], 'name'),
				entityFieldAddressKey(EntityType.EthereumConsensusUpgrade, [], 'slug'),
				entityFieldAddressKey(EntityType.EthereumConsensusUpgrade, [], 'activationBlock'),
				entityFieldAddressKey(EntityType.EthereumConsensusUpgrade, [], 'activationTimestampMs'),
				entityFieldAddressKey(EntityType.EthereumConsensusUpgrade, [], 'activationEpoch'),
				entityFieldAddressKey(EntityType.EthereumConsensusUpgrade, [], 'protocol'),
				entityFieldAddressKey(EntityType.EthereumConsensusUpgrade, [], 'linkEthereumOrg'),
				entityFieldAddressKey(EntityType.EthereumConsensusUpgrade, [], 'linkConsensusDocs'),
				entityFieldAddressKey(EntityType.EthereumConsensusUpgrade, [], 'linkForkcast'),
				entityFieldAddressKey(EntityType.EthereumConsensusUpgrade, [], '$$proposals'),
			]).has(fieldAddress))
		))).toBe(true)
	})
})
