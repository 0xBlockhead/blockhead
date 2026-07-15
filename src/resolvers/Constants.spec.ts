import {
	describe,
	expect,
	it,
} from 'vitest'

import constantsResolvers from '$/resolvers/Constants.ts'
import { EntityMetaKey, entityFieldAddressKey } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { NetworkSelector } from '$/schema/Network.ts'

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

if (networkUpgradesResolver == null)
	throw new Error('Constants spec missing Network.Evm.$$upgrades resolver')

if (networkExecutionUpgradesResolver == null)
	throw new Error('Constants spec missing Network.Evm.$$executionUpgrades resolver')

if (networkConsensusUpgradesResolver == null)
	throw new Error('Constants spec missing Network.Evm.$$consensusUpgrades resolver')

describe('Constants Network upgrade reference materialization', () => {
	it('materializes Network.Evm.$$upgrades with only declared child fields', async () => {
		const upgrades = await networkUpgradesResolver.resolve[NetworkSelector.Caip2]({
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
		const upgrades = await networkExecutionUpgradesResolver.resolve[NetworkSelector.Caip2]({
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
		const upgrades = await networkConsensusUpgradesResolver.resolve[NetworkSelector.Caip2]({
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
