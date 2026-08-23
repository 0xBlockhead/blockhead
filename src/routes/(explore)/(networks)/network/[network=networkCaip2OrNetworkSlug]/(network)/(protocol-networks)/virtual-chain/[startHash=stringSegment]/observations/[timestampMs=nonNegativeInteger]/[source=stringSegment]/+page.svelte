<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'
	import { untrack } from 'svelte'


	// State
	let {
		data,
		params,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import KaspaVirtualChain_TimestampView from '$/views/KaspaVirtualChain_TimestampView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.KaspaVirtualChain_Timestamp, {
					$network: data.selector,
					startHash: params.startHash,
					timestampMs: Number(params.timestampMs),
					source: params.source,
				}, {
					sources: [params.source],
				}))}
			<title>{data?.title ?? 'kaspa virtual chain timestamp'} • kaspa virtual chain timestamp • Blockhead</title>
		{/key}
	{:else}
		<title>{data?.title ?? 'kaspa virtual chain timestamp'} • kaspa virtual chain timestamp • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.KaspaVirtualChain_Timestamp, {
					$network: data.selector,
					startHash: params.startHash,
					timestampMs: Number(params.timestampMs),
					source: params.source,
				}, {
					sources: [params.source],
				}))}

		<KaspaVirtualChain_TimestampView
			selection={pageSelection}
		/>
		{/key}
	{/if}
</Page>
