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
	import { stringify } from 'devalue'
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
	let revealedContentWarningSelectorKey = $state<string>()
	const contentWarningSelectorKey = $derived(stringify(selection.entitySelector ?? prefetched[EntityMetaKey.Selector]))
	const nostrArticle = $derived(selection({
		sources: selection.sources,
		fields: {
			title: true,
			summary: true,
			imageUrl: true,
			publishedAt: true,
			sensitive: true,
			contentWarning: true,
		},
	}))
	const titleFallback = $derived((pendingEntity.sensitive === true || String(pendingEntity.contentWarning ?? '').trim() !== '' ? [String(pendingEntity.contentWarning ?? '').trim() || 'Sensitive content', [String((pendingEntity.kind) ?? ''), String((pendingEntity.pubkey) ?? ''), String((pendingEntity.identifier) ?? '')].filter(Boolean).join(' ')].filter(Boolean).join(' ') : [String((pendingEntity.title) ?? ''), String((pendingEntity.identifier) ?? '')].filter(Boolean).join(' ') || 'Nostr article'))
	const viewDomId = $derived('nostr-article-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import Collapsible from '$/components/Collapsible.svelte'
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
		{#if prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails}
			{(pendingEntity.sensitive === true || String(pendingEntity.contentWarning ?? '').trim() !== '' ? [String(pendingEntity.contentWarning ?? '').trim() || 'Sensitive content', [String((pendingEntity.kind) ?? ''), String((pendingEntity.pubkey) ?? ''), String((pendingEntity.identifier) ?? '')].filter(Boolean).join(' ')].filter(Boolean).join(' ') : [String((pendingEntity.title) ?? ''), String((pendingEntity.identifier) ?? '')].filter(Boolean).join(' ') || title || titleFallback)}
		{:else}
			<ResourceBoundary resource={nostrArticle}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{(resolvedEntity.sensitive === true || String(resolvedEntity.contentWarning ?? '').trim() !== '' ? [String(resolvedEntity.contentWarning ?? '').trim() || 'Sensitive content', [String((resolvedEntity.kind) ?? ''), String((resolvedEntity.pubkey) ?? ''), String((resolvedEntity.identifier) ?? '')].filter(Boolean).join(' ')].filter(Boolean).join(' ') : [String((resolvedEntity.title) ?? ''), String((resolvedEntity.identifier) ?? '')].filter(Boolean).join(' ') || title || titleFallback)}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Value()}
		{#if prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails}
			{(pendingEntity.sensitive === true || String(pendingEntity.contentWarning ?? '').trim() !== '' ? [String(pendingEntity.contentWarning ?? '').trim() || 'Sensitive content', [String((pendingEntity.kind) ?? ''), String((pendingEntity.pubkey) ?? ''), String((pendingEntity.identifier) ?? '')].filter(Boolean).join(' ')].filter(Boolean).join(' ') : [String((pendingEntity.identifier) ?? '')].filter(Boolean).join(' ') || [String((pendingEntity.title) ?? ''), String((pendingEntity.identifier) ?? '')].filter(Boolean).join(' ') || titleFallback)}
		{:else}
			<ResourceBoundary resource={nostrArticle}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{(resolvedEntity.sensitive === true || String(resolvedEntity.contentWarning ?? '').trim() !== '' ? [String(resolvedEntity.contentWarning ?? '').trim() || 'Sensitive content', [String((resolvedEntity.kind) ?? ''), String((resolvedEntity.pubkey) ?? ''), String((resolvedEntity.identifier) ?? '')].filter(Boolean).join(' ')].filter(Boolean).join(' ') : [String((resolvedEntity.identifier) ?? '')].filter(Boolean).join(' ') || [String((resolvedEntity.title) ?? ''), String((resolvedEntity.identifier) ?? '')].filter(Boolean).join(' ') || titleFallback)}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet HeadingAfter()}
		{#if prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails}
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
		{:else}
			<ResourceBoundary resource={nostrArticle}>
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
		{/if}
	{/snippet}

	{#snippet TypeAnnotationTooltip()}
		<p>
			A Nostr long-form article is a replaceable kind-30023 event addressed by author public key and identifier.
		</p>
	{/snippet}

	{#snippet ContentWarningContent(content)}
		{#if content !== undefined && content !== null && content !== ''}
			<Markdown content={String(content)} />
		{/if}
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Identifier</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									identifier: true,
								},
							})
						}
					>
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
								sources: selection.sources,
								fields: {
									pubkey: true,
								},
							})
						}
					>
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
								sources: selection.sources,
								fields: {
									kind: true,
								},
							})
						}
					>
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
						sources: selection.sources,
						fields: {
							publishedAt: true,
						},
					})
				}
			>
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
						sources: selection.sources,
						fields: {
							summary: true,
						},
					})
				}
			>
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
						sources: selection.sources,
						fields: {
							imageUrl: true,
						},
					})
				}
			>
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

		<ResourceBoundary
			resource={
				selection({
					sources: selection.sources,
					fields: {
						content: true,
						sensitive: true,
						contentWarning: true,
					},
				})
			}
		>
			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const content = resolvedEntity.content}
				{@const contentWarningText = String(resolvedEntity.contentWarning ?? '').trim()}
				{@const hasContentWarning = resolvedEntity.sensitive === true || String(resolvedEntity.contentWarning ?? '').trim() !== ''}
				{#if hasContentWarning}
					<Collapsible
						open={revealedContentWarningSelectorKey === contentWarningSelectorKey}
						ontoggle={(event) => {
							revealedContentWarningSelectorKey = event.currentTarget.open ? contentWarningSelectorKey : undefined
						}}
					>
						{#snippet Summary()}
							<header data-row="align-center gap-3 wrap">
								<strong>{contentWarningText || 'Sensitive content'}</strong>
								<span data-text="annotation">Show content</span>
							</header>
						{/snippet}
						{@render ContentWarningContent(content)}
					</Collapsible>
				{:else}
					{@render ContentWarningContent(content)}
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
