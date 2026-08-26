<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { untrack } from 'svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


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
	}: EntitySelectionViewProps<EntityType.AtprotoFeedGenerator> = $props()

	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.Atproto_Xrpc,
			Source.Atproto_BskySocial_Xrpc,
		],
	}))
	const atprotoFeedGenerator = $derived(viewSelection({
		fields: {
			displayName: true,
			isOnline: true,
		},
	}))
	const titleFallback = $derived((prefetched.displayName ?? '') || selection.entitySelector.uri || 'AT Protocol feed generator')


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import AtprotoActorView from '$/views/AtprotoActorView.svelte'
	import MediaView from '$/views/MediaView.svelte'
</script>


<EntityView
	entityType={EntityType.AtprotoFeedGenerator}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	href={
		href === undefined ?
			resolve(
				'/(social)/(atproto)/atproto/(globalAtprotoNetwork)/feed/[...uri=stringSegment]',
				{
					uri: encodeURIComponent(selection.entitySelector.uri),
				}
			)
		:
			href ?? undefined
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Icon()}
		<ResourceBoundary resource={atprotoFeedGenerator}>
			{#snippet children(entity)}
				{@const reference = entity.$avatar}
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
		<ResourceBoundary resource={atprotoFeedGenerator}>
			{#snippet children(entity)}
				{entity.displayName || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={atprotoFeedGenerator}>
			{#snippet children(entity)}
				<span data-text="muted">
					{entity.isOnline ? 'Yes' : 'No'}
				</span>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>AT URI</dt>
				<dd>
					<TruncatedValue value={selection.entitySelector.uri} />
				</dd>
			</div>

			<div>
				<dt>Creator</dt>
				<dd>
					<ResourceBoundary
						resource={selection.$creator}
					>
						{#snippet children(atprotoActor)}
							{@const atprotoActorInitial = untrack(() => atprotoActor)}
							<AtprotoActorView
								selection={select(EntityType.AtprotoActor, (atprotoActor ?? atprotoActorInitial)[EntityMetaKey.Selector])}
								prefetched={atprotoActor ?? atprotoActorInitial}
								layout={EntityLayout.Value}
							/>
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Service DID</dt>
				<dd>
					<ResourceBoundary
						resource={
							viewSelection({
								fields: {
									did: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							<TruncatedValue value={entity.did} />
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>CID</dt>
				<dd>
					<ResourceBoundary
						resource={
							viewSelection({
								fields: {
									cid: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							<TruncatedValue value={entity.cid} />
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Indexed</dt>
				<dd>
					<ResourceBoundary
						resource={
							viewSelection({
								fields: {
									indexedAt: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							<Timestamp timestamp={entity.indexedAt} />
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							likeCount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const likeCount = entity.likeCount}
					{#if likeCount != null}
						<div>
							<dt>Likes</dt>
							<dd>
								<NumberValue
									value={likeCount}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							acceptsInteractions: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const acceptsInteractions = entity.acceptsInteractions}
					{#if acceptsInteractions != null}
						<div>
							<dt>Accepts interactions</dt>
							<dd>
								{acceptsInteractions ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							contentMode: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const contentMode = entity.contentMode}
					{#if contentMode != null}
						<div>
							<dt>Content mode</dt>
							<dd>
								{contentMode}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<div>
				<dt>Online recently</dt>
				<dd>
					<ResourceBoundary
						resource={atprotoFeedGenerator}
					>
						{#snippet children(entity)}
							{entity.isOnline ? 'Yes' : 'No'}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Declaration compatible</dt>
				<dd>
					<ResourceBoundary
						resource={
							viewSelection({
								fields: {
									isValid: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{entity.isValid ? 'Yes' : 'No'}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>

		<ResourceBoundary
			resource={
				viewSelection({
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
