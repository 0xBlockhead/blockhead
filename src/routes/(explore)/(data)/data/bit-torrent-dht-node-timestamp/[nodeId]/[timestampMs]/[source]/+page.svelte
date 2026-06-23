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
	import BitTorrentDhtNode_TimestampView from '$/views/BitTorrentDhtNode_TimestampView.svelte'
</script>


<Page>
	<BitTorrentDhtNode_TimestampView
		selection={select(EntityType.BitTorrentDhtNode_Timestamp, data.selector)}
	/>
</Page>
