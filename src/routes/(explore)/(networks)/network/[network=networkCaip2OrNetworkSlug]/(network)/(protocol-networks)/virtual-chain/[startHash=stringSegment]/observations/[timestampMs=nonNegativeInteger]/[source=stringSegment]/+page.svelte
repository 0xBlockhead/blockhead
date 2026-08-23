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

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.KaspaVirtualChain_Timestamp, {
		$network: data.selector,
		startHash: params.startHash,
		timestampMs: Number(params.timestampMs),
		source: params.source,
	}, {
		sources: [params.source],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import KaspaVirtualChain_TimestampView from '$/views/KaspaVirtualChain_TimestampView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? 'kaspa virtual chain timestamp'} • kaspa virtual chain timestamp • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'kaspa virtual chain timestamp'} • kaspa virtual chain timestamp • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<KaspaVirtualChain_TimestampView
		selection={pageSelection}
	/>
	{/if}
</Page>
