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
	import BitTorrentDhtLookup_TimestampView from '$/views/BitTorrentDhtLookup_TimestampView.svelte'
</script>


<Page>
	<BitTorrentDhtLookup_TimestampView
		selection={select(EntityType.BitTorrentDhtLookup_Timestamp, data.selector)}
	/>
</Page>
