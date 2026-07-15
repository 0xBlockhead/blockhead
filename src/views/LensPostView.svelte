<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { RegisteredEntityProxyData, RegisteredEntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
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
	}: WithRest<
		{
			selection: RegisteredEntityProxyResource<EntityType.LensPost>
			prefetched?: Partial<RegisteredEntityProxyData<EntityType.LensPost>>
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
	const lensPost = $derived(selection({
		sources: [
			Source.Lens_Graphql,
		],
		fields: {
			text: true,
			timestamp: true,
			isDeleted: true,
		},
	}))
	const titleFallback = $derived([String((pendingEntity.text) ?? ''), String((pendingEntity.id) ?? '')].filter(Boolean).join(' ') || 'Lens post')
	const viewDomId = $derived('lens-post-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


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
		href ?? (pendingEntity.id !== undefined ? resolve('/lens/post/[postId=stringSegment]', {
			postId: String(pendingEntity.id ?? ''),
		}) : undefined)
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={lensPost}>
			{#snippet Pending()}
				{[String((pendingEntity.text) ?? ''), String((pendingEntity.id) ?? '')].filter(Boolean).join(' ') || title || 'Lens post'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.text) ?? ''), String((resolvedEntity.id) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={lensPost}>
			{#snippet Pending()}
				{[String((pendingEntity.timestamp) ?? ''), String((pendingEntity.id) ?? '')].filter(Boolean).join(' ') || [String((pendingEntity.text) ?? ''), String((pendingEntity.id) ?? '')].filter(Boolean).join(' ') || title || 'Lens post'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.timestamp) ?? ''), String((resolvedEntity.id) ?? '')].filter(Boolean).join(' ') || [String((resolvedEntity.text) ?? ''), String((resolvedEntity.id) ?? '')].filter(Boolean).join(' ') || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<ResourceBoundary
				resource={selection.$author}
			>
				{#snippet Pending()}{/snippet}

				{#snippet children(lensAccount)}
					{#if lensAccount != null && lensAccount[EntityMetaKey.Selector] != null}
						<div>
							<dt>Author</dt>
							<dd>
								<LensAccountView
									selection={select(EntityType.LensAccount, lensAccount[EntityMetaKey.Selector])}
									prefetched={lensAccount}
									href={
										(lensAccount[EntityMetaKey.Selector].address !== undefined ? resolve('/lens/account/[address=evmAddress]', {
											address: String(lensAccount[EntityMetaKey.Selector].address ?? ''),
										}) : undefined)
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
						fields: {
							timestamp: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const timestamp = pendingEntity.timestamp}
					{#if timestamp !== undefined && timestamp !== null}
						<div>
							<dt>Timestamp</dt>
							<dd>
								<Timestamp timestamp={Number(timestamp)} />
							</dd>
						</div>
					{/if}
				{/snippet}

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
						fields: {
							isEdited: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const isEdited = pendingEntity.isEdited}
					{#if isEdited !== undefined && isEdited !== null}
						<div>
							<dt>Edited</dt>
							<dd>
								{isEdited ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}

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
						fields: {
							isDeleted: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const isDeleted = pendingEntity.isDeleted}
					{#if isDeleted !== undefined && isDeleted !== null}
						<div>
							<dt>Deleted</dt>
							<dd>
								{isDeleted ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}

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
						fields: {
							contentUri: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const contentUri = pendingEntity.contentUri}
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
						fields: {
							metadataHash: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const metadataHash = pendingEntity.metadataHash}
					{#if metadataHash !== undefined && metadataHash !== null}
						<div>
							<dt>Metadata hash</dt>
							<dd>
								<TruncatedValue value={String((metadataHash) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}

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
				{#snippet Pending()}{/snippet}

				{#snippet children(lensPost)}
					{#if lensPost != null && lensPost[EntityMetaKey.Selector] != null}
						<div>
							<dt>Comment on</dt>
							<dd>
								<LensPostView
									selection={select(EntityType.LensPost, lensPost[EntityMetaKey.Selector])}
									prefetched={lensPost}
									href={
										(lensPost[EntityMetaKey.Selector].id !== undefined ? resolve('/lens/post/[postId=stringSegment]', {
											postId: String(lensPost[EntityMetaKey.Selector].id ?? ''),
										}) : undefined)
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
				{#snippet Pending()}{/snippet}

				{#snippet children(lensPost)}
					{#if lensPost != null && lensPost[EntityMetaKey.Selector] != null}
						<div>
							<dt>Quote of</dt>
							<dd>
								<LensPostView
									selection={select(EntityType.LensPost, lensPost[EntityMetaKey.Selector])}
									prefetched={lensPost}
									href={
										(lensPost[EntityMetaKey.Selector].id !== undefined ? resolve('/lens/post/[postId=stringSegment]', {
											postId: String(lensPost[EntityMetaKey.Selector].id ?? ''),
										}) : undefined)
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
				{#snippet Pending()}{/snippet}

				{#snippet children(lensPost)}
					{#if lensPost != null && lensPost[EntityMetaKey.Selector] != null}
						<div>
							<dt>Repost of</dt>
							<dd>
								<LensPostView
									selection={select(EntityType.LensPost, lensPost[EntityMetaKey.Selector])}
									prefetched={lensPost}
									href={
										(lensPost[EntityMetaKey.Selector].id !== undefined ? resolve('/lens/post/[postId=stringSegment]', {
											postId: String(lensPost[EntityMetaKey.Selector].id ?? ''),
										}) : undefined)
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
				{#snippet Pending()}{/snippet}

				{#snippet children(lensPost)}
					{#if lensPost != null && lensPost[EntityMetaKey.Selector] != null}
						<div>
							<dt>Root</dt>
							<dd>
								<LensPostView
									selection={select(EntityType.LensPost, lensPost[EntityMetaKey.Selector])}
									prefetched={lensPost}
									href={
										(lensPost[EntityMetaKey.Selector].id !== undefined ? resolve('/lens/post/[postId=stringSegment]', {
											postId: String(lensPost[EntityMetaKey.Selector].id ?? ''),
										}) : undefined)
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
		{#if detailsOpen}
			<LensPostsView
				selection={
						selection.$$comments({
							count: true,
						})
					}
				title='Comments'
				href={resolve('/lens/observations/posts')}
				emptyText='No Lens comments for this post.'
				id='LensPostsView-comments'
			/>

			<LensPost_TimestampsView
				selection={
						selection.$$timestamps({
							count: true,
						})
					}
				title='Observations'
				emptyText='No Lens post observations yet.'
				id='LensPost_TimestampsView-timestamps'
			/>
		{/if}
	{/snippet}
</EntityView>
