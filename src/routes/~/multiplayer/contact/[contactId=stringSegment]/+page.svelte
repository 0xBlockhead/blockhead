<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		params,
	}: PageProps = $props()

	const pageSelection = $derived(select(EntityType.BlockheadRoomPeer, {
		id: params.contactId,
	}, {
		sources: [
			Source.Local_Internal,
		],
		fields: {
			displayName: true,
			peerId: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import BlockheadRoomPeerView from '$/views/BlockheadRoomPeerView.svelte'
</script>


<svelte:head>
	<title>{pageSelection.entity == null ? 'contact' : (pageSelection.entity.displayName ?? '') || pageSelection.entity.peerId || 'contact'} • contact • Blockhead</title>
</svelte:head>


<Page>
	<BlockheadRoomPeerView
		selection={pageSelection}
	/>
</Page>
