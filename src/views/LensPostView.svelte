<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
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
	}: EntitySelectionViewProps<EntityType.LensPost> = $props()

	const pendingEntity = $derived({ ...selection.entitySelector, ...prefetched })
	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.Lens_Graphql,
		],
	}))
	const lensPost = $derived(viewSelection({
		fields: {
			text: true,
			timestamp: true,
			isDeleted: true,
		},
	}))
	const titleFallback = $derived([(pendingEntity.text ?? ''), (pendingEntity.id ?? '')].filter(Boolean).join(' ') || 'Lens post')


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import LensPostsView from '$/views/LensPostsView.svelte'
	import LensPost_TimestampsView from '$/views/LensPost_TimestampsView.svelte'
	import LensAccountView from '$/views/LensAccountView.svelte'
	import LensPostView from '$/views/LensPostView.svelte'
</script>


<EntityView
	entityType={EntityType.LensPost}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	href={
		href ?? resolve(
			'/(social)/(lens)/lens/(lensNetwork)/post/[postId=stringSegment]',
			{
				postId: String(selection.entitySelector.id),
			}
		)
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={lensPost}>
			{#snippet children(entity)}
				{[(entity.text ?? ''), pendingEntity.id].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={lensPost}>
			{#snippet children(entity)}
				{[String(entity.timestamp ?? ''), pendingEntity.id].filter(Boolean).join(' ') || [(entity.text ?? ''), pendingEntity.id].filter(Boolean).join(' ') || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<ResourceBoundary
				resource={selection.$author}
			>
				{#snippet children(lensAccount)}
					{#if lensAccount != null}
						<div>
							<dt>Author</dt>
							<dd>
								<LensAccountView
									selection={select(EntityType.LensAccount, lensAccount[EntityMetaKey.Selector])}
									prefetched={lensAccount}
									layout={EntityLayout.Value}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={lensPost}
			>
				{#snippet children(entity)}
					{@const timestamp = entity.timestamp}
					{#if timestamp != null}
						<div>
							<dt>Timestamp</dt>
							<dd>
								<Timestamp timestamp={Number(timestamp)} />
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
							isEdited: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const isEdited = entity.isEdited}
					{#if isEdited != null}
						<div>
							<dt>Edited</dt>
							<dd>
								{isEdited ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={lensPost}
			>
				{#snippet children(entity)}
					{@const isDeleted = entity.isDeleted}
					{#if isDeleted != null}
						<div>
							<dt>Deleted</dt>
							<dd>
								{isDeleted ? 'Yes' : 'No'}
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
							contentUri: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const contentUri = entity.contentUri}
					{#if contentUri != null}
						<div>
							<dt>Content URI</dt>
							<dd>
								<a
									href={String(contentUri)}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={String(contentUri)} />
								</a>
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
							metadataHash: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const metadataHash = entity.metadataHash}
					{#if metadataHash != null}
						<div>
							<dt>Metadata hash</dt>
							<dd>
								<TruncatedValue value={metadataHash} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={selection.$commentOn}
			>
				{#snippet children(lensPost)}
					{#if lensPost != null}
						<div>
							<dt>Comment on</dt>
							<dd>
								<LensPostView
									selection={select(EntityType.LensPost, lensPost[EntityMetaKey.Selector])}
									prefetched={lensPost}
									layout={EntityLayout.Value}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={selection.$quoteOf}
			>
				{#snippet children(lensPost)}
					{#if lensPost != null}
						<div>
							<dt>Quote of</dt>
							<dd>
								<LensPostView
									selection={select(EntityType.LensPost, lensPost[EntityMetaKey.Selector])}
									prefetched={lensPost}
									layout={EntityLayout.Value}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={selection.$repostOf}
			>
				{#snippet children(lensPost)}
					{#if lensPost != null}
						<div>
							<dt>Repost of</dt>
							<dd>
								<LensPostView
									selection={select(EntityType.LensPost, lensPost[EntityMetaKey.Selector])}
									prefetched={lensPost}
									layout={EntityLayout.Value}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={selection.$root}
			>
				{#snippet children(lensPost)}
					{#if lensPost != null}
						<div>
							<dt>Root</dt>
							<dd>
								<LensPostView
									selection={select(EntityType.LensPost, lensPost[EntityMetaKey.Selector])}
									prefetched={lensPost}
									layout={EntityLayout.Value}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<ResourceBoundary
			resource={lensPost}
		>
			{#snippet children(entity)}
				{@const text = entity.text}
				{#if text != null && text !== ''}
					<p data-text="long-text">{text}</p>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{@const lensPostLensPostsViewCommentsResource = selection.$$comments}
		<ResourceBoundary
			resource={lensPostLensPostsViewCommentsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<LensPostsView
						selection={lensPostLensPostsViewCommentsResource}
						countResource={lensPostLensPostsViewCommentsResource.count}
						title='Comments'
						href={
							resolve(
								'/(social)/(lens)/lens/(lensNetwork)/post/[postId=stringSegment]/(lensPost)/comments',
								{
									postId: String(selection.entitySelector.id),
								}
							)
						}
						id='comments'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
		{@const lensPostLensPostTimestampsViewTimestampsResource = selection.$$timestamps}
		<ResourceBoundary
			resource={lensPostLensPostTimestampsViewTimestampsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<LensPost_TimestampsView
						selection={lensPostLensPostTimestampsViewTimestampsResource}
						countResource={lensPostLensPostTimestampsViewTimestampsResource.count}
						title='Observations'
						id='timestamps'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
