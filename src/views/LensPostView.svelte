<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityProxyData, EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityProxyField } from '$/client/$proxy.svelte.ts'
	import { EntityLayout } from '$/components/EntityView.svelte'
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

	const lensPost = $derived(selection({
		sources: [
			Source.Lens_Graphql,
		],
		fields: {
			text: true,
			timestamp: true,
			$author: true,
			isDeleted: true,
			...(open && {
				isEdited: true,
				contentUri: true,
				metadataHash: true,
				$commentOn: true,
				$quoteOf: true,
				$repostOf: true,
				$root: true,
				$$comments: true,
				$$timestamps: true,
			}),
		},
	}))
	const titleFallback = $derived([String((({ ...selection.entitySelector, ...prefetched }).text) ?? ''), String((({ ...selection.entitySelector, ...prefetched }).id) ?? '')].filter(Boolean).join(' ') || 'Lens post')
	const viewDomId = $derived('lens-post-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))
	// Components
	import EntityView from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import LensAccountView from '$/views/LensAccountView.svelte'
	import LensPostView from '$/views/LensPostView.svelte'
</script>


<EntityView
	entityType={EntityType.LensPost}
	entitySelector={selection.entitySelector}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{#if layout === EntityLayout.Summary || layout === EntityLayout.SummaryInline}
			{[String((({ ...selection.entitySelector, ...prefetched }).text) ?? ''), String((({ ...selection.entitySelector, ...prefetched }).id) ?? '')].filter(Boolean).join(' ') || title || 'Lens post'}
		{:else}
			<ResourceBoundary resource={lensPost}>
				{#snippet Pending()}
					{[String((({ ...selection.entitySelector, ...prefetched }).text) ?? ''), String((({ ...selection.entitySelector, ...prefetched }).id) ?? '')].filter(Boolean).join(' ') || title || 'Lens post'}
				{/snippet}

				{#snippet children(entity)}
					{[String((entity.text) ?? ''), String((entity.id) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Value()}
		{#if layout === EntityLayout.Summary || layout === EntityLayout.SummaryInline}
			{[String((({ ...selection.entitySelector, ...prefetched }).timestamp) ?? ''), String((({ ...selection.entitySelector, ...prefetched }).id) ?? '')].filter(Boolean).join(' ') || [String((({ ...selection.entitySelector, ...prefetched }).text) ?? ''), String((({ ...selection.entitySelector, ...prefetched }).id) ?? '')].filter(Boolean).join(' ') || title || 'Lens post'}
		{:else}
			<ResourceBoundary resource={lensPost}>
				{#snippet Pending()}
					{[String((({ ...selection.entitySelector, ...prefetched }).timestamp) ?? ''), String((({ ...selection.entitySelector, ...prefetched }).id) ?? '')].filter(Boolean).join(' ') || [String((({ ...selection.entitySelector, ...prefetched }).text) ?? ''), String((({ ...selection.entitySelector, ...prefetched }).id) ?? '')].filter(Boolean).join(' ') || title || 'Lens post'}
				{/snippet}

				{#snippet children(entity)}
					{[String((entity.timestamp) ?? ''), String((entity.id) ?? '')].filter(Boolean).join(' ') || [String((entity.text) ?? ''), String((entity.id) ?? '')].filter(Boolean).join(' ') || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<ResourceBoundary
				resource={selection[EntityProxyField]<EntityType.LensAccount, false>('$author')}
			>
				{#snippet children(lensAccount)}
					{#if lensAccount != null}
						<div>
							<dt>Author</dt>
							<dd>
								<LensAccountView
									selection={select(EntityType.LensAccount, lensAccount.entitySelector)}
									prefetched={lensAccount}
									layout={EntityLayout.Title}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary resource={lensPost}>
				{#snippet Pending()}
					{@const isEdited = prefetched.isEdited ?? selection.entitySelector.isEdited}
					{#if isEdited !== undefined && isEdited !== null}
						<div>
							<dt>Edited</dt>
							<dd>
								{String((isEdited) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const isEdited = entity.isEdited ?? selection.entitySelector.isEdited ?? prefetched.isEdited}
					{#if isEdited !== undefined && isEdited !== null}
						<div>
							<dt>Edited</dt>
							<dd>
								{String((isEdited) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary resource={lensPost}>
				{#snippet Pending()}
					{@const isDeleted = prefetched.isDeleted ?? selection.entitySelector.isDeleted}
					{#if isDeleted !== undefined && isDeleted !== null}
						<div>
							<dt>Deleted</dt>
							<dd>
								{String((isDeleted) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const isDeleted = entity.isDeleted ?? selection.entitySelector.isDeleted ?? prefetched.isDeleted}
					{#if isDeleted !== undefined && isDeleted !== null}
						<div>
							<dt>Deleted</dt>
							<dd>
								{String((isDeleted) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary resource={lensPost}>
				{#snippet Pending()}
					{@const contentUri = prefetched.contentUri ?? selection.entitySelector.contentUri}
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
					{@const contentUri = entity.contentUri ?? selection.entitySelector.contentUri ?? prefetched.contentUri}
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
			<ResourceBoundary resource={lensPost}>
				{#snippet Pending()}
					{@const metadataHash = prefetched.metadataHash ?? selection.entitySelector.metadataHash}
					{#if metadataHash !== undefined && metadataHash !== null}
						<div>
							<dt>Metadata hash</dt>
							<dd>
								<TruncatedValue value={String(metadataHash)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const metadataHash = entity.metadataHash ?? selection.entitySelector.metadataHash ?? prefetched.metadataHash}
					{#if metadataHash !== undefined && metadataHash !== null}
						<div>
							<dt>Metadata hash</dt>
							<dd>
								<TruncatedValue value={String(metadataHash)} />
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
					{#if lensPost != null}
						<div>
							<dt>Comment on</dt>
							<dd>
								<LensPostView
									selection={select(EntityType.LensPost, lensPost.entitySelector)}
									prefetched={lensPost}
									layout={EntityLayout.Title}
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
					{#if lensPost != null}
						<div>
							<dt>Quote of</dt>
							<dd>
								<LensPostView
									selection={select(EntityType.LensPost, lensPost.entitySelector)}
									prefetched={lensPost}
									layout={EntityLayout.Title}
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
					{#if lensPost != null}
						<div>
							<dt>Repost of</dt>
							<dd>
								<LensPostView
									selection={select(EntityType.LensPost, lensPost.entitySelector)}
									prefetched={lensPost}
									layout={EntityLayout.Title}
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
					{#if lensPost != null}
						<div>
							<dt>Root</dt>
							<dd>
								<LensPostView
									selection={select(EntityType.LensPost, lensPost.entitySelector)}
									prefetched={lensPost}
									layout={EntityLayout.Title}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<ResourceBoundary resource={lensPost}>
			{#snippet children(entity)}
				{@const text = entity.text ?? selection.entitySelector.text ?? prefetched.text}
				{#if text === undefined || text === null || text === ''}
					<p data-text="muted">No text available.</p>
				{:else}
					<p data-text="long-text">{String((text) ?? '')}</p>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
