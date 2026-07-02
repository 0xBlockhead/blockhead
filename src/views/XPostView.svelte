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
			selection: EntityProxyResource<typeof schema, EntityType.XPost>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.XPost>>
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

	const xPost = $derived(selection({
		sources: [
			Source.X_Rest,
			Source.X_FxEmbed_Rest,
		],
		fields: {
			text: true,
			createdAt: true,
			$author: true,
			postUrl: true,
			$replyToPost: true,
			$quotedPost: true,
			$$media: true,
			...(open && {
				$$timestamps: true,
			}),
		},
	}))
	const titleFallback = $derived([String((({ ...selection.entitySelector, ...prefetched }).text) ?? ''), String((({ ...selection.entitySelector, ...prefetched }).id) ?? '')].filter(Boolean).join(' ') || 'X post')
	const viewDomId = $derived('xpost-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))
	// Components
	import EntityView from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import XUserView from '$/views/XUserView.svelte'
	import XPostView from '$/views/XPostView.svelte'
</script>


<EntityView
	entityType={EntityType.XPost}
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
			{[String((({ ...selection.entitySelector, ...prefetched }).text) ?? ''), String((({ ...selection.entitySelector, ...prefetched }).id) ?? '')].filter(Boolean).join(' ') || title || 'X post'}
		{:else}
			<ResourceBoundary resource={xPost}>
				{#snippet Pending()}
					{[String((({ ...selection.entitySelector, ...prefetched }).text) ?? ''), String((({ ...selection.entitySelector, ...prefetched }).id) ?? '')].filter(Boolean).join(' ') || title || 'X post'}
				{/snippet}

				{#snippet children(entity)}
					{[String((entity.text) ?? ''), String((entity.id) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Value()}
		{#if layout === EntityLayout.Summary || layout === EntityLayout.SummaryInline}
			{@const id0 = ({ ...selection.entitySelector, ...prefetched }).id}
			{#if id0 !== undefined && id0 !== null}
				<TruncatedValue value={String(id0)} />
			{/if}
		{:else}
			<ResourceBoundary resource={xPost}>
				{#snippet Pending()}
					{@const id0 = ({ ...selection.entitySelector, ...prefetched }).id}
					{#if id0 !== undefined && id0 !== null}
						<TruncatedValue value={String(id0)} />
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const id0 = ({ ...selection.entitySelector, ...prefetched, ...entity }).id}
					{#if id0 !== undefined && id0 !== null}
						<TruncatedValue value={String(id0)} />
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet HeadingAfter()}
		{#if layout === EntityLayout.Summary || layout === EntityLayout.SummaryInline}
			{@const createdAt0 = prefetched.createdAt}
			{#if createdAt0 !== undefined && createdAt0 !== null}
				<span data-text="muted">
					<Timestamp timestamp={Number(createdAt0)} />
				</span>
			{/if}
		{:else}
			<ResourceBoundary resource={xPost}>
				{#snippet Pending()}
					{@const createdAt0 = prefetched.createdAt}
					{#if createdAt0 !== undefined && createdAt0 !== null}
						<span data-text="muted">
							<Timestamp timestamp={Number(createdAt0)} />
						</span>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const createdAt0 = entity.createdAt}
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
				resource={selection[EntityProxyField]<EntityType.XUser, false>('$author')}
			>
				{#snippet children(xUser)}
					{#if xUser != null}
						<div>
							<dt>Author</dt>
							<dd>
								<XUserView
									selection={select(EntityType.XUser, xUser.entitySelector)}
									prefetched={xUser}
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
			<ResourceBoundary resource={xPost}>
				{#snippet Pending()}
					{@const postUrl = prefetched.postUrl ?? selection.entitySelector.postUrl}
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

				{#snippet children(entity)}
					{@const postUrl = entity.postUrl ?? selection.entitySelector.postUrl ?? prefetched.postUrl}
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
				resource={selection[EntityProxyField]<EntityType.XPost, false>('$replyToPost')}
			>
				{#snippet children(xPost)}
					{#if xPost != null}
						<div>
							<dt>Reply to post</dt>
							<dd>
								<XPostView
									selection={select(EntityType.XPost, xPost.entitySelector)}
									prefetched={xPost}
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
				resource={selection[EntityProxyField]<EntityType.XPost, false>('$quotedPost')}
			>
				{#snippet children(xPost)}
					{#if xPost != null}
						<div>
							<dt>Quoted post</dt>
							<dd>
								<XPostView
									selection={select(EntityType.XPost, xPost.entitySelector)}
									prefetched={xPost}
									layout={EntityLayout.Title}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<ResourceBoundary resource={xPost}>
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
