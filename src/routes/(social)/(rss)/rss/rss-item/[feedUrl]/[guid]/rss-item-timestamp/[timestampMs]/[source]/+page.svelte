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
	import RssItem_TimestampView from '$/views/RssItem_TimestampView.svelte'
</script>


<Page>
	<RssItem_TimestampView
		selection={select(EntityType.RssItem_Timestamp, data.selector)}
	/>
</Page>
