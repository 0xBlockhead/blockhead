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
	import { UrlString } from '$/schema/UrlString.ts'
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
			selection: EntityProxyResource<typeof schema, EntityType.NostrArticle>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.NostrArticle>>
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

	const nostrArticle = $derived(selection({
		sources: [
			Source.NostrBand_Rest,
		],
		fields: {
			title: true,
			summary: true,
			imageUrl: true,
			publishedAt: true,
			...(open && {
				content: true,
				$author: true,
			}),
		},
	}))
	const titleFallback = $derived([String((({ ...selection.entitySelector, ...prefetched }).title) ?? ''), String((({ ...selection.entitySelector, ...prefetched }).identifier) ?? '')].filter(Boolean).join(' ') || 'Nostr article')
	const viewDomId = $derived('nostr-article-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))
	// Components
	import EntityView from '$/components/EntityView.svelte'
	import Markdown from '$/components/Markdown.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import NostrProfileView from '$/views/NostrProfileView.svelte'
</script>


<EntityView
	entityType={EntityType.NostrArticle}
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
			{[String((({ ...selection.entitySelector, ...prefetched }).title) ?? ''), String((({ ...selection.entitySelector, ...prefetched }).identifier) ?? '')].filter(Boolean).join(' ') || title || 'Nostr article'}
		{:else}
			<ResourceBoundary resource={nostrArticle}>
				{#snippet Pending()}
					{[String((({ ...selection.entitySelector, ...prefetched }).title) ?? ''), String((({ ...selection.entitySelector, ...prefetched }).identifier) ?? '')].filter(Boolean).join(' ') || title || 'Nostr article'}
				{/snippet}

				{#snippet children(entity)}
					{[String((entity.title) ?? ''), String((entity.identifier) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Value()}
		{#if layout === EntityLayout.Summary || layout === EntityLayout.SummaryInline}
			{@const identifier0 = ({ ...selection.entitySelector, ...prefetched }).identifier}
			{#if identifier0 !== undefined && identifier0 !== null}
				<TruncatedValue value={String(identifier0)} />
			{/if}
		{:else}
			<ResourceBoundary resource={nostrArticle}>
				{#snippet Pending()}
					{@const identifier0 = ({ ...selection.entitySelector, ...prefetched }).identifier}
					{#if identifier0 !== undefined && identifier0 !== null}
						<TruncatedValue value={String(identifier0)} />
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const identifier0 = ({ ...selection.entitySelector, ...prefetched, ...entity }).identifier}
					{#if identifier0 !== undefined && identifier0 !== null}
						<TruncatedValue value={String(identifier0)} />
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet HeadingAfter()}
		{#if layout === EntityLayout.Summary || layout === EntityLayout.SummaryInline}
			{@const publishedAt0 = prefetched.publishedAt}
			{#if publishedAt0 !== undefined && publishedAt0 !== null}
				<span data-text="muted">
					<Timestamp timestamp={Number(publishedAt0)} />
				</span>
			{/if}
			{@const kind1 = prefetched.kind}
			{#if kind1 !== undefined && kind1 !== null}
				<span data-text="muted">
					<span>kind </span>
					{String((kind1) ?? '')}
				</span>
			{/if}
		{:else}
			<ResourceBoundary resource={nostrArticle}>
				{#snippet Pending()}
					{@const publishedAt0 = prefetched.publishedAt}
					{#if publishedAt0 !== undefined && publishedAt0 !== null}
						<span data-text="muted">
							<Timestamp timestamp={Number(publishedAt0)} />
						</span>
					{/if}
					{@const kind1 = prefetched.kind}
					{#if kind1 !== undefined && kind1 !== null}
						<span data-text="muted">
							<span>kind </span>
							{String((kind1) ?? '')}
						</span>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const publishedAt0 = entity.publishedAt}
					{#if publishedAt0 !== undefined && publishedAt0 !== null}
						<span data-text="muted">
							<Timestamp timestamp={Number(publishedAt0)} />
						</span>
					{/if}
					{@const kind1 = entity.kind}
					{#if kind1 !== undefined && kind1 !== null}
						<span data-text="muted">
							<span>kind </span>
							{String((kind1) ?? '')}
						</span>
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet TypeAnnotationTooltip()}
		<p>
			A Nostr long-form article is a replaceable kind-30023 event addressed by author public key and identifier.
		</p>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Author pubkey</dt>
				<dd>
					<ResourceBoundary resource={nostrArticle}>
						{#snippet Pending()}
							{@const pubkey = prefetched.pubkey ?? selection.entitySelector.pubkey}
							{#if pubkey !== undefined && pubkey !== null}
								<TruncatedValue value={String(pubkey)} />
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const pubkey = entity.pubkey ?? selection.entitySelector.pubkey ?? prefetched.pubkey}
							{#if pubkey !== undefined && pubkey !== null}
								<TruncatedValue value={String(pubkey)} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary resource={nostrArticle}>
				{#snippet Pending()}
					{@const summary = prefetched.summary ?? selection.entitySelector.summary}
					{#if summary !== undefined && summary !== null}
						<div>
							<dt>Summary</dt>
							<dd>
								{String((summary) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const summary = entity.summary ?? selection.entitySelector.summary ?? prefetched.summary}
					{#if summary !== undefined && summary !== null}
						<div>
							<dt>Summary</dt>
							<dd>
								{String((summary) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary resource={nostrArticle}>
				{#snippet Pending()}
					{@const imageUrl = prefetched.imageUrl ?? selection.entitySelector.imageUrl}
					{#if imageUrl !== undefined && imageUrl !== null}
						<div>
							<dt>Image URL</dt>
							<dd>
								<TruncatedValue value={String(imageUrl)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const imageUrl = entity.imageUrl ?? selection.entitySelector.imageUrl ?? prefetched.imageUrl}
					{#if imageUrl !== undefined && imageUrl !== null}
						<div>
							<dt>Image URL</dt>
							<dd>
								<TruncatedValue value={String(imageUrl)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection[EntityProxyField]<EntityType.NostrProfile, false>('$author')}
			>
				{#snippet children(nostrProfile)}
					{#if nostrProfile != null}
						<div>
							<dt>Author</dt>
							<dd>
								<NostrProfileView
									selection={select(EntityType.NostrProfile, nostrProfile.entitySelector)}
									prefetched={nostrProfile}
									layout={EntityLayout.Title}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<section
			id={viewDomId + '-article-body'}
			data-scroll-marker-label='Article body'
		>
			<h3>Article body</h3>
			<ResourceBoundary resource={nostrArticle}>
				{#snippet children(entity)}
					{@const content = entity.content ?? selection.entitySelector.content ?? prefetched.content}
					{#if content === undefined || content === null || content === ''}
						<p data-text="muted">No article body yet.</p>
					{:else}
						<Markdown content={String(content)} />
					{/if}
				{/snippet}
			</ResourceBoundary>
		</section>
	{/snippet}
</EntityView>
