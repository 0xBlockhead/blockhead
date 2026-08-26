<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { untrack } from 'svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { getAppClient } from '$/routes/applicationClient.ts'


	const select = getAppClient().select

	// State
	let {
		selection,
		prefetched = {},
		title,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: EntitySelectionViewProps<EntityType.AtprotoActor_Timestamp> = $props()

	const atprotoActorTimestamp = $derived(selection({
		fields: {
			displayName: true,
			handle: true,
		},
	}))
	const titleFallback = $derived([(prefetched.displayName ?? ''), (prefetched.handle ?? '')].filter(Boolean).join(' ') || String(selection.entitySelector.timestampMs) || 'AT Protocol account observation')


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import MediaView from '$/views/MediaView.svelte'
</script>


<EntityView
	entityType={EntityType.AtprotoActor_Timestamp}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	href={
		href === undefined ?
			(
				'did' in selection.entitySelector.$actor ?
					resolve(
						'/(social)/(atproto)/atproto/(globalAtprotoNetwork)/actor/[did=stringSegment]/(atprotoActor)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
						{
							did: encodeURIComponent(selection.entitySelector.$actor.did),
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
	{#snippet Icon()}
		<ResourceBoundary resource={atprotoActorTimestamp}>
			{#snippet children(entity)}
				{@const reference = entity.$icon}
				{#if reference != null}
					<MediaView
						selection={select(EntityType.Media, reference[EntityMetaKey.Selector])}
						prefetched={reference}
						layout={EntityLayout.Value}
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Title()}
		<ResourceBoundary resource={atprotoActorTimestamp}>
			{#snippet children(entity)}
				{[(entity.displayName ?? ''), entity.handle].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<span data-text="muted">
			{selection.entitySelector.source}
		</span>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>Timestamp</dt>
				<dd>
					<Timestamp timestamp={selection.entitySelector.timestampMs} />
				</dd>
			</div>

			<div>
				<dt>Source</dt>
				<dd>
					{selection.entitySelector.source}
				</dd>
			</div>

			<div>
				<dt>Observed handle</dt>
				<dd>
					<ResourceBoundary
						resource={atprotoActorTimestamp}
					>
						{#snippet children(entity)}
							<span>@</span>
							{entity.handle}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={atprotoActorTimestamp}
			>
				{#snippet children(entity)}
					{@const displayName = entity.displayName}
					{#if displayName != null}
						<div>
							<dt>Display name</dt>
							<dd>
								{displayName}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							indexedAt: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const indexedAt = entity.indexedAt}
					{#if indexedAt != null}
						<div>
							<dt>Indexed</dt>
							<dd>
								<Timestamp timestamp={indexedAt} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$icon}
			>
				{#snippet children(media)}
					{#if media != null}
						{@const mediaInitial = untrack(() => media)}
						<div>
							<dt>Avatar</dt>
							<dd>
								<MediaView
									selection={select(EntityType.Media, (media ?? mediaInitial)[EntityMetaKey.Selector])}
									prefetched={media ?? mediaInitial}
									layout={EntityLayout.Value}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$banner}
			>
				{#snippet children(media)}
					{#if media != null}
						{@const mediaInitial = untrack(() => media)}
						<div>
							<dt>Banner</dt>
							<dd>
								<MediaView
									selection={select(EntityType.Media, (media ?? mediaInitial)[EntityMetaKey.Selector])}
									prefetched={media ?? mediaInitial}
									layout={EntityLayout.Value}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							followersCount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const followersCount = entity.followersCount}
					{#if followersCount != null}
						<div>
							<dt>Followers</dt>
							<dd>
								<NumberValue
									value={followersCount}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							followsCount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const followsCount = entity.followsCount}
					{#if followsCount != null}
						<div>
							<dt>Following</dt>
							<dd>
								<NumberValue
									value={followsCount}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							postsCount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const postsCount = entity.postsCount}
					{#if postsCount != null}
						<div>
							<dt>Posts</dt>
							<dd>
								<NumberValue
									value={postsCount}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<ResourceBoundary
			resource={
				selection({
					fields: {
						description: true,
					},
				})
			}
		>
			{#snippet children(entity)}
				{@const description = entity.description}
				{#if description != null && description !== ''}
					<p data-text="long-text">{description}</p>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
