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
	import TonTraceView from '$/views/TonTraceView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.TonTrace, {
					$rootMessage: data.selector,
					source: params.source,
				}, {
					sources: [params.source],
				}))}
			<title>{data?.title ?? 'TON trace'} • TON trace • Blockhead</title>
		{/key}
	{:else}
		<title>{data?.title ?? 'TON trace'} • TON trace • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.TonTrace, {
					$rootMessage: data.selector,
					source: params.source,
				}, {
					sources: [params.source],
				}))}

		<TonTraceView
			selection={pageSelection}
		/>
		{/key}
	{/if}
</Page>
