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
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import CosmosModuleView from '$/views/CosmosModuleView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.CosmosModule, data.selector))}
			<title>{data?.title ?? (pageSelection.entitySelector.moduleName || 'Cosmos module')} • Cosmos module • Blockhead</title>
		{/key}
	{:else}
		<title>{data?.title ?? 'Cosmos module'} • Cosmos module • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.CosmosModule, data.selector))}

		<CosmosModuleView
			selection={pageSelection}
		/>
		{/key}
	{/if}
</Page>
