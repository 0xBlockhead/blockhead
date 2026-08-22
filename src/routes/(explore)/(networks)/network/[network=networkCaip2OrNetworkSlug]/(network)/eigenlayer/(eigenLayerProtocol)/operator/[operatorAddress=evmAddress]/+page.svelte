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

	const pageSelection = $derived(select(EntityType.EigenLayerOperator, data.selector, {
		sources: [
			Source.EigenExplorer_Rest,
		],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import EigenLayerOperatorView from '$/views/EigenLayerOperatorView.svelte'
</script>


<svelte:head>
	<title>{data?.title ?? (pageSelection.entitySelector.operatorAddress || 'eigen layer operator')} • eigen layer operator • Blockhead</title>
</svelte:head>


<Page>
	<EigenLayerOperatorView
		selection={pageSelection}
	/>
</Page>
