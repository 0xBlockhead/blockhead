<script lang="ts">
	// Types/constants
	import type { ComponentProps, Snippet } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { Source } from '$/sources/$Source.ts'
	import { stringify } from 'devalue'


	// Context
	import { resolve } from '$app/paths'


	// State
	let {
		entityId,
		href = resolve(
			'/~/(multiplayer)/multiplayer/(rooms)/room/[roomId]',
			{ roomId: entityId.id },
		),
		open = $bindable(true),
		collapsible = true,
		...EntityViewProps
	}: WithRest<
		{
			entityId: EntityId<typeof schema, EntityType.BlockheadRoom>
			href?: string
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'layout'
			| 'showTypeAnnotation'
		>
	> = $props()


	// State
	import { useEntity } from '$/collections/$queries.svelte.ts'

	const room = useEntity(
		EntityType.BlockheadRoom,
		entityId,
		{
			$: [
				Source.Local_Internal,
			],
			name: {},
			...(open ?
				{
					createdAt: {},
					createdBy: {},
				}
			:
				{}),
		},
	)


	// Components
	import BlockheadRoomPeersView from '$/views/BlockheadRoomPeersView.svelte'
	import EntityDetails from '$/components/EntityDetails.svelte'
	import EntityView from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
</script>


<EntityView
	entityType={EntityType.BlockheadRoom}
	{entityId}
	href={href}
	bind:open
	{...EntityViewProps}
>
	{#snippet Value()}
		<span>
			{entityId.id}
		</span>
	{/snippet}

	{#snippet Title()}
		{@render Value()}
	{/snippet}

	{#snippet Heading()}
		<ResourceBoundary
			resource={room}
			placeholderText="Loading room…"
		>
			{#snippet children(loadedRoom)}
				{loadedRoom.name ?? entityId.id}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet TypeAnnotationTooltip()}
		<p>
			Realtime room records identify a shared session: display name, host metadata, and stable room id for presence sync.
		</p>
		<p>
			Membership and permissions are carried on companion peer rows; rooms themselves are not XMPP MUC transcripts or IPFS DAGs.
		</p>
	{/snippet}

	{#snippet Content({ title: _title, href: _href })}
		<dl>

			<div>
				<dt>Room kind</dt>
				<dd>
					Realtime collaboration workspace.
				</dd>
			</div>

			{#if open}
				<div>
					<dt>Created</dt>
					<dd>
						<ResourceBoundary
							resource={room}
							placeholderText="Loading room…"
						>
							{#snippet children(loadedRoom)}
								{#if loadedRoom.createdAt !== undefined}
									<Timestamp
										timestamp={loadedRoom.createdAt}
									/>
								{/if}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>

				<div>
					<dt>Opened by</dt>
					<dd>
						<ResourceBoundary
							resource={room}
							placeholderText="Loading room…"
						>
							{#snippet children(loadedRoom)}
								{#if (
									room.createdBy !== undefined
									&& room.createdBy !== ''
								)}
									{loadedRoom.createdBy}
								{/if}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>
			{/if}
		</dl>
	{/snippet}

	{#snippet Details({
		open: detailsOpen,
	})}
		<EntityDetails
			entityType={EntityType.BlockheadRoom}
			{entityId}
		/>
	{/snippet}
</EntityView>

