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
	import BlockheadSource_TimestampView from '$/views/BlockheadSource_TimestampView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.BlockheadSource_Timestamp, {
				$source: data.selector,
				timestampMs: Number(params.timestampMs),
			})}
		<title>{data?.title ?? (String(pageSelection.entitySelector.timestampMs) || 'blockhead source timestamp')} • blockhead source timestamp • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'blockhead source timestamp'} • blockhead source timestamp • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.BlockheadSource_Timestamp, {
				$source: data.selector,
				timestampMs: Number(params.timestampMs),
			})}

	<BlockheadSource_TimestampView
		selection={pageSelection}
	/>
	{/if}
</Page>
