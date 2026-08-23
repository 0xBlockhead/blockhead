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

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.Market_Derivative_Timestamp, {
		$market: data.selector,
		timestampMs: Number(params.timestampMs),
		feedKey: decodeURIComponent(params.feedKey),
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import Market_Derivative_TimestampView from '$/views/Market_Derivative_TimestampView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? (pageSelection.entitySelector.feedKey || 'market derivative timestamp')} • market derivative timestamp • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'market derivative timestamp'} • market derivative timestamp • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<Market_Derivative_TimestampView
		selection={pageSelection}
	/>
	{/if}
</Page>
