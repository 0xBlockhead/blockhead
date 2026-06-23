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
	import RssFeed_TimestampView from '$/views/RssFeed_TimestampView.svelte'
</script>


<Page>
	<RssFeed_TimestampView
		selection={select(EntityType.RssFeed_Timestamp, data.selector)}
	/>
</Page>
