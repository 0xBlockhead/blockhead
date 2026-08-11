<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		data,
	}: PageProps = $props()

	const entityViewByType = {
		[EntityType.PolkadotBlock]: PolkadotBlockView,
		[EntityType.UtxoBlock]: UtxoBlockView,
		[EntityType.BittensorBlock]: BittensorBlockView,
		[EntityType.MoneroBlock]: MoneroBlockView,
		[EntityType.NearBlock]: NearBlockView,
		[EntityType.TronBlock]: TronBlockView,
	}

	// Components
	import Page from '$/components/Page.svelte'
	import PolkadotBlockView from '$/views/PolkadotBlockView.svelte'
	import UtxoBlockView from '$/views/UtxoBlockView.svelte'
	import BittensorBlockView from '$/views/BittensorBlockView.svelte'
	import MoneroBlockView from '$/views/MoneroBlockView.svelte'
	import NearBlockView from '$/views/NearBlockView.svelte'
	import TronBlockView from '$/views/TronBlockView.svelte'
</script>


<svelte:head>
	<title>{
		(
			data.entityType === EntityType.PolkadotBlock ?
				((String(data.selector.blockNumber ?? '') ? 'Block #' + String(data.selector.blockNumber ?? '') : '') || (data.selector.hash ?? '') || 'Polkadot block') + ' • Polkadot block • Blockhead'
			:
			data.entityType === EntityType.UtxoBlock ?
				((String(data.selector.height ?? '') ? 'Block #' + String(data.selector.height ?? '') : '') || (data.selector.hash ?? '') || 'UTXO block') + ' • UTXO block • Blockhead'
			:
			data.entityType === EntityType.BittensorBlock ?
				(String(data.selector.blockNumber) || 'Bittensor block') + ' • Bittensor block • Blockhead'
			:
			data.entityType === EntityType.MoneroBlock ?
				(String(data.selector.height) || 'monero block') + ' • monero block • Blockhead'
			:
			data.entityType === EntityType.NearBlock ?
				(String(data.selector.height) || 'near block') + ' • near block • Blockhead'
			:
				(String(data.selector.height) || 'tron block') + ' • tron block • Blockhead'
		)
	}</title>
</svelte:head>


<Page>
	{@const EntityView = entityViewByType[data.entityType]}

	<EntityView
		selection={
			data.entityType === EntityType.PolkadotBlock ?
				select(EntityType.PolkadotBlock, data.selector)
			:
			data.entityType === EntityType.UtxoBlock ?
				select(EntityType.UtxoBlock, data.selector)
			:
			data.entityType === EntityType.BittensorBlock ?
				select(EntityType.BittensorBlock, data.selector, {
					sources: [
						Source.Bittensor_JsonRpc,
					],
				})
			:
			data.entityType === EntityType.MoneroBlock ?
				select(EntityType.MoneroBlock, data.selector, {
					sources: [
						Source.MoneroDaemonRpc_JsonRpc,
						Source.ThreeXpl_Rest,
					],
				})
			:
			data.entityType === EntityType.NearBlock ?
				select(EntityType.NearBlock, data.selector, {
					sources: [
						Source.NearBlocks_Rest,
						Source.NearRpc_JsonRpc,
					],
				})
			:
				select(EntityType.TronBlock, data.selector, {
					sources: [
						Source.TronGrid_Rest,
						Source.TronFullNode_Rest,
						Source.TronSolidityNode_Rest,
						Source.TronScan_Rest,
					],
				})
		}
	/>
</Page>
