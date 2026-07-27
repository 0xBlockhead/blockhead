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
	}: EntitySelectionViewProps<EntityType.XPost> = $props()

	const pendingEntity = $derived({ ...selection.entitySelector, ...prefetched })
	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.X_Rest,
			Source.X_FxEmbed_Rest,
		],
	}))
	const xPost = $derived(viewSelection({
		fields: {
			text: true,
			createdAt: true,
			postUrl: true,
		},
	}))
	const titleFallback = $derived([(pendingEntity.text ?? ''), (pendingEntity.id ?? '')].filter(Boolean).join(' ') || 'X post')


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import MediaListView from '$/views/MediaListView.svelte'
	import XPost_TimestampsView from '$/views/XPost_TimestampsView.svelte'
	import XUserView from '$/views/XUserView.svelte'
	import XPostView from '$/views/XPostView.svelte'
</script>


<EntityView
	entityType={EntityType.XPost}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	href={
		href ?? resolve(
			'/(social)/(x)/x/(xNetwork)/post/[postId=stringSegment]',
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
		<ResourceBoundary resource={xPost}>
			{#snippet children(entity)}
				{[(entity.text ?? ''), pendingEntity.id].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<TruncatedValue value={pendingEntity.id} />
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={xPost}>
			{#snippet children(entity)}
				{@const createdAt0 = entity.createdAt}
				{#if createdAt0 != null}
					<span data-text="muted">
						<Timestamp timestamp={Number(createdAt0)} />
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<ResourceBoundary
				resource={selection.$author}
			>
				{#snippet children(xUser)}
					{#if xUser != null}
						<div>
							<dt>Author</dt>
							<dd>
								<XUserView
									selection={select(EntityType.XUser, xUser[EntityMetaKey.Selector])}
									prefetched={xUser}
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
				resource={xPost}
			>
				{#snippet children(entity)}
					{@const createdAt = entity.createdAt}
					{#if createdAt != null}
						<div>
							<dt>Created</dt>
							<dd>
								<Timestamp timestamp={Number(createdAt)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={xPost}
			>
				{#snippet children(entity)}
					{@const postUrl = entity.postUrl}
					{#if postUrl != null}
						<div>
							<dt>Post URL</dt>
							<dd>
								<a
									href={String(postUrl)}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={String(postUrl)} />
								</a>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={selection.$replyToPost}
			>
				{#snippet children(xPost)}
					{#if xPost != null}
						<div>
							<dt>Reply to post</dt>
							<dd>
								<XPostView
									selection={select(EntityType.XPost, xPost[EntityMetaKey.Selector])}
									prefetched={xPost}
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
				resource={selection.$quotedPost}
			>
				{#snippet children(xPost)}
					{#if xPost != null}
						<div>
							<dt>Quoted post</dt>
							<dd>
								<XPostView
									selection={select(EntityType.XPost, xPost[EntityMetaKey.Selector])}
									prefetched={xPost}
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
			resource={xPost}
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
		{@const xPostMediaListViewMediaResource = selection.$$media}
		<ResourceBoundary
			resource={xPostMediaListViewMediaResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<MediaListView
						selection={xPostMediaListViewMediaResource}
						countResource={xPostMediaListViewMediaResource.count}
						title='Media'
						id='media'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
		{@const xPostXPostTimestampsViewTimestampsResource = selection.$$timestamps}
		<ResourceBoundary
			resource={xPostXPostTimestampsViewTimestampsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<XPost_TimestampsView
						selection={xPostXPostTimestampsViewTimestampsResource}
						countResource={xPostXPostTimestampsViewTimestampsResource.count}
						title='Observations'
						id='timestamps'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
