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
			selection: RegisteredEntityProxyResource<EntityType.NostrArticle>
			prefetched?: Partial<RegisteredEntityProxyData<EntityType.NostrArticle>>
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
	const nostrArticle = $derived(selection({
		sources: [
			Source.NostrBand_Rest,
		],
		fields: {
			title: true,
			summary: true,
			imageUrl: true,
			publishedAt: true,
		},
	}))
	const titleFallback = $derived([String((pendingEntity.title) ?? ''), String((pendingEntity.identifier) ?? '')].filter(Boolean).join(' ') || 'Nostr article')
	const viewDomId = $derived('nostr-article-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import Markdown from '$/components/Markdown.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import NostrProfileView from '$/views/NostrProfileView.svelte'
</script>


<EntityView
	entityType={EntityType.NostrArticle}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	href={
		href ?? (pendingEntity.kind === 30023 && pendingEntity.pubkey !== undefined && pendingEntity.identifier !== undefined ? resolve('/nostr/article/[pubkey=stringSegment]/[identifier=stringSegment]', {
			pubkey: String(pendingEntity.pubkey ?? ''),
			identifier: String(pendingEntity.identifier ?? ''),
		}) : undefined)
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={nostrArticle}>
			{#snippet Pending()}
				{[String((pendingEntity.title) ?? ''), String((pendingEntity.identifier) ?? '')].filter(Boolean).join(' ') || title || 'Nostr article'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.title) ?? ''), String((resolvedEntity.identifier) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={nostrArticle}>
			{#snippet Pending()}
				{@const identifier0 = pendingEntity.identifier}
				{#if identifier0 !== undefined && identifier0 !== null}
					<TruncatedValue value={String((identifier0) ?? '')} />
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const identifier0 = resolvedEntity.identifier}
				{#if identifier0 !== undefined && identifier0 !== null}
					<TruncatedValue value={String((identifier0) ?? '')} />
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={nostrArticle}>
			{#snippet Pending()}
				{@const publishedAt0 = pendingEntity.publishedAt}
				{#if publishedAt0 !== undefined && publishedAt0 !== null}
					<span data-text="muted">
						<Timestamp timestamp={Number(publishedAt0)} />
					</span>
				{/if}
				{@const kind1 = pendingEntity.kind}
				{#if kind1 !== undefined && kind1 !== null}
					<span data-text="muted">
						<span>kind </span>
						{String((kind1) ?? '')}
					</span>
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const publishedAt0 = resolvedEntity.publishedAt}
				{#if publishedAt0 !== undefined && publishedAt0 !== null}
					<span data-text="muted">
						<Timestamp timestamp={Number(publishedAt0)} />
					</span>
				{/if}
				{@const kind1 = resolvedEntity.kind}
				{#if kind1 !== undefined && kind1 !== null}
					<span data-text="muted">
						<span>kind </span>
						{String((kind1) ?? '')}
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet TypeAnnotationTooltip()}
		<p>
			A Nostr long-form article is a replaceable kind-30023 event addressed by author public key and identifier.
		</p>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Identifier</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									identifier: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const identifier = pendingEntity.identifier}
							{#if identifier !== undefined && identifier !== null}
								{String((identifier) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const identifier = resolvedEntity.identifier}
							{#if identifier !== undefined && identifier !== null}
								{String((identifier) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Author pubkey</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									pubkey: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const pubkey = pendingEntity.pubkey}
							{#if pubkey !== undefined && pubkey !== null}
								<TruncatedValue value={String((pubkey) ?? '')} />
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const pubkey = resolvedEntity.pubkey}
							{#if pubkey !== undefined && pubkey !== null}
								<TruncatedValue value={String((pubkey) ?? '')} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Kind</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									kind: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const kind = pendingEntity.kind}
							{#if kind !== undefined && kind !== null}
								<span>kind </span>
								{String((kind) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const kind = resolvedEntity.kind}
							{#if kind !== undefined && kind !== null}
								<span>kind </span>
								{String((kind) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						sources: [
							Source.NostrBand_Rest,
						],
						fields: {
							publishedAt: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const publishedAt = pendingEntity.publishedAt}
					{#if publishedAt !== undefined && publishedAt !== null}
						<div>
							<dt>Published</dt>
							<dd>
								<Timestamp timestamp={Number(publishedAt)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const publishedAt = resolvedEntity.publishedAt}
					{#if publishedAt !== undefined && publishedAt !== null}
						<div>
							<dt>Published</dt>
							<dd>
								<Timestamp timestamp={Number(publishedAt)} />
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
							summary: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const summary = pendingEntity.summary}
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
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const summary = resolvedEntity.summary}
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

			<ResourceBoundary
				resource={
					selection({
						sources: [
							Source.NostrBand_Rest,
						],
						fields: {
							imageUrl: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const imageUrl = pendingEntity.imageUrl}
					{#if imageUrl !== undefined && imageUrl !== null}
						<div>
							<dt>Image URL</dt>
							<dd>
								<TruncatedValue value={String((imageUrl) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const imageUrl = resolvedEntity.imageUrl}
					{#if imageUrl !== undefined && imageUrl !== null}
						<div>
							<dt>Image URL</dt>
							<dd>
								<TruncatedValue value={String((imageUrl) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection.$author({
						sources: [
							Source.NostrBand_Rest,
						],
					})
				}
			>
				{#snippet Pending()}{/snippet}

				{#snippet children(nostrProfile)}
					{#if nostrProfile != null && nostrProfile[EntityMetaKey.Selector] != null}
						<div>
							<dt>Author</dt>
							<dd>
								<NostrProfileView
									selection={select(EntityType.NostrProfile, nostrProfile[EntityMetaKey.Selector])}
									prefetched={nostrProfile}
									href={
										(nostrProfile[EntityMetaKey.Selector].pubkey !== undefined ? resolve('/nostr/profile/[pubkey=stringSegment]', {
											pubkey: String(nostrProfile[EntityMetaKey.Selector].pubkey ?? ''),
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

		<section
			id={viewDomId + '-article-body'}
			data-scroll-marker-label='Article body'
		>
			<h3>Article body</h3>
			<ResourceBoundary
				resource={
					selection({
						sources: [
							Source.NostrBand_Rest,
						],
						fields: {
							content: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const content = resolvedEntity.content}
					{#if content !== undefined && content !== null && content !== ''}
						<Markdown content={String(content)} />
					{:else}
						<p data-text="muted">No article body yet.</p>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</section>
	{/snippet}
</EntityView>
