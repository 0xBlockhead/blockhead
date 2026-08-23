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

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.CosmosModule, data.selector))


	// Components
	import Page from '$/components/Page.svelte'
	import CosmosModuleView from '$/views/CosmosModuleView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? (pageSelection.entitySelector.moduleName || 'Cosmos module')} • Cosmos module • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'Cosmos module'} • Cosmos module • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<CosmosModuleView
		selection={pageSelection}
	/>
	{/if}
</Page>
