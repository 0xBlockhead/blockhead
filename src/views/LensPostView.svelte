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
			selection: RegisteredEntityProxyResource<EntityType.LensPost>
			prefetched?: RegisteredEntityProxyPrefetchedData<EntityType.LensPost>
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
	const lensPost = $derived(selection(prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails ? {
		sources: selection.sources,
		fields: {
			text: true,
			timestamp: true,
		},
	} : {
		sources: selection.sources,
		fields: {
			text: true,
			timestamp: true,
			isDeleted: true,
		},
	}))
	const titleFallback = $derived([String((pendingEntity.text) ?? ''), String((pendingEntity.id) ?? '')].filter(Boolean).join(' ') || 'Lens post')
	const viewDomId = $derived('lens-post-' + encodeURIComponent(stringify(selection.entitySelector ?? prefetched[EntityMetaKey.Selector])))


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
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	href={
		href ?? (
			selection.entitySelector != null && 'id' in selection.entitySelector
			&& selection.entitySelector.id != null ?
				resolve('/lens/post/[postId=stringSegment]', {
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
		{#if layout !== EntityLayout.SummaryDetails && Object.hasOwn(prefetched, 'text') && Object.hasOwn(prefetched, 'timestamp')}
			{[String((pendingEntity.text) ?? ''), String((pendingEntity.id) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
		{:else}
			<ResourceBoundary resource={lensPost}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{[String((resolvedEntity.text) ?? ''), String((resolvedEntity.id) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Value()}
		{#if layout !== EntityLayout.SummaryDetails && Object.hasOwn(prefetched, 'text') && Object.hasOwn(prefetched, 'timestamp')}
			{[String((pendingEntity.timestamp) ?? ''), String((pendingEntity.id) ?? '')].filter(Boolean).join(' ') || [String((pendingEntity.text) ?? ''), String((pendingEntity.id) ?? '')].filter(Boolean).join(' ') || titleFallback}
		{:else}
			<ResourceBoundary resource={lensPost}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{[String((resolvedEntity.timestamp) ?? ''), String((resolvedEntity.id) ?? '')].filter(Boolean).join(' ') || [String((resolvedEntity.text) ?? ''), String((resolvedEntity.id) ?? '')].filter(Boolean).join(' ') || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<ResourceBoundary
				resource={selection.$author}
			>
				{#snippet children(lensAccount)}
					{#if lensAccount != null && lensAccount[EntityMetaKey.Selector] != null}
						<div>
							<dt>Author</dt>
							<dd>
								<LensAccountView
									selection={select(EntityType.LensAccount, lensAccount[EntityMetaKey.Selector])}
									prefetched={lensAccount}
									href={
										(
											lensAccount[EntityMetaKey.Selector] != null && 'address' in lensAccount[EntityMetaKey.Selector]
											&& lensAccount[EntityMetaKey.Selector].address != null ?
												resolve('/lens/account/[address=evmAddress]', {
											address: String(lensAccount[EntityMetaKey.Selector].address ?? ''),
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
							timestamp: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const timestamp = resolvedEntity.timestamp}
					{#if timestamp !== undefined && timestamp !== null}
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
					selection({
						sources: selection.sources,
						fields: {
							isEdited: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const isEdited = resolvedEntity.isEdited}
					{#if isEdited !== undefined && isEdited !== null}
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
				resource={
					selection({
						sources: selection.sources,
						fields: {
							isDeleted: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const isDeleted = resolvedEntity.isDeleted}
					{#if isDeleted !== undefined && isDeleted !== null}
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
					selection({
						sources: selection.sources,
						fields: {
							contentUri: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const contentUri = resolvedEntity.contentUri}
					{#if contentUri !== undefined && contentUri !== null}
						<div>
							<dt>Content URI</dt>
							<dd>
								<svelte:element
									this={'a'}
									href={String(contentUri)}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={String(contentUri)} />
								</svelte:element>
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
							metadataHash: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const metadataHash = resolvedEntity.metadataHash}
					{#if metadataHash !== undefined && metadataHash !== null}
						<div>
							<dt>Metadata hash</dt>
							<dd>
								<TruncatedValue value={String((metadataHash) ?? '')} />
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
					{#if lensPost != null && lensPost[EntityMetaKey.Selector] != null}
						<div>
							<dt>Comment on</dt>
							<dd>
								<LensPostView
									selection={select(EntityType.LensPost, lensPost[EntityMetaKey.Selector])}
									prefetched={lensPost}
									href={
										(
											lensPost[EntityMetaKey.Selector] != null && 'id' in lensPost[EntityMetaKey.Selector]
											&& lensPost[EntityMetaKey.Selector].id != null ?
												resolve('/lens/post/[postId=stringSegment]', {
											postId: String(lensPost[EntityMetaKey.Selector].id ?? ''),
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
				resource={selection.$quoteOf}
			>
				{#snippet children(lensPost)}
					{#if lensPost != null && lensPost[EntityMetaKey.Selector] != null}
						<div>
							<dt>Quote of</dt>
							<dd>
								<LensPostView
									selection={select(EntityType.LensPost, lensPost[EntityMetaKey.Selector])}
									prefetched={lensPost}
									href={
										(
											lensPost[EntityMetaKey.Selector] != null && 'id' in lensPost[EntityMetaKey.Selector]
											&& lensPost[EntityMetaKey.Selector].id != null ?
												resolve('/lens/post/[postId=stringSegment]', {
											postId: String(lensPost[EntityMetaKey.Selector].id ?? ''),
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
				resource={selection.$repostOf}
			>
				{#snippet children(lensPost)}
					{#if lensPost != null && lensPost[EntityMetaKey.Selector] != null}
						<div>
							<dt>Repost of</dt>
							<dd>
								<LensPostView
									selection={select(EntityType.LensPost, lensPost[EntityMetaKey.Selector])}
									prefetched={lensPost}
									href={
										(
											lensPost[EntityMetaKey.Selector] != null && 'id' in lensPost[EntityMetaKey.Selector]
											&& lensPost[EntityMetaKey.Selector].id != null ?
												resolve('/lens/post/[postId=stringSegment]', {
											postId: String(lensPost[EntityMetaKey.Selector].id ?? ''),
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
				resource={selection.$root}
			>
				{#snippet children(lensPost)}
					{#if lensPost != null && lensPost[EntityMetaKey.Selector] != null}
						<div>
							<dt>Root</dt>
							<dd>
								<LensPostView
									selection={select(EntityType.LensPost, lensPost[EntityMetaKey.Selector])}
									prefetched={lensPost}
									href={
										(
											lensPost[EntityMetaKey.Selector] != null && 'id' in lensPost[EntityMetaKey.Selector]
											&& lensPost[EntityMetaKey.Selector].id != null ?
												resolve('/lens/post/[postId=stringSegment]', {
											postId: String(lensPost[EntityMetaKey.Selector].id ?? ''),
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
							(selection.entitySelector != null && 'id' in selection.entitySelector && selection.entitySelector.id != null ? resolve('/lens/post/[postId=stringSegment]/comments', {
								postId: String(selection.entitySelector.id ?? ''),
							}) : undefined)
						}
					id='LensPostsView-comments'
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
					id='LensPost_TimestampsView-timestamps'
				/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
