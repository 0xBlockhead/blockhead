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

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType._GlobalAiArtifactCatalog, data.selector))


	// Components
	import Page from '$/components/Page.svelte'
	import GlobalAiArtifactCatalogView from '$/views/_GlobalAiArtifactCatalogView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? 'global AI artifact catalog'} • global AI artifact catalog • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'global AI artifact catalog'} • global AI artifact catalog • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<GlobalAiArtifactCatalogView
		selection={pageSelection}
	/>
	{/if}
</Page>
