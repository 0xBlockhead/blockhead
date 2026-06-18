<script lang="ts">
	import { select } from '$/routes/+layout.svelte'
	// Types/constants
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { resolve } from '$app/paths'


	// Components
	import Page from '$/components/Page.svelte'
	import BlockheadRoomsView from '$/views/BlockheadRoomsView.svelte'
</script>


<Page>
	<BlockheadRoomsView
		href={resolve('/~/multiplayer/rooms')}
		selection={select(
			EntityType._Global,
			{ scope: '$$blockheadRooms' }
		).$$blockheadRooms}
		id="rooms"
	/>
</Page>
