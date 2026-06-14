<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntitySelector } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { subscribe } from '$/routes/+layout.svelte'
	import { resolve } from '$app/paths'


	// State
	let {
		selector,
		href = resolve(
			'/~/(multiplayer)/multiplayer/(rooms)/room/[roomId]',
			{ roomId: selector.id },
		),
		open = $bindable(true),
		collapsible = true,
		...EntityViewProps
	}: WithRest<
		{
			selector: EntitySelector<typeof schema, EntityType.BlockheadRoom>
			href?: string
			open?: boolean
			collapsible?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'layout'
			| 'showTypeAnnotation'
		>
	> = $props()

	const room = subscribe(EntityType.BlockheadRoom,
		selector,
		({ sources: [
				Source.Local_Internal,
			], fields: { name: true, ...(open ? ({ createdAt: true, createdBy: true, $$peers: true }) : ({  })) } }),
	)


	// Components
	import EntityView from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import BlockheadRoomPeersView from '$/views/BlockheadRoomPeersView.svelte'
</script>


<EntityView
	entityType={EntityType.BlockheadRoom}
	entitySelector={selector}
	href={href}
	bind:open
	{...EntityViewProps}
>
	{#snippet Value()}
		<span>
			{selector.id}
		</span>
	{/snippet}

	{#snippet Title()}
		<ResourceBoundary
			resource={room}
			placeholderText="Loading room…"
		>
			{#snippet children(room)}
				{room.fields.name ?? selector.id}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet TypeAnnotationTooltip()}
		<p>
			Realtime room records identify a shared session: display name, host metadata, and stable room id for presence sync.
		</p>
		<p>
			Membership and permissions are carried on companion peer blockheadRooms; rooms themselves are not XMPP MUC transcripts or IPFS DAGs.
		</p>
	{/snippet}

	{#snippet Content({})}
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
							{#snippet children(room)}
								{#if room.fields.createdAt !== undefined}
									<Timestamp
										timestamp={room.fields.createdAt}
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
							{#snippet children(room)}
								{#if (
									room.fields.createdBy !== undefined
									&& room.fields.createdBy !== ''
								)}
									{room.fields.createdBy}
								{/if}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>
			{/if}
		</dl>
	{/snippet}

	{#snippet Details({
		open,
	})}
		{#if open}
			<BlockheadRoomPeersView
				entityFieldReference={{
					entityType: EntityType.BlockheadRoom,
					selector,
					fieldName: '$$peers',
				}}
				id={`${selector.id}:peers`}
			/>
		{/if}
	{/snippet}
</EntityView>
