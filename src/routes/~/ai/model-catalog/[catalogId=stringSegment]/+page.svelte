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
	import GlobalAiModelCatalogView from '$/views/_GlobalAiModelCatalogView.svelte'
</script>


<svelte:head>
	<title>{data?.title ?? 'global AI model catalog'} • global AI model catalog • Blockhead</title>
</svelte:head>


<Page>
	<GlobalAiModelCatalogView
		selection={select(EntityType._GlobalAiModelCatalog, data.selector)}
	/>
</Page>
