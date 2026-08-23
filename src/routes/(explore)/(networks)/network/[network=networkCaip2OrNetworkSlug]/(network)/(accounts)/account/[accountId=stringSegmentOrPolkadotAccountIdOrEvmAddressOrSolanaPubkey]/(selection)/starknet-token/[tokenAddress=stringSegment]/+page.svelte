<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'
	import { untrack } from 'svelte'


	// State
	let {
		data,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import StarknetTokenHoldingView from '$/views/StarknetTokenHoldingView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.StarknetTokenHolding, data.selector, {
					sources: [
						Source.Starkscan,
					],
				}))}
			<title>{data?.title ?? 'starknet token holding'} • starknet token holding • Blockhead</title>
		{/key}
	{:else}
		<title>{data?.title ?? 'starknet token holding'} • starknet token holding • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.StarknetTokenHolding, data.selector, {
					sources: [
						Source.Starkscan,
					],
				}))}

		<StarknetTokenHoldingView
			selection={pageSelection}
		/>
		{/key}
	{/if}
</Page>
