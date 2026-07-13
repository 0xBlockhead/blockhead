<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { EntityProxyData, EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'


	// State
	let {
		selection,
		prefetched = {},
		title,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: WithRest<
		{
			selection: EntityProxyResource<typeof schema, EntityType.BlockheadRoom>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.BlockheadRoom>>
			title?: string
			href?: string
			layout?: EntityLayout
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'collapsible'
			| 'showTypeAnnotation'
		>
	> = $props()

	const pendingEntity = $derived(({ ...prefetched[EntityMetaKey.Selector], ...selection.entitySelector, ...prefetched }))
	const blockheadRoom = $derived(selection({
		sources: [
			Source.Local_Internal,
		],
		fields: {
			name: true,
			createdAt: true,
			createdBy: true,
		},
	}))
	const titleFallback = $derived([String((pendingEntity.name) ?? '')].filter(Boolean).join(' ') || [String((pendingEntity.id) ?? '')].filter(Boolean).join(' ') || 'room')
	const viewDomId = $derived('blockhead-room-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import BlockheadRoomPeersView from '$/views/BlockheadRoomPeersView.svelte'
</script>


<EntityView
	entityType={EntityType.BlockheadRoom}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={blockheadRoom}>
			{#snippet Pending()}
				{[String((pendingEntity.name) ?? '')].filter(Boolean).join(' ') || title || [String((pendingEntity.id) ?? '')].filter(Boolean).join(' ') || 'room'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.name) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={blockheadRoom}>
			{#snippet Pending()}
				{@const createdAt0 = pendingEntity.createdAt}
				{#if createdAt0 !== undefined && createdAt0 !== null}
					<Timestamp timestamp={Number(createdAt0)} />
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const createdAt0 = resolvedEntity.createdAt}
				{#if createdAt0 !== undefined && createdAt0 !== null}
					<Timestamp timestamp={Number(createdAt0)} />
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>ID</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									id: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const id = pendingEntity.id}
							{#if id !== undefined && id !== null}
								{String((id) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const id = resolvedEntity.id}
							{#if id !== undefined && id !== null}
								{String((id) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Created by</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									createdBy: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const createdBy = pendingEntity.createdBy}
							{#if createdBy !== undefined && createdBy !== null}
								{String((createdBy) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const createdBy = resolvedEntity.createdBy}
							{#if createdBy !== undefined && createdBy !== null}
								{String((createdBy) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Created</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									createdAt: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const createdAt = pendingEntity.createdAt}
							{#if createdAt !== undefined && createdAt !== null}
								<Timestamp timestamp={Number(createdAt)} />
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const createdAt = resolvedEntity.createdAt}
							{#if createdAt !== undefined && createdAt !== null}
								<Timestamp timestamp={Number(createdAt)} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{#if detailsOpen}
			<BlockheadRoomPeersView
				selection={selection.$$peers}
				title='Peers'
				href={resolve('/~/multiplayer/contacts')}
				emptyText='No peers yet.'
				id='BlockheadRoomPeersView-peers'
			/>
		{/if}
	{/snippet}
</EntityView>
