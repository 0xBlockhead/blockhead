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
	import BitTorrentPeer_TimestampView from '$/views/BitTorrentPeer_TimestampView.svelte'
</script>


<Page>
	<BitTorrentPeer_TimestampView
		selection={select(EntityType.BitTorrentPeer_Timestamp, data.selector)}
	/>
</Page>
