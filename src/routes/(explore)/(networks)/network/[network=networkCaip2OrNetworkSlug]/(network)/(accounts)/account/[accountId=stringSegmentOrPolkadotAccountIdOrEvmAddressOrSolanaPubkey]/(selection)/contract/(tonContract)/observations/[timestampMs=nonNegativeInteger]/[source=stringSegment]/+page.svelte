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
	import TonContract_TimestampView from '$/views/TonContract_TimestampView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.TonContract_Timestamp, {
					$contract: data.selector,
					timestampMs: Number(params.timestampMs),
					source: params.source,
				}, {
					sources: [params.source],
				}))}
			<title>{data?.title ?? 'TON contract timestamp'} • TON contract timestamp • Blockhead</title>
		{/key}
	{:else}
		<title>{data?.title ?? 'TON contract timestamp'} • TON contract timestamp • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.TonContract_Timestamp, {
					$contract: data.selector,
					timestampMs: Number(params.timestampMs),
					source: params.source,
				}, {
					sources: [params.source],
				}))}

		<TonContract_TimestampView
			selection={pageSelection}
		/>
		{/key}
	{/if}
</Page>
