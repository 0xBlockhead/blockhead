<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { EntityProxyField, type EntityProxyData, type EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
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
			selection: EntityProxyResource<typeof schema, EntityType.LensPost>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.LensPost>>
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
			$author: true,
			isDeleted: true,
		},
	}))
	const titleFallback = $derived([String((prefetched.text) ?? ''), String((selection.entitySelector.id ?? prefetched.id) ?? '')].filter(Boolean).join(' ') || 'Lens post')
	const viewDomId = $derived('lens-post-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import LensAccountView from '$/views/LensAccountView.svelte'
	import LensPostView from '$/views/LensPostView.svelte'
</script>


<EntityView
	entityType={EntityType.LensPost}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={lensPost}>
			{#snippet Pending()}
				{[String((prefetched.text) ?? ''), String((selection.entitySelector.id ?? prefetched.id) ?? '')].filter(Boolean).join(' ') || title || 'Lens post'}
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
				{[String((prefetched.timestamp) ?? ''), String((selection.entitySelector.id ?? prefetched.id) ?? '')].filter(Boolean).join(' ') || [String((prefetched.text) ?? ''), String((selection.entitySelector.id ?? prefetched.id) ?? '')].filter(Boolean).join(' ') || title || 'Lens post'}
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
				resource={selection[EntityProxyField]<EntityType.LensAccount, false>('$author')}
			>
				{#snippet children(lensAccount)}
					{#if lensAccount != null && lensAccount[EntityMetaKey.Selector] != null}
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
				resource={
					selection({
						fields: {
							timestamp: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const timestamp = prefetched.timestamp}
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
					{@const isEdited = prefetched.isEdited}
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
					{@const isDeleted = prefetched.isDeleted}
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
					{@const contentUri = prefetched.contentUri}
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
					{@const metadataHash = prefetched.metadataHash}
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
				resource={selection[EntityProxyField]<EntityType.LensPost, false>('$commentOn')}
			>
				{#snippet children(lensPost)}
					{#if lensPost != null && lensPost[EntityMetaKey.Selector] != null}
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
				resource={selection[EntityProxyField]<EntityType.LensPost, false>('$quoteOf')}
			>
				{#snippet children(lensPost)}
					{#if lensPost != null && lensPost[EntityMetaKey.Selector] != null}
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
				resource={selection[EntityProxyField]<EntityType.LensPost, false>('$repostOf')}
			>
				{#snippet children(lensPost)}
					{#if lensPost != null && lensPost[EntityMetaKey.Selector] != null}
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
				resource={selection[EntityProxyField]<EntityType.LensPost, false>('$root')}
			>
				{#snippet children(lensPost)}
					{#if lensPost != null && lensPost[EntityMetaKey.Selector] != null}
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
</EntityView>
