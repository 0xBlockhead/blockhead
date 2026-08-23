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
	import Market_TimestampView from '$/views/Market_TimestampView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.Market_Timestamp, {
				$market: data.selector.$market,
				timestampMs: Number(params.timestampMs),
				feedKey: decodeURIComponent(params.feedKey),
			})}
		<title>{data?.title ?? (pageSelection.entitySelector.feedKey || 'market timestamp')} • market timestamp • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'market timestamp'} • market timestamp • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.Market_Timestamp, {
				$market: data.selector.$market,
				timestampMs: Number(params.timestampMs),
				feedKey: decodeURIComponent(params.feedKey),
			})}

	<Market_TimestampView
		selection={pageSelection}
	/>
	{/if}
</Page>
