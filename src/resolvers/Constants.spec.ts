import {
	describe,
	expect,
	it,
} from 'vitest'

import constantsResolvers from '$/resolvers/Constants.ts'
import { CoinId } from '$/constants/Coin.ts'
import { NetworkNamespace, networkBySlug } from '$/constants/Network.ts'
import { networkNamespaceByNamespace } from '$/constants/NetworkNamespace.ts'
import { NetworkStackId } from '$/constants/NetworkStack.ts'
import { EntityMetaKey, entityFieldAddressKey } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { NetworkSelector } from '$/schema/Network.ts'
import { _GlobalIpfsAccessSelector } from '$/schema/_GlobalIpfsAccess.ts'
import { _GlobalSwarmAccessSelector } from '$/schema/_GlobalSwarmAccess.ts'

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
const networkNativeAssetsResolver = constantsResolvers.resolvers.find((resolver) => (
	resolver.entityType === EntityType.Network
	&& '$$nativeAssets' in resolver.projections
))
const networkMevRelaysResolver = constantsResolvers.resolvers.find((resolver) => (
	resolver.entityType === EntityType.Network
	&& 'Evm' in resolver.projections
	&& '$$mevRelays' in resolver.projections.Evm
))
const globalIpfsAccessResolver = constantsResolvers.resolvers.find((resolver) => (
	resolver.entityType === EntityType._GlobalIpfsAccess
))
const globalSwarmAccessResolver = constantsResolvers.resolvers.find((resolver) => (
	resolver.entityType === EntityType._GlobalSwarmAccess
))

if (networkUpgradesResolver == null)
	throw new Error('Constants spec missing Network.Evm.$$upgrades resolver')

if (networkExecutionUpgradesResolver == null)
	throw new Error('Constants spec missing Network.Evm.$$executionUpgrades resolver')

if (networkConsensusUpgradesResolver == null)
	throw new Error('Constants spec missing Network.Evm.$$consensusUpgrades resolver')

if (networkNativeAssetsResolver == null)
	throw new Error('Constants spec missing Network.$$nativeAssets resolver')

if (networkMevRelaysResolver == null)
	throw new Error('Constants spec missing Network.Evm.$$mevRelays resolver')

if (globalIpfsAccessResolver == null)
	throw new Error('Constants spec missing _GlobalIpfsAccess resolver')

if (globalSwarmAccessResolver == null)
	throw new Error('Constants spec missing _GlobalSwarmAccess resolver')

describe('Constants Network upgrade reference materialization', () => {
	it('materializes fixed IPFS and Swarm access hubs without fabricating live fields', async () => {
		await expect(globalIpfsAccessResolver.resolve[
			_GlobalIpfsAccessSelector.Scope
		].resolve({
			scope: '_GlobalIpfsAccess',
		}, resolverContext)).resolves.toEqual({
			scope: '_GlobalIpfsAccess',
		})
		await expect(globalSwarmAccessResolver.resolve[
			_GlobalSwarmAccessSelector.Scope
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

		const network = await networkNativeAssetsResolver.resolve[NetworkSelector.Slug].resolve({
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
			networkMevRelaysResolver.resolve[NetworkSelector.Slug].resolve({ slug: 'cardano' }, resolverContext),
			networkUpgradesResolver.resolve[NetworkSelector.Slug].resolve({ slug: 'cardano' }, resolverContext),
			networkExecutionUpgradesResolver.resolve[NetworkSelector.Slug].resolve({ slug: 'cardano' }, resolverContext),
			networkConsensusUpgradesResolver.resolve[NetworkSelector.Slug].resolve({ slug: 'cardano' }, resolverContext),
		])).resolves.toEqual([
			[],
			[],
			[],
			[],
		])
	})

	it('maps the XRPL native asset to the canonical XRP coin', async () => {
		const network = await networkNativeAssetsResolver.resolve[NetworkSelector.Slug].resolve({
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
		const network = await networkNativeAssetsResolver.resolve[NetworkSelector.Slug].resolve({
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

	it('materializes Network.Evm.$$upgrades with only declared child fields', async () => {
		const upgrades = await networkUpgradesResolver.resolve[NetworkSelector.Caip2].resolve({
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

	it('materializes Network.Evm.$$executionUpgrades with only declared child fields', async () => {
		const upgrades = await networkExecutionUpgradesResolver.resolve[NetworkSelector.Caip2].resolve({
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
		const upgrades = await networkConsensusUpgradesResolver.resolve[NetworkSelector.Caip2].resolve({
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
