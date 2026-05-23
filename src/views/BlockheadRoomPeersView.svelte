<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { stringify } from 'devalue'

	import type { EntityFieldReference } from '$/schema/$EntityFieldReference.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'


	// Context
	import { resolve } from '$app/paths'


	// Props
	let {
		entityFieldReference = {
			entityType: EntityType._Global,
			entityId: {},
			fieldName: '$$blockheadRoomPeers',
		},
		title = 'Room peers',
		open = $bindable(true),
		collapsible = true,
		href,
		id,
		...entitiesListRest
	}: WithRest<
		{
			entityFieldReference?: EntityFieldReference<
				typeof schema,
				EntityType.BlockheadRoomPeer
			>
			title?: string
			open?: boolean
			href: string
			id: string
		},
		Omit<ComponentProps<typeof EntitiesList>, 'entityType'>
	> = $props()


	// State
	import { derive } from '$/lib/svelte/RemoteResource.svelte.ts'
	import { useEntity } from '$/collections/$queries.svelte.ts'
	import { Source } from '$/sources/$Source.ts'


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import { ListOrientation } from '$/components/ListOrientation.ts'
	import BlockheadRoomPeerView from '$/views/BlockheadRoomPeerView.svelte'
</script>


<EntitiesList
	entityType={EntityType.BlockheadRoomPeer}
	{href}
	{id}
	{title}
	bind:open
	{collapsible}
	{...entitiesListRest}
>
	{#snippet TypeAnnotationTooltip()}
		<p>
			Realtime peers attached to the multiplayer room—who is connected over the mesh for collaboration.
		</p>
		<p>
			Not the same as Farcaster contacts, wallet sessions, or beacon validators.
		</p>
	{/snippet}

	{#snippet Empty()}
		<p data-text="muted">
			No peers yet.
		</p>
	{/snippet}

	{#snippet body()}
		{#if open}
			{@const global = useEntity(
				EntityType._Global,
				entityFieldReference.entityId,
				{
					$: [Source.Local_Internal],
					$$blockheadRoomPeers: {},
				},
			)}
			{@const peers = derive(
				global,
				(global) => (
					global['$$blockheadRoomPeers'] ?? []
				),
			)}
			<EntitiesList
				collapsible={false}
				showSummary={false}
				entityType={EntityType.BlockheadRoomPeer}
				{href}
				id={`${id}-items`}
				{title}
				open={true}
				getKey={(row) => stringify(row[EntityMetaKey.Id])}
				getSortValue={(row) => stringify(row[EntityMetaKey.Id])}
				resource={peers}
				UnorderedListProps={{ orientation: ListOrientation.Column }}
			>
				{#snippet Empty()}
					<p data-text="muted">
						No peers yet.
					</p>
				{/snippet}

				{#snippet Item({ item: row })}
					{#if row}
						<BlockheadRoomPeerView
							entityId={row[EntityMetaKey.Id]}
							href={resolve(
								'/~/(multiplayer)/multiplayer/(contacts)/contact/[contactId]',
								{ contactId: row[EntityMetaKey.Id].id },
							)}
							layout={EntityLayout.Summary}
							open={false}
						/>
					{/if}
				{/snippet}
			</EntitiesList>
		{/if}
	{/snippet}
</EntitiesList>
