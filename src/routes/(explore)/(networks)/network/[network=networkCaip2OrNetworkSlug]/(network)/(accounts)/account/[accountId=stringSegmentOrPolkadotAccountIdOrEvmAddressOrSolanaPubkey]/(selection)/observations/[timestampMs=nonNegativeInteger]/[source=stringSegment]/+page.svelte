<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		data,
	}: PageProps = $props()

	const entityViewByType = {
		[EntityType.HyperliquidAccount_Timestamp]: HyperliquidAccount_TimestampView,
		[EntityType.NearAccount_Timestamp]: NearAccount_TimestampView,
	}

	// Components
	import Page from '$/components/Page.svelte'
	import HyperliquidAccount_TimestampView from '$/views/HyperliquidAccount_TimestampView.svelte'
	import NearAccount_TimestampView from '$/views/NearAccount_TimestampView.svelte'
</script>


<svelte:head>
	<title>{
		(
			data.entityType === EntityType.HyperliquidAccount_Timestamp ?
				('hyperliquid account timestamp') + ' • hyperliquid account timestamp • Blockhead'
			:
				(String(data.selector.timestampMs) || 'near account timestamp') + ' • near account timestamp • Blockhead'
		)
	}</title>
</svelte:head>


<Page>
	{@const EntityView = entityViewByType[data.entityType]}

	<EntityView
		selection={
			data.entityType === EntityType.HyperliquidAccount_Timestamp ?
				select(EntityType.HyperliquidAccount_Timestamp, data.selector, {
					sources: [data.selector.source],
				})
			:
				select(EntityType.NearAccount_Timestamp, data.selector, {
					sources: [data.selector.source],
				})
		}
	/>
</Page>
