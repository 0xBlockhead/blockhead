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


	// Context
	import { select } from '$/routes/+layout.svelte'


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
			selection: EntityProxyResource<typeof schema, EntityType.ActivityPubNote_Timestamp>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.ActivityPubNote_Timestamp>>
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
	const activityPubNoteTimestamp = $derived(selection({
		sources: [
			Source.Mastodon_Rest,
		],
	}))
	const titleFallback = $derived('ActivityPub note observation')
	const viewDomId = $derived('activity-pub-note-timestamp-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import ActivityPubNoteView from '$/views/ActivityPubNoteView.svelte'
</script>


<EntityView
	entityType={EntityType.ActivityPubNote_Timestamp}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	href={
		href ?? (pendingEntity.$note !== undefined && pendingEntity.$note.instanceOrigin !== undefined && pendingEntity.$note !== undefined && pendingEntity.$note.localStatusId !== undefined && pendingEntity.timestampMs !== undefined ? resolve('/(social)/(activitypub)/activitypub/note/[instanceOrigin]/[localStatusId]/(note)/observations/[timestampMs=nonNegativeInteger]', {
			instanceOrigin: String(pendingEntity.$note.instanceOrigin ?? ''),
			localStatusId: String(pendingEntity.$note.localStatusId ?? ''),
			timestampMs: String(pendingEntity.timestampMs ?? ''),
		}) : undefined)
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={activityPubNoteTimestamp}>
			{#snippet Pending()}
				<ActivityPubNoteView
					selection={select(EntityType.ActivityPubNote, selection.entitySelector.$note)}
					href={
						(selection.entitySelector.$note.instanceOrigin !== undefined && selection.entitySelector.$note.localStatusId !== undefined ? resolve('/(social)/(activitypub)/activitypub/note/[instanceOrigin]/[localStatusId]', {
							instanceOrigin: String(selection.entitySelector.$note.instanceOrigin ?? ''),
							localStatusId: String(selection.entitySelector.$note.localStatusId ?? ''),
						}) : undefined)
					}
					layout={EntityLayout.Title}
					open={false}
				/>
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				<ActivityPubNoteView
					selection={select(EntityType.ActivityPubNote, selection.entitySelector.$note)}
					href={
						(selection.entitySelector.$note.instanceOrigin !== undefined && selection.entitySelector.$note.localStatusId !== undefined ? resolve('/(social)/(activitypub)/activitypub/note/[instanceOrigin]/[localStatusId]', {
							instanceOrigin: String(selection.entitySelector.$note.instanceOrigin ?? ''),
							localStatusId: String(selection.entitySelector.$note.localStatusId ?? ''),
						}) : undefined)
					}
					layout={EntityLayout.Title}
					open={false}
				/>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={activityPubNoteTimestamp}>
			{#snippet Pending()}
				{@const timestampMs0 = selection.entitySelector.timestampMs ?? prefetched.timestampMs}
				{#if timestampMs0 !== undefined && timestampMs0 !== null}
					<Timestamp timestamp={Number(timestampMs0)} />
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const timestampMs0 = resolvedEntity.timestampMs}
				{#if timestampMs0 !== undefined && timestampMs0 !== null}
					<Timestamp timestamp={Number(timestampMs0)} />
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Note</dt>
				<dd>
					<ActivityPubNoteView
						selection={select(EntityType.ActivityPubNote, selection.entitySelector.$note)}
						href={
							(selection.entitySelector.$note.instanceOrigin !== undefined && selection.entitySelector.$note.localStatusId !== undefined ? resolve('/(social)/(activitypub)/activitypub/note/[instanceOrigin]/[localStatusId]', {
								instanceOrigin: String(selection.entitySelector.$note.instanceOrigin ?? ''),
								localStatusId: String(selection.entitySelector.$note.localStatusId ?? ''),
							}) : undefined)
						}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<div>
				<dt>Timestamp</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									timestampMs: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const timestampMs = selection.entitySelector.timestampMs ?? prefetched.timestampMs}
							{#if timestampMs !== undefined && timestampMs !== null}
								<Timestamp timestamp={Number(timestampMs)} />
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const timestampMs = resolvedEntity.timestampMs}
							{#if timestampMs !== undefined && timestampMs !== null}
								<Timestamp timestamp={Number(timestampMs)} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					selection({
						fields: {
							favouriteCount: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const favouriteCount = prefetched.favouriteCount}
					{#if favouriteCount !== undefined && favouriteCount !== null}
						<div>
							<dt>Favourites</dt>
							<dd>
								<NumberValue value={Number(favouriteCount)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const favouriteCount = resolvedEntity.favouriteCount}
					{#if favouriteCount !== undefined && favouriteCount !== null}
						<div>
							<dt>Favourites</dt>
							<dd>
								<NumberValue value={Number(favouriteCount)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					selection({
						fields: {
							reblogCount: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const reblogCount = prefetched.reblogCount}
					{#if reblogCount !== undefined && reblogCount !== null}
						<div>
							<dt>Reblogs</dt>
							<dd>
								<NumberValue value={Number(reblogCount)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const reblogCount = resolvedEntity.reblogCount}
					{#if reblogCount !== undefined && reblogCount !== null}
						<div>
							<dt>Reblogs</dt>
							<dd>
								<NumberValue value={Number(reblogCount)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					selection({
						fields: {
							replyCount: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const replyCount = prefetched.replyCount}
					{#if replyCount !== undefined && replyCount !== null}
						<div>
							<dt>Replies</dt>
							<dd>
								<NumberValue value={Number(replyCount)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const replyCount = resolvedEntity.replyCount}
					{#if replyCount !== undefined && replyCount !== null}
						<div>
							<dt>Replies</dt>
							<dd>
								<NumberValue value={Number(replyCount)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
