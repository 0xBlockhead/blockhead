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
	import AiProviderCatalogEntry_TimestampView from '$/views/AiProviderCatalogEntry_TimestampView.svelte'
</script>


<Page>
	<AiProviderCatalogEntry_TimestampView
		selection={select(EntityType.AiProviderCatalogEntry_Timestamp, data.selector)}
	/>
</Page>
