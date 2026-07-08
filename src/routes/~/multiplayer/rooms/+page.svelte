<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { resolve } from '$app/paths'
	import { select } from '$/routes/+layout.svelte'


	// Components
	import Page from '$/components/Page.svelte'
	import BlockheadRoomsView from '$/views/BlockheadRoomsView.svelte'
</script>


<svelte:head>
	<title>Rooms • Blockhead</title>
</svelte:head>


<Page>
	<BlockheadRoomsView
		href={resolve('/~/multiplayer/rooms')}
		title='Rooms'
		selection={
			select(EntityType._Global, {
				scope: '$$blockheadRooms',
			}).$$blockheadRooms({
				sources: [
					Source.Local_Internal,
				],
			})
		}
		id='blockhead-rooms'
	/>
</Page>
