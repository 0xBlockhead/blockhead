<script lang="ts">
	// Types/constants
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { resolve } from '$app/paths'


	const hubKey = 'multiplayer'


	// Components
	import BlockheadRoomPeersView from '$/views/BlockheadRoomPeersView.svelte'
	import BlockheadRoomsView from '$/views/BlockheadRoomsView.svelte'
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import Page from '$/components/Page.svelte'
	import GlobalView from '$/views/GlobalView.svelte'
</script>


<Page>
	<GlobalView
		entityId={{ scope: 'Multiplayer' }}
		title={'Multiplayer'}
		href={resolve('/~/multiplayer')}
	>
		{#snippet children({ open: hubOpen,
		})}
			<CollapsibleTabs
				id={`${hubKey}:hub`}
				sectionIdPrefix={hubKey}
				sections={[
					{ id: 'rooms', label: 'Rooms' },
					{ id: 'contacts', label: 'Contacts' },
				]}
				data-card
				scrollContainerProps={{
					'data-row': 'start align-start',
					style: '--carousel-basis: 40ch',
				}}
			>
				{#snippet Summary({ open: _summaryOpen })}
					<header
						data-row-item="flexible"
						data-row="wrap gap-4"
					>
						<HeadingComponent>
							Multiplayer
						</HeadingComponent>
					</header>
				{/snippet}

				{#snippet SectionRooms({ id, label })}
					<BlockheadRoomsView
						href={resolve('/~/multiplayer/rooms')}
						entityFieldReference={{
							entityType: EntityType._Global,
							entityId: { scope: '$$blockheadRooms' },
							fieldName: '$$blockheadRooms',
						}}
						id="rooms"
						open={hubOpen}
					/>
				{/snippet}

				{#snippet SectionContacts({ id, label })}
					<BlockheadRoomPeersView
						href={resolve('/~/multiplayer/contacts')}
						entityFieldReference={{
							entityType: EntityType._Global,
							entityId: { scope: '$$blockheadRoomPeers' },
							fieldName: '$$blockheadRoomPeers',
						}}
						id="contacts"
						open={hubOpen}
					/>
				{/snippet}
		</CollapsibleTabs>
		{/snippet}
	</GlobalView>
</Page>
