<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import { getAppClient } from '$/routes/applicationClient.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import BlockheadRoomPeersView from '$/views/BlockheadRoomPeersView.svelte'
	import BlockheadRoomsView from '$/views/BlockheadRoomsView.svelte'
	import { resolve } from '$app/paths'


	// Context
	const select = getAppClient().select


	// Components
	import Page from '$/components/Page.svelte'
</script>


<svelte:head>
	<title>Multiplayer • Blockhead</title>
</svelte:head>


<Page>
	<CollapsibleTabs
		id='multiplayer:hub'
		sectionIdPrefix='multiplayer'
		sections={[
			{ id: 'rooms', label: 'Rooms' },
			{ id: 'contacts', label: 'Contacts' },
		]}
		data-card
	>
		{#snippet Summary({ open: _open })}
			<header
				data-row-item='flexible'
				data-row='wrap gap-4'
			>
				<HeadingComponent>Multiplayer</HeadingComponent>
			</header>
		{/snippet}

		{#snippet SectionRooms()}
			<BlockheadRoomsView
				href={resolve('/~/multiplayer/rooms')}
				selection={select(EntityType._Global, { scope: '$$blockheadRooms' }).$$blockheadRooms}
				id='rooms'
				open={true}
				data-column-item='flexible'
				data-card
				data-scroll-container
			/>
		{/snippet}

		{#snippet SectionContacts()}
			<BlockheadRoomPeersView
				href={resolve('/~/multiplayer/contacts')}
				selection={select(EntityType._Global, { scope: '$$blockheadRoomPeers' }).$$blockheadRoomPeers}
				id='contacts'
				open={true}
				data-column-item='flexible'
				data-card
				data-scroll-container
			/>
		{/snippet}
	</CollapsibleTabs>
</Page>
