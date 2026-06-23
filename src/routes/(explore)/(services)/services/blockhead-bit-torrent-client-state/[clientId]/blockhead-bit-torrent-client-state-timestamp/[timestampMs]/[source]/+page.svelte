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
	import BlockheadBitTorrentClientState_TimestampView from '$/views/BlockheadBitTorrentClientState_TimestampView.svelte'
</script>


<Page>
	<BlockheadBitTorrentClientState_TimestampView
		selection={select(EntityType.BlockheadBitTorrentClientState_Timestamp, data.selector)}
	/>
</Page>
