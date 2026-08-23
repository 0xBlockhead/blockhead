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

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType._GlobalAiModelCatalog, data.selector))


	// Components
	import Page from '$/components/Page.svelte'
	import GlobalAiModelCatalogView from '$/views/_GlobalAiModelCatalogView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? 'global AI model catalog'} • global AI model catalog • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'global AI model catalog'} • global AI model catalog • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<GlobalAiModelCatalogView
		selection={pageSelection}
	/>
	{/if}
</Page>
