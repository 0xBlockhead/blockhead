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
		params,
	}: PageProps = $props()

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.Market_Timestamp, {
		$market: data.selector.$market,
		timestampMs: Number(params.timestampMs),
		feedKey: decodeURIComponent(params.feedKey),
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import Market_TimestampView from '$/views/Market_TimestampView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? (pageSelection.entitySelector.feedKey || 'market timestamp')} • market timestamp • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'market timestamp'} • market timestamp • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<Market_TimestampView
		selection={pageSelection}
	/>
	{/if}
</Page>
