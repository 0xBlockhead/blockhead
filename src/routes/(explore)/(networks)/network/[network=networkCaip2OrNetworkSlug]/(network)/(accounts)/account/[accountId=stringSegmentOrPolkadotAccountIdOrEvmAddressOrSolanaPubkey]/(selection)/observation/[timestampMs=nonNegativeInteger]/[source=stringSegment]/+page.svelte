<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { getAppClient } from '$/routes/applicationClient.ts'
	const select = getAppClient().select


	// State
	let {
		data,
	}: PageProps = $props()

	const pageSelection = $derived(
		(
			data.entityType === EntityType.PolkadotAccount_Timestamp ?
				select(EntityType.PolkadotAccount_Timestamp, data.selector, {
					sources: [data.selector.source],
				})
			:
			data.entityType === EntityType.CosmosAccount_Timestamp ?
				select(EntityType.CosmosAccount_Timestamp, data.selector, {
					sources: [data.selector.source],
				})
			:
			data.entityType === EntityType.EvmNetworkAccount_Timestamp ?
				select(EntityType.EvmNetworkAccount_Timestamp, data.selector, {
					sources: [data.selector.source],
				})
			:
			data.entityType === EntityType.HederaAccount_Timestamp ?
				select(EntityType.HederaAccount_Timestamp, data.selector, {
					sources: [data.selector.source],
					fields: {
						balanceTinybar: true,
					},
				})
			:
			data.entityType === EntityType.TonAccount_Timestamp ?
				select(EntityType.TonAccount_Timestamp, data.selector, {
					sources: [data.selector.source],
					fields: {
						balanceNano: true,
					},
				})
			:
				select(EntityType.TronAccount_Timestamp, data.selector, {
					sources: [data.selector.source],
				})
		)
	)
	const entityViewByType = {
		[EntityType.PolkadotAccount_Timestamp]: PolkadotAccount_TimestampView,
		[EntityType.CosmosAccount_Timestamp]: CosmosAccount_TimestampView,
		[EntityType.EvmNetworkAccount_Timestamp]: EvmNetworkAccount_TimestampView,
		[EntityType.HederaAccount_Timestamp]: HederaAccount_TimestampView,
		[EntityType.TonAccount_Timestamp]: TonAccount_TimestampView,
		[EntityType.TronAccount_Timestamp]: TronAccount_TimestampView,
	}

	// Components
	import Page from '$/components/Page.svelte'
	import PolkadotAccount_TimestampView from '$/views/PolkadotAccount_TimestampView.svelte'
	import CosmosAccount_TimestampView from '$/views/CosmosAccount_TimestampView.svelte'
	import EvmNetworkAccount_TimestampView from '$/views/EvmNetworkAccount_TimestampView.svelte'
	import HederaAccount_TimestampView from '$/views/HederaAccount_TimestampView.svelte'
	import TonAccount_TimestampView from '$/views/TonAccount_TimestampView.svelte'
	import TronAccount_TimestampView from '$/views/TronAccount_TimestampView.svelte'
</script>


<svelte:head>
	<title>{
		(
			data.entityType === EntityType.PolkadotAccount_Timestamp ?
				(data.selector.source || 'Polkadot account timestamp') + ' • Polkadot account timestamp • Blockhead'
			:
			data.entityType === EntityType.CosmosAccount_Timestamp ?
				(data.selector.source || 'Cosmos account timestamp') + ' • Cosmos account timestamp • Blockhead'
			:
			data.entityType === EntityType.EvmNetworkAccount_Timestamp ?
				('EVM network account timestamp') + ' • EVM network account timestamp • Blockhead'
			:
			data.entityType === EntityType.HederaAccount_Timestamp ?
				(pageSelection.entity == null ? 'hedera account timestamp' : String(pageSelection.entity.balanceTinybar ?? '') || 'hedera account timestamp') + ' • hedera account timestamp • Blockhead'
			:
			data.entityType === EntityType.TonAccount_Timestamp ?
				(pageSelection.entity == null ? 'TON account timestamp' : String(pageSelection.entity.balanceNano ?? '') || 'TON account timestamp') + ' • TON account timestamp • Blockhead'
			:
				('tron account timestamp') + ' • tron account timestamp • Blockhead'
		)
	}</title>
</svelte:head>


<Page>
	{@const EntityView = entityViewByType[data.entityType]}

	<EntityView
		selection={pageSelection}
	/>
</Page>
