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
	import EvmTraceView from '$/views/EvmTraceView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.EvmTrace, {
					$transaction: data.selector,
					traceAddress: params.traceAddress,
				}, {
					fields: {
						index: true,
					},
				}))}
			<title>{data?.title ?? (pageSelection.entity == null ? 'EVM trace' : (String(pageSelection.entity.index ?? '') ? 'Trace #' + String(pageSelection.entity.index ?? '') : '') || (pageSelection.entitySelector.traceAddress ?? '') || 'EVM trace')} • EVM trace • Blockhead</title>
		{/key}
	{:else}
		<title>{data?.title ?? 'EVM trace'} • EVM trace • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.EvmTrace, {
					$transaction: data.selector,
					traceAddress: params.traceAddress,
				}, {
					fields: {
						index: true,
					},
				}))}

		<EvmTraceView
			selection={pageSelection}
		/>
		{/key}
	{/if}
</Page>
