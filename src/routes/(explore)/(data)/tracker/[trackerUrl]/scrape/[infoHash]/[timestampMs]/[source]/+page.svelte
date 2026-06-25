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
	import BitTorrentTrackerScrape_TimestampView from '$/views/BitTorrentTrackerScrape_TimestampView.svelte'
</script>


<Page>
	<BitTorrentTrackerScrape_TimestampView
		selection={select(EntityType.BitTorrentTrackerScrape_Timestamp, data.selector)}
	/>
</Page>
