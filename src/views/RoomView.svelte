<script lang="ts">
	// Types/constants
	import type { ComponentProps, Snippet } from 'svelte'

	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import { schema } from '$/schema/index.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'


	// Props
	let {
		children,
		entityId,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...entityViewRest
	}: WithRest<
		{
			children?: Snippet
			entityId: EntityId<typeof schema, EntityType.BlockheadRoom>
			href: string
			layout?: EntityLayout
			open?: boolean
		},
		Omit<
			ComponentProps<typeof EntityView>,
			| 'entityType'
			| 'entityId'
			| 'href'
			| 'open'
			| 'layout'
			| 'title'
			| 'Heading'
			| 'Details'
			| 'Content'
		>
	> = $props()


	// State
	import { useEntity } from '$/collections/$queries.svelte.ts'
	import { Source } from '$/sources/$Source.ts'

	const room = useEntity(
		EntityType.BlockheadRoom,
		entityId,
		{
			$: [
				Source.Local_Internal,
			],
			name: {},
			createdAt: {},
			createdBy: {},
		},
	)


	// Components
	import EntityDetails from '$/components/EntityDetails.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp, { TimestampFormat } from '$/components/Timestamp.svelte'
	import Tooltip from '$/components/Tooltip.svelte'
</script>


<EntityView
	entityType={EntityType.BlockheadRoom}
	{entityId}
	{href}
	{layout}
	bind:open
	{...entityViewRest}
>
	{#snippet Id()}
		<span data-text="font-monospace">
			{entityId.id}
		</span>
	{/snippet}



	{#snippet Heading()}
		<ResourceBoundary
			resource={room}
			placeholderText="Loading room…"
		>
			{#snippet children(room)}
				{room.name ?? entityId.id}
			{/snippet}
		</ResourceBoundary>
	{/snippet}



	{#snippet TypeAnnotationTooltip()}
		<p>
			WebRTC-style rooms synchronize ephemeral presence—cursors, avatars, shared focus—between joined clients.
		</p>
		<p>
			That transport differs from federated ActivityPub threads, Reddit HTTP threads, or XMTP double-ratchet DMs.
		</p>
	{/snippet}

	{#snippet Content({ title: _title, href: _href })}
		<ResourceBoundary
			resource={room}
			placeholderText="Loading room…"
		>
			{#snippet children(room)}
				<dl data-column-item="center">
					{#if room.createdAt !== undefined}
						<div>
							<dt>Created</dt>
							<dd>
								<Timestamp
									timestamp={room.createdAt}
									format={TimestampFormat.Both}
								/>
							</dd>
						</div>
					{/if}

					{#if open}
						{#if room.name !== undefined && room.name !== ''}
							<div>
								<dt>Name</dt>
								<dd>{room.name}</dd>
							</div>
						{/if}
					{/if}

					{#if open}
						{#if room.createdBy !== undefined && room.createdBy !== ''}
							<div>
								<dt>Opened by</dt>
								<dd>{room.createdBy}</dd>
							</div>
						{/if}
					{/if}
				</dl>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Details({
		open: _open,
	})}
		{#if children}
			{@render children()}
		{:else}
			<EntityDetails
				entityType={EntityType.BlockheadRoom}
				{entityId}
			/>
			<ResourceBoundary
				resource={room}
				placeholderText="Loading room…"
			>
				{#snippet children(room)}
					{#if open}
						{#if (
							(room.name === undefined || room.name === '')
							&& (room.createdBy === undefined || room.createdBy === '')
							&& room.createdAt === undefined
						)}
							<p data-text="muted">
								No room details are available yet.
							</p>
						{/if}
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}
</EntityView>
