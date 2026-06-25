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
	import BlockheadBitTorrentTransfer_TimestampView from '$/views/BlockheadBitTorrentTransfer_TimestampView.svelte'
</script>


<Page>
	<BlockheadBitTorrentTransfer_TimestampView
		selection={select(EntityType.BlockheadBitTorrentTransfer_Timestamp, data.selector)}
	/>
</Page>
