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
	import GlobalAiArtifactCatalog_TimestampView from '$/views/_GlobalAiArtifactCatalog_TimestampView.svelte'
</script>


<Page>
	<GlobalAiArtifactCatalog_TimestampView
		selection={select(EntityType._GlobalAiArtifactCatalog_Timestamp, data.selector)}
	/>
</Page>
