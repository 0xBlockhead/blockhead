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
	}: EntitySelectionViewProps<EntityType.XPost> = $props()

	const xPost = $derived(selection({
		sources: selection.sources ?? [
			Source.X_Rest,
			Source.X_FxEmbed_Rest,
		],
		fields: {
			text: true,
			createdAt: true,
		},
	}))
	const titleFallback = $derived([(prefetched.text ?? ''), selection.entitySelector.id].filter(Boolean).join(' ') || 'X post')


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
		href === undefined ?
			resolve(
				'/(social)/(x)/x/(xNetwork)/post/[postId=stringSegment]',
				{
					postId: selection.entitySelector.id,
				}
			)
		:
			href ?? undefined
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={xPost}>
			{#snippet children(entity)}
				{[(entity.text ?? ''), selection.entitySelector.id].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<TruncatedValue value={selection.entitySelector.id} />
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={xPost}>
			{#snippet children(entity)}
				{@const createdAt = entity.createdAt}
				{#if createdAt != null}
					<span data-text="muted">
						<Timestamp timestamp={createdAt} />
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<ResourceBoundary
				resource={selection.$author}
			>
				{#snippet children(xUser)}
					{#if xUser != null}
						{@const xUserInitial = untrack(() => xUser)}
						<div>
							<dt>Author</dt>
							<dd>
								<XUserView
									selection={select(EntityType.XUser, (xUser ?? xUserInitial)[EntityMetaKey.Selector])}
									prefetched={xUser ?? xUserInitial}
									layout={EntityLayout.Value}
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
								<Timestamp timestamp={createdAt} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<div>
				<dt>Post URL</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: [
									Source.Constants_Internal,
								],
								fields: {
									postUrl: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							<a
								href={entity.postUrl}
								target="_blank"
								rel="noreferrer noopener"
							>
								<TruncatedValue value={entity.postUrl} />
							</a>
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={selection.$replyToPost}
			>
				{#snippet children(xPost)}
					{#if xPost != null}
						{@const xPostInitial = untrack(() => xPost)}
						<div>
							<dt>Reply to post</dt>
							<dd>
								<XPostView
									selection={select(EntityType.XPost, (xPost ?? xPostInitial)[EntityMetaKey.Selector])}
									prefetched={xPost ?? xPostInitial}
									layout={EntityLayout.Value}
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
						{@const xPostInitial = untrack(() => xPost)}
						<div>
							<dt>Quoted post</dt>
							<dd>
								<XPostView
									selection={select(EntityType.XPost, (xPost ?? xPostInitial)[EntityMetaKey.Selector])}
									prefetched={xPost ?? xPostInitial}
									layout={EntityLayout.Value}
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

	{#snippet Details()}
		{@const mediaResource = selection.$$media}
		<ResourceBoundary
			resource={mediaResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<MediaListView
						selection={mediaResource}
						countResource={mediaResource.count}
						title='Media'
						id='media'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
		{@const timestampsResource = selection.$$timestamps}
		<ResourceBoundary
			resource={timestampsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<XPost_TimestampsView
						selection={timestampsResource}
						countResource={timestampsResource.count}
						title='Observations'
						id='timestamps'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
