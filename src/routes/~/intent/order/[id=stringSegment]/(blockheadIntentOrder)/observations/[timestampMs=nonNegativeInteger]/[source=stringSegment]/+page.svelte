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
		params,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import BlockheadIntentOrder_TimestampView from '$/views/BlockheadIntentOrder_TimestampView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.BlockheadIntentOrder_Timestamp, {
				$order: data.selector,
				timestampMs: Number(params.timestampMs),
				source: params.source,
			}, {
				sources: [params.source],
				fields: {
					status: true,
				},
			})}
		<title>{data?.title ?? (pageSelection.entity == null ? 'blockhead intent order timestamp' : pageSelection.entity.status || 'blockhead intent order timestamp')} • blockhead intent order timestamp • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'blockhead intent order timestamp'} • blockhead intent order timestamp • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.BlockheadIntentOrder_Timestamp, {
				$order: data.selector,
				timestampMs: Number(params.timestampMs),
				source: params.source,
			}, {
				sources: [params.source],
				fields: {
					status: true,
				},
			})}

	<BlockheadIntentOrder_TimestampView
		selection={pageSelection}
	/>
	{/if}
</Page>
