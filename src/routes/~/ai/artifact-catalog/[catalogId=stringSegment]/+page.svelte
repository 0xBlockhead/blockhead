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


	// Components
	import Page from '$/components/Page.svelte'
	import GlobalAiArtifactCatalogView from '$/views/_GlobalAiArtifactCatalogView.svelte'
</script>


<svelte:head>
	<title>{data?.title ?? 'global AI artifact catalog'} • global AI artifact catalog • Blockhead</title>
</svelte:head>


<Page>
	<GlobalAiArtifactCatalogView
		selection={select(EntityType._GlobalAiArtifactCatalog, data.selector)}
	/>
</Page>
