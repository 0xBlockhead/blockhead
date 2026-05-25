<script lang="ts">
	// Types/constants
	import { EntityType } from '$/schema/$EntityType.ts'


	// Context
	import { resolve } from '$app/paths'


	// State
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
		entityId={{}}
		title={'Multiplayer'}
		href={resolve('/~/multiplayer')}
	>
		{#snippet children({ open: hubOpen,
		})}
			<CollapsibleTabs
				id={`${hubKey}:hub`}
				{...{ 'data-card': '' }}
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

				{#snippet Markers({ open: _markersOpen })}
					<a
						data-scroll-marker-label="Rooms"
						href={`#${hubKey}:rooms`}
					>Rooms</a>
					<a
						data-scroll-marker-label="Contacts"
						href={`#${hubKey}:contacts`}
					>Contacts</a>
				{/snippet}

				{#snippet body({ open: _paneOpen })}
					<section
						id={`${hubKey}:rooms`}
						data-scroll-marker-label="Rooms"
					>
						<BlockheadRoomsView
							href={resolve('/~/multiplayer/rooms')}
							entityFieldReference={{
								entityType: EntityType._Global,
								entityId: {},
								fieldName: '$$blockheadRooms',
							}}
							id="rooms"
							open={hubOpen}
						/>
					</section>

					<section
						id={`${hubKey}:contacts`}
						data-scroll-marker-label="Contacts"
					>
						<BlockheadRoomPeersView
							href={resolve('/~/multiplayer/contacts')}
							entityFieldReference={{
								entityType: EntityType._Global,
								entityId: {},
								fieldName: '$$blockheadRoomPeers',
							}}
							id="contacts"
							open={hubOpen}
						/>
					</section>
				{/snippet}
			</CollapsibleTabs>
		{/snippet}
	</GlobalView>
</Page>
