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
	import BlockheadRoomPeersView from '$/views/BlockheadRoomPeersView.svelte'
</script>


<svelte:head>
	<title>Contacts • Blockhead</title>
</svelte:head>


<Page>
	<BlockheadRoomPeersView
		href={resolve('/~/multiplayer/contacts')}
		title='Contacts'
		selection={
			select(EntityType._Global, {
				scope: '$$blockheadRoomPeers',
			}).$$blockheadRoomPeers({
				sources: [
					Source.Local_Internal,
				],
				count: true,
			})
		}
		id='blockhead-room-peers'
	/>
</Page>
