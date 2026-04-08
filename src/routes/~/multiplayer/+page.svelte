<script lang="ts">
	// Context
	import { resolve } from '$app/paths'


	// Components
	import BlockheadRoomPeersView from '$/views/BlockheadRoomPeersView.svelte'
	import BlockheadRoomsView from '$/views/BlockheadRoomsView.svelte'
	import Page from '$/components/Page.svelte'
	import GlobalView from '$/views/GlobalView.svelte'
</script>


<Page>
	<GlobalView
		entityId={{}}
		title={'Multiplayer'}
		href={resolve('/~/multiplayer')}
	>
		{#snippet children()}
			<section>
				<BlockheadRoomsView
					href={resolve('/~/multiplayer/rooms')}
					id="multiplayer-rooms"
					open={false}
				/>
			</section>

			<section>
				<BlockheadRoomPeersView
					href={resolve('/~/multiplayer/contacts')}
					id="multiplayer-contacts"
					open={false}
				/>
			</section>
		{/snippet}
	</GlobalView>
</Page>
