<!-- Generated from APP.ts. -->

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

	const pageSelection = $derived(select(EntityType.BlockheadBitTorrentClientState, data.selector, {
		fields: {
			clientName: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import BlockheadBitTorrentClientStateView from '$/views/BlockheadBitTorrentClientStateView.svelte'
</script>


<svelte:head>
	<title>{data?.title ?? (pageSelection.entity == null ? (pageSelection.entitySelector.clientId ?? '') || 'blockhead bit torrent client state' : (pageSelection.entity.clientName ?? '') || pageSelection.entitySelector.clientId || 'blockhead bit torrent client state')} • blockhead bit torrent client state • Blockhead</title>
</svelte:head>


<Page>
	<BlockheadBitTorrentClientStateView
		selection={pageSelection}
	/>
</Page>
