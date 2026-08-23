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

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.EigenLayerStrategy, data.selector, {
		sources: [
			Source.EigenExplorer_Rest,
		],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import EigenLayerStrategyView from '$/views/EigenLayerStrategyView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? (pageSelection.entitySelector.strategyAddress || 'eigen layer strategy')} • eigen layer strategy • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'eigen layer strategy'} • eigen layer strategy • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<EigenLayerStrategyView
		selection={pageSelection}
	/>
	{/if}
</Page>
