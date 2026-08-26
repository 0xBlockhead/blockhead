<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { getAppClient } from '$/routes/applicationClient.ts'
	const select = getAppClient().select


	// State
	let {
		data,
	}: PageProps = $props()

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.BlockheadBitTorrentClientState, data.selector, {
		fields: {
			clientName: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import BlockheadBitTorrentClientStateView from '$/views/BlockheadBitTorrentClientStateView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? (pageSelection.entity == null ? (pageSelection.entitySelector.clientId ?? '') || 'blockhead bit torrent client state' : (pageSelection.entity.clientName ?? '') || pageSelection.entitySelector.clientId || 'blockhead bit torrent client state')} • blockhead bit torrent client state • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'blockhead bit torrent client state'} • blockhead bit torrent client state • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<BlockheadBitTorrentClientStateView
		selection={pageSelection}
	/>
	{/if}
</Page>
