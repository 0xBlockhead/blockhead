<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { RegisteredEntityProxyPrefetchedData, RegisteredEntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { stringify } from 'devalue'


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
			selection: RegisteredEntityProxyResource<EntityType.XPost>
			prefetched?: RegisteredEntityProxyPrefetchedData<EntityType.XPost>
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
	const xPost = $derived(selection(prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails ? {
		sources: selection.sources,
		fields: {
			text: true,
			createdAt: true,
		},
	} : {
		sources: selection.sources,
		fields: {
			text: true,
			createdAt: true,
			postUrl: true,
		},
	}))
	const titleFallback = $derived([String((pendingEntity.text) ?? ''), String((pendingEntity.id) ?? '')].filter(Boolean).join(' ') || 'X post')
	const viewDomId = $derived('xpost-' + encodeURIComponent(stringify(selection.entitySelector ?? prefetched[EntityMetaKey.Selector])))


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
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	href={
		href ?? (
			selection.entitySelector != null && 'id' in selection.entitySelector
			&& selection.entitySelector.id != null ?
				resolve('/x/post/[postId=stringSegment]', {
			postId: String(selection.entitySelector.id ?? ''),
		})
		:
				undefined
		)
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{#if layout !== EntityLayout.SummaryDetails && Object.hasOwn(prefetched, 'text') && Object.hasOwn(prefetched, 'createdAt')}
			{[String((pendingEntity.text) ?? ''), String((pendingEntity.id) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
		{:else}
			<ResourceBoundary resource={xPost}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{[String((resolvedEntity.text) ?? ''), String((resolvedEntity.id) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Value()}
		{#if layout !== EntityLayout.SummaryDetails && Object.hasOwn(prefetched, 'text') && Object.hasOwn(prefetched, 'createdAt')}
			{@const id0 = pendingEntity.id}
			{#if id0 !== undefined && id0 !== null}
				<TruncatedValue value={String((id0) ?? '')} />
			{/if}
		{:else}
			<ResourceBoundary resource={xPost}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const id0 = resolvedEntity.id}
					{#if id0 !== undefined && id0 !== null}
						<TruncatedValue value={String((id0) ?? '')} />
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet HeadingAfter()}
		{#if layout !== EntityLayout.SummaryDetails && Object.hasOwn(prefetched, 'text') && Object.hasOwn(prefetched, 'createdAt')}
			{@const createdAt0 = pendingEntity.createdAt}
			{#if createdAt0 !== undefined && createdAt0 !== null}
				<span data-text="muted">
					<Timestamp timestamp={Number(createdAt0)} />
				</span>
			{/if}
		{:else}
			<ResourceBoundary resource={xPost}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const createdAt0 = resolvedEntity.createdAt}
					{#if createdAt0 !== undefined && createdAt0 !== null}
						<span data-text="muted">
							<Timestamp timestamp={Number(createdAt0)} />
						</span>
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<ResourceBoundary
				resource={selection.$author}
			>
				{#snippet children(xUser)}
					{#if xUser != null && xUser[EntityMetaKey.Selector] != null}
						<div>
							<dt>Author</dt>
							<dd>
								<XUserView
									selection={select(EntityType.XUser, xUser[EntityMetaKey.Selector])}
									prefetched={xUser}
									href={
										(
											xUser[EntityMetaKey.Selector] != null && 'id' in xUser[EntityMetaKey.Selector]
											&& xUser[EntityMetaKey.Selector].id != null ?
												resolve('/x/user/[userId=stringSegment]', {
											userId: String(xUser[EntityMetaKey.Selector].id ?? ''),
										})
										:
												undefined
										)
									}
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
				resource={
					selection({
						sources: selection.sources,
						fields: {
							createdAt: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const createdAt = resolvedEntity.createdAt}
					{#if createdAt !== undefined && createdAt !== null}
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
				resource={
					selection({
						sources: selection.sources,
						fields: {
							postUrl: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const postUrl = resolvedEntity.postUrl}
					{#if postUrl !== undefined && postUrl !== null}
						<div>
							<dt>Post URL</dt>
							<dd>
								<svelte:element
									this={'a'}
									href={String(postUrl)}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={String(postUrl)} />
								</svelte:element>
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
					{#if xPost != null && xPost[EntityMetaKey.Selector] != null}
						<div>
							<dt>Reply to post</dt>
							<dd>
								<XPostView
									selection={select(EntityType.XPost, xPost[EntityMetaKey.Selector])}
									prefetched={xPost}
									href={
										(
											xPost[EntityMetaKey.Selector] != null && 'id' in xPost[EntityMetaKey.Selector]
											&& xPost[EntityMetaKey.Selector].id != null ?
												resolve('/x/post/[postId=stringSegment]', {
											postId: String(xPost[EntityMetaKey.Selector].id ?? ''),
										})
										:
												undefined
										)
									}
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
					{#if xPost != null && xPost[EntityMetaKey.Selector] != null}
						<div>
							<dt>Quoted post</dt>
							<dd>
								<XPostView
									selection={select(EntityType.XPost, xPost[EntityMetaKey.Selector])}
									prefetched={xPost}
									href={
										(
											xPost[EntityMetaKey.Selector] != null && 'id' in xPost[EntityMetaKey.Selector]
											&& xPost[EntityMetaKey.Selector].id != null ?
												resolve('/x/post/[postId=stringSegment]', {
											postId: String(xPost[EntityMetaKey.Selector].id ?? ''),
										})
										:
												undefined
										)
									}
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
			resource={
				selection({
					sources: selection.sources,
					fields: {
						text: true,
					},
				})
			}
		>
			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const text = resolvedEntity.text}
				{#if text !== undefined && text !== null && text !== ''}
					<p data-text="long-text">{String((text) ?? '')}</p>
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
					id='MediaListView-media'
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
					id='XPost_TimestampsView-timestamps'
				/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
