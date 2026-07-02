<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { EntityProxyData, EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityProxyField } from '$/client/$proxy.svelte.ts'
	import { EntityLayout } from '$/components/EntityView.svelte'
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

	const blockheadRoom = $derived(selection({
		sources: [
			Source.Local_Internal,
		],
		fields: {
			name: true,
			createdAt: true,
			createdBy: true,
			...(open && {
				$$peers: true,
			}),
		},
	}))
	const titleFallback = $derived([String((({ ...selection.entitySelector, ...prefetched }).name) ?? '')].filter(Boolean).join(' ') || [String((selection.entitySelector.id) ?? '')].filter(Boolean).join(' ') || 'room')
	const viewDomId = $derived('blockhead-room-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))
	// Components
	import EntityView from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import BlockheadRoomPeersView from '$/views/BlockheadRoomPeersView.svelte'
</script>


<EntityView
	entityType={EntityType.BlockheadRoom}
	entitySelector={selection.entitySelector}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{#if layout === EntityLayout.Summary || layout === EntityLayout.SummaryInline}
			{[String((({ ...selection.entitySelector, ...prefetched }).name) ?? '')].filter(Boolean).join(' ') || title || [String((selection.entitySelector.id) ?? '')].filter(Boolean).join(' ') || 'room'}
		{:else}
			<ResourceBoundary resource={blockheadRoom}>
				{#snippet Pending()}
					{[String((({ ...selection.entitySelector, ...prefetched }).name) ?? '')].filter(Boolean).join(' ') || title || [String((selection.entitySelector.id) ?? '')].filter(Boolean).join(' ') || 'room'}
				{/snippet}

				{#snippet children(entity)}
					{[String((entity.name) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Value()}
		{#if layout === EntityLayout.Summary || layout === EntityLayout.SummaryInline}
			{@const createdAt0 = ({ ...selection.entitySelector, ...prefetched }).createdAt}
			{#if createdAt0 !== undefined && createdAt0 !== null}
				<Timestamp timestamp={Number(createdAt0)} />
			{/if}
		{:else}
			<ResourceBoundary resource={blockheadRoom}>
				{#snippet Pending()}
					{@const createdAt0 = ({ ...selection.entitySelector, ...prefetched }).createdAt}
					{#if createdAt0 !== undefined && createdAt0 !== null}
						<Timestamp timestamp={Number(createdAt0)} />
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const createdAt0 = ({ ...selection.entitySelector, ...prefetched, ...entity }).createdAt}
					{#if createdAt0 !== undefined && createdAt0 !== null}
						<Timestamp timestamp={Number(createdAt0)} />
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Created by</dt>
				<dd>
					<ResourceBoundary resource={blockheadRoom}>
						{#snippet Pending()}
							{@const createdBy = prefetched.createdBy ?? selection.entitySelector.createdBy}
							{#if createdBy !== undefined && createdBy !== null}
								{String((createdBy) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const createdBy = entity.createdBy ?? selection.entitySelector.createdBy ?? prefetched.createdBy}
							{#if createdBy !== undefined && createdBy !== null}
								{String((createdBy) ?? '')}
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
				selection={selection[EntityProxyField]<EntityType.BlockheadRoomPeer>('$$peers')}
				title='Peers'
				href={resolve('/~/multiplayer/contacts')}
				emptyText='No peers yet.'
				id='BlockheadRoomPeersView-$$peers'
			/>
		{/if}
	{/snippet}
</EntityView>
