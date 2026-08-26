<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { getAppClient } from '$/routes/applicationClient.ts'
	const select = getAppClient().select


	// Components
	import Page from '$/components/Page.svelte'
	import BlockheadRoomsView from '$/views/BlockheadRoomsView.svelte'
</script>


<svelte:head>
	<title>Rooms • Blockhead</title>
</svelte:head>


<Page>
	{@const collectionSelection = select(EntityType._Global, {
		scope: '$$blockheadRooms',
	}).$$blockheadRooms}

	<BlockheadRoomsView
		href={resolve('/~/multiplayer/rooms')}
		selection={collectionSelection}
		countResource={collectionSelection.count}
		id='blockhead-rooms'
	/>
</Page>
