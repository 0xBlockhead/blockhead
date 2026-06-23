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
	import GlobalAiModelCatalog_TimestampView from '$/views/_GlobalAiModelCatalog_TimestampView.svelte'
</script>


<Page>
	<GlobalAiModelCatalog_TimestampView
		selection={select(EntityType._GlobalAiModelCatalog_Timestamp, data.selector)}
	/>
</Page>
