<script lang="ts">
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
		entityFieldReference={{
			entityType: EntityType._Global,
			selector: { scope: '$$blockheadRooms' },
			fieldName: '$$blockheadRooms',
		}}
		id="rooms"
	/>
</Page>
