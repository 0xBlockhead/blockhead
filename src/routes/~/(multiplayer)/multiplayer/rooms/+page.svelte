<script lang="ts">
	// Context
	import { resolve } from '$app/paths'

	import { EntityType } from '$/schema/$EntityType.ts'


	// Components
	import Page from '$/components/Page.svelte'
	import BlockheadRoomsView from '$/views/BlockheadRoomsView.svelte'
</script>


<Page>
	<BlockheadRoomsView
		entityFieldReference={{
			entityType: EntityType._Global,
			entityId: {},
			fieldName: '$$blockheadRooms',
		}}
		href={resolve('/~/multiplayer/rooms')}
		id="rooms"
	/>
</Page>
