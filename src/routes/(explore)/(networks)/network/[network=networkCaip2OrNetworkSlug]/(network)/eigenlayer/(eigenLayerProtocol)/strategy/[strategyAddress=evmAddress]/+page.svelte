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

	const pageSelection = $derived(select(EntityType.EigenLayerStrategy, data.selector, {
		sources: [
			Source.EigenExplorer_Rest,
		],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import EigenLayerStrategyView from '$/views/EigenLayerStrategyView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? (pageSelection.entitySelector.strategyAddress || 'eigen layer strategy')} • eigen layer strategy • Blockhead</title>
</svelte:head>


<Page>
	<EigenLayerStrategyView
		selection={pageSelection}
	/>
</Page>
