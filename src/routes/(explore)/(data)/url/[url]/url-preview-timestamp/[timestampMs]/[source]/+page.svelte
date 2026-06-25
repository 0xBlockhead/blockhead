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
	import UrlPreview_TimestampView from '$/views/UrlPreview_TimestampView.svelte'
</script>


<Page>
	<UrlPreview_TimestampView
		selection={select(EntityType.UrlPreview_Timestamp, data.selector)}
	/>
</Page>
