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


<Page>
	<GlobalAiArtifactCatalogView
		selection={select(EntityType._GlobalAiArtifactCatalog, data.selector)}
	/>
</Page>
