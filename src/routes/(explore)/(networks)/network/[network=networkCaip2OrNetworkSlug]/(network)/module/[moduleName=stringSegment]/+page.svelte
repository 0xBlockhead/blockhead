<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		data,
	}: PageProps = $props()

	const pageSelection = $derived(select(EntityType.CosmosModule, data.selector))


	// Components
	import Page from '$/components/Page.svelte'
	import CosmosModuleView from '$/views/CosmosModuleView.svelte'
</script>


<svelte:head>
	<title>{data?.title ?? (pageSelection.entitySelector.moduleName || 'Cosmos module')} • Cosmos module • Blockhead</title>
</svelte:head>


<Page>
	<CosmosModuleView
		selection={pageSelection}
	/>
</Page>
