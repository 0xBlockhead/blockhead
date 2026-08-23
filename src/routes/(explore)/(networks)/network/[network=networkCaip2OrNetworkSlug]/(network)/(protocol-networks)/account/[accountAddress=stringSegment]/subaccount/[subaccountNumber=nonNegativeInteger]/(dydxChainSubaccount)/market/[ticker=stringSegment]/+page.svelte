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
	import DydxChainPerpetualPositionView from '$/views/DydxChainPerpetualPositionView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.DydxChainPerpetualPosition, data.selector, {
					sources: [
						Source.DydxIndexer,
					],
				}))}
			<title>{data?.title ?? 'dydx chain open perpetual position'} • dydx chain open perpetual position • Blockhead</title>
		{/key}
	{:else}
		<title>{data?.title ?? 'dydx chain open perpetual position'} • dydx chain open perpetual position • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.DydxChainPerpetualPosition, data.selector, {
					sources: [
						Source.DydxIndexer,
					],
				}))}

		<DydxChainPerpetualPositionView
			selection={pageSelection}
		/>
		{/key}
	{/if}
</Page>
