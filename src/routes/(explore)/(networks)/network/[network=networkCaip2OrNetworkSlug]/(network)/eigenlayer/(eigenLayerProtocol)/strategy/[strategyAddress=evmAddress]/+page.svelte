<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		data,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import EigenLayerStrategyView from '$/views/EigenLayerStrategyView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.EigenLayerStrategy, data.selector, {
				sources: [
					Source.EigenExplorer_Rest,
				],
			})}
		<title>{data?.title ?? (pageSelection.entitySelector.strategyAddress || 'eigen layer strategy')} • eigen layer strategy • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'eigen layer strategy'} • eigen layer strategy • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.EigenLayerStrategy, data.selector, {
				sources: [
					Source.EigenExplorer_Rest,
				],
			})}

	<EigenLayerStrategyView
		selection={pageSelection}
	/>
	{/if}
</Page>
