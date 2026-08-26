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

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.TonTrace, data.selector, {
		sources: [data.selector.source],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import TonTraceView from '$/views/TonTraceView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? 'TON trace'} • TON trace • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'TON trace'} • TON trace • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<TonTraceView
		selection={pageSelection}
	/>
	{/if}
</Page>
