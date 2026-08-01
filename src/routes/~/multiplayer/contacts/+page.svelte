<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// Components
	import Page from '$/components/Page.svelte'
	import BlockheadRoomPeersView from '$/views/BlockheadRoomPeersView.svelte'
</script>


<svelte:head>
	<title>Contacts • Blockhead</title>
</svelte:head>


<Page>
	{@const collectionSelection = select(EntityType._Global, {
		scope: '$$blockheadRoomPeers',
	}).$$blockheadRoomPeers}

	<BlockheadRoomPeersView
		href={resolve('/~/multiplayer/contacts')}
		selection={collectionSelection}
		countResource={collectionSelection.count}
		id='blockhead-room-peers'
	/>
</Page>
