<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		title,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: Omit<EntitySelectionViewProps<EntityType.ActivityPubNote_Timestamp>, 'prefetched'> = $props()

	const note = $derived(selection.entitySelector.$note)
	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.Mastodon_Rest,
		],
	}))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import ActivityPubNoteView from '$/views/ActivityPubNoteView.svelte'
</script>


<EntityView
	entityType={EntityType.ActivityPubNote_Timestamp}
	entitySelector={selection.entitySelector}
	title={title ?? 'ActivityPub note observation'}
	href={
		href === undefined ?
			(
				'instanceOrigin' in note
				&& 'localStatusId' in note ?
					resolve(
						'/(social)/(activitypub)/activitypub/(globalActivityPubNetwork)/note/[instanceOrigin=absoluteUrl]/[localStatusId=stringSegment]/(activityPubNote)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
						{
							instanceOrigin: encodeURIComponent(note.instanceOrigin),
							localStatusId: note.localStatusId,
							timestampMs: String(selection.entitySelector.timestampMs),
							source: selection.entitySelector.source,
						}
					)
				:
					undefined
			)
		:
			href ?? undefined
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ActivityPubNoteView
			selection={select(EntityType.ActivityPubNote, selection.entitySelector.$note)}
			href={null}
			layout={EntityLayout.Title}
		/>
	{/snippet}

	{#snippet Value()}
		<Timestamp timestamp={selection.entitySelector.timestampMs} />
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>Note</dt>
				<dd>
					<ActivityPubNoteView
						selection={select(EntityType.ActivityPubNote, selection.entitySelector.$note)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<div>
				<dt>Timestamp</dt>
				<dd>
					<Timestamp timestamp={selection.entitySelector.timestampMs} />
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<div>
				<dt>Source</dt>
				<dd>
					{selection.entitySelector.source}
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							favouriteCount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const favouriteCount = entity.favouriteCount}
					{#if favouriteCount != null}
						<div>
							<dt>Favourites</dt>
							<dd>
								<NumberValue
									value={favouriteCount}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							reblogCount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const reblogCount = entity.reblogCount}
					{#if reblogCount != null}
						<div>
							<dt>Reblogs</dt>
							<dd>
								<NumberValue
									value={reblogCount}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							replyCount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const replyCount = entity.replyCount}
					{#if replyCount != null}
						<div>
							<dt>Replies</dt>
							<dd>
								<NumberValue
									value={replyCount}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
