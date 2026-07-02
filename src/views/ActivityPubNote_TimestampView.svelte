<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { EntityProxyData, EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityLayout } from '$/components/EntityView.svelte'
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

	const activityPubNoteTimestamp = $derived(selection({
		sources: [
			Source.Mastodon_Rest,
			Source.Fedi_Rest,
		],
		fields: {
			favouriteCount: true,
			reblogCount: true,
			replyCount: true,
		},
	}))
	const titleFallback = $derived('ActivityPub note observation')
	const viewDomId = $derived('activity-pub-note-timestamp-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))
	// Components
	import EntityView from '$/components/EntityView.svelte'
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import ActivityPubNoteView from '$/views/ActivityPubNoteView.svelte'
</script>


<EntityView
	entityType={EntityType.ActivityPubNote_Timestamp}
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
			<ActivityPubNoteView
				selection={select(EntityType.ActivityPubNote, selection.entitySelector.$note)}
				href={
						resolve('/(social)/(activitypub)/activitypub/note/[instanceOrigin]/[localStatusId]', {
							instanceOrigin: String(selection.entitySelector.$note.instanceOrigin),
							localStatusId: String(selection.entitySelector.$note.localStatusId),
						})
					}
				layout={EntityLayout.Title}
				open={false}
			/>
		{:else}
			<ResourceBoundary resource={activityPubNoteTimestamp}>
				{#snippet Pending()}
					<ActivityPubNoteView
						selection={select(EntityType.ActivityPubNote, selection.entitySelector.$note)}
						href={
							resolve('/(social)/(activitypub)/activitypub/note/[instanceOrigin]/[localStatusId]', {
								instanceOrigin: String(selection.entitySelector.$note.instanceOrigin),
								localStatusId: String(selection.entitySelector.$note.localStatusId),
							})
						}
						layout={EntityLayout.Title}
						open={false}
					/>
				{/snippet}

				{#snippet children(entity)}
					<ActivityPubNoteView
						selection={select(EntityType.ActivityPubNote, selection.entitySelector.$note)}
						href={
							resolve('/(social)/(activitypub)/activitypub/note/[instanceOrigin]/[localStatusId]', {
								instanceOrigin: String(selection.entitySelector.$note.instanceOrigin),
								localStatusId: String(selection.entitySelector.$note.localStatusId),
							})
						}
						layout={EntityLayout.Title}
						open={false}
					/>
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Value()}
		{#if layout === EntityLayout.Summary || layout === EntityLayout.SummaryInline}
			{@const timestampMs0 = ({ ...selection.entitySelector, ...prefetched }).timestampMs}
			{#if timestampMs0 !== undefined && timestampMs0 !== null}
				<Timestamp timestamp={Number(timestampMs0)} />
			{/if}
		{:else}
			<ResourceBoundary resource={activityPubNoteTimestamp}>
				{#snippet Pending()}
					{@const timestampMs0 = ({ ...selection.entitySelector, ...prefetched }).timestampMs}
					{#if timestampMs0 !== undefined && timestampMs0 !== null}
						<Timestamp timestamp={Number(timestampMs0)} />
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const timestampMs0 = ({ ...selection.entitySelector, ...prefetched, ...entity }).timestampMs}
					{#if timestampMs0 !== undefined && timestampMs0 !== null}
						<Timestamp timestamp={Number(timestampMs0)} />
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<ResourceBoundary resource={activityPubNoteTimestamp}>
				{#snippet Pending()}
					{@const favouriteCount = prefetched.favouriteCount ?? selection.entitySelector.favouriteCount}
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
					{@const favouriteCount = entity.favouriteCount ?? selection.entitySelector.favouriteCount ?? prefetched.favouriteCount}
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
			<ResourceBoundary resource={activityPubNoteTimestamp}>
				{#snippet Pending()}
					{@const reblogCount = prefetched.reblogCount ?? selection.entitySelector.reblogCount}
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
					{@const reblogCount = entity.reblogCount ?? selection.entitySelector.reblogCount ?? prefetched.reblogCount}
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
			<ResourceBoundary resource={activityPubNoteTimestamp}>
				{#snippet Pending()}
					{@const replyCount = prefetched.replyCount ?? selection.entitySelector.replyCount}
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
					{@const replyCount = entity.replyCount ?? selection.entitySelector.replyCount ?? prefetched.replyCount}
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
