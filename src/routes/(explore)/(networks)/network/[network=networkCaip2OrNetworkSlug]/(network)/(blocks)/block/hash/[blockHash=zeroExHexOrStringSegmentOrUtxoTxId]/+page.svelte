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

	const pageSelection = $derived(
		(
			data.entityType === EntityType.EvmBlock ?
				select(EntityType.EvmBlock, data.selector, {
					sources: [
						Source.SqdPortal_RawHttp,
						Source.Voltaire_JsonRpc,
						Source.Blobscan_Rest,
						Source.Blockscout_Rest,
					],
					fields: {
						blockNumber: true,
					},
				})
			:
			data.entityType === EntityType.ArweaveBlock ?
				select(EntityType.ArweaveBlock, data.selector, {
					fields: {
						height: true,
					},
				})
			:
			data.entityType === EntityType.CardanoBlock ?
				select(EntityType.CardanoBlock, data.selector)
			:
			data.entityType === EntityType.CosmosBlock ?
				select(EntityType.CosmosBlock, data.selector, {
					fields: {
						height: true,
					},
				})
			:
				select(EntityType.HederaBlock, data.selector)
		)
	)
	const entityViewByType = {
		[EntityType.EvmBlock]: EvmBlockView,
		[EntityType.ArweaveBlock]: ArweaveBlockView,
		[EntityType.CardanoBlock]: CardanoBlockView,
		[EntityType.CosmosBlock]: CosmosBlockView,
		[EntityType.HederaBlock]: HederaBlockView,
	}

	// Components
	import Page from '$/components/Page.svelte'
	import EvmBlockView from '$/views/EvmBlockView.svelte'
	import ArweaveBlockView from '$/views/ArweaveBlockView.svelte'
	import CardanoBlockView from '$/views/CardanoBlockView.svelte'
	import CosmosBlockView from '$/views/CosmosBlockView.svelte'
	import HederaBlockView from '$/views/HederaBlockView.svelte'
</script>


<svelte:head>
	<title>{
		(
			data.entityType === EntityType.EvmBlock ?
				(pageSelection.entity == null ? 'EVM block' : (String(pageSelection.entity.blockNumber ?? '') ? 'Block #' + String(pageSelection.entity.blockNumber ?? '') : '') || (data.selector.hash ?? '') || 'EVM block') + ' • EVM block • Blockhead'
			:
			data.entityType === EntityType.ArweaveBlock ?
				(pageSelection.entity == null ? (data.selector.indepHash ?? '') || 'arweave block' : String(pageSelection.entity.height) || data.selector.indepHash || 'arweave block') + ' • arweave block • Blockhead'
			:
			data.entityType === EntityType.CardanoBlock ?
				(data.selector.hash || 'Cardano block') + ' • Cardano block • Blockhead'
			:
			data.entityType === EntityType.CosmosBlock ?
				(pageSelection.entity == null ? 'Cosmos block' : (String(pageSelection.entity.height ?? '') ? 'Block #' + String(pageSelection.entity.height ?? '') : '') || (data.selector.hash ?? '') || 'Cosmos block') + ' • Cosmos block • Blockhead'
			:
				('hedera block') + ' • hedera block • Blockhead'
		)
	}</title>
</svelte:head>


<Page>
	{@const EntityView = entityViewByType[data.entityType]}

	<EntityView
		selection={pageSelection}
	/>
</Page>
