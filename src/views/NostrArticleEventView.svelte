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
			selection: RegisteredEntityProxyResource<EntityType.NostrArticleEvent>
			prefetched?: RegisteredEntityProxyPrefetchedData<EntityType.NostrArticleEvent>
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
	const nostrArticleEvent = $derived(selection(prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails ? {
		sources: selection.sources,
		fields: {
			identifier: true,
			createdAt: true,
			title: true,
			sensitive: true,
			contentWarning: true,
		},
	} : {
		sources: selection.sources,
		fields: {
			pubkey: true,
			identifier: true,
			kind: true,
			createdAt: true,
			signature: true,
			title: true,
			summary: true,
			imageUrl: true,
			publishedAt: true,
			sensitive: true,
			contentWarning: true,
		},
	}))
	const titleFallback = $derived((pendingEntity.sensitive === true || String(pendingEntity.contentWarning ?? '').trim() !== '' ? [String(pendingEntity.contentWarning ?? '').trim() || 'Sensitive content', [String((pendingEntity.eventId) ?? '')].filter(Boolean).join(' ')].filter(Boolean).join(' ') : [String((pendingEntity.title) ?? ''), String((pendingEntity.identifier) ?? '')].filter(Boolean).join(' ') || [String((pendingEntity.eventId) ?? '')].filter(Boolean).join(' ') || 'Nostr article event'))
	const viewDomId = $derived('nostr-article-event-' + encodeURIComponent(stringify(selection.entitySelector ?? prefetched[EntityMetaKey.Selector])))


	// Components
	import Collapsible from '$/components/Collapsible.svelte'
	import Markdown from '$/components/Markdown.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import NostrArticleView from '$/views/NostrArticleView.svelte'
	import NostrProfileView from '$/views/NostrProfileView.svelte'
</script>


<EntityView
	entityType={EntityType.NostrArticleEvent}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	href={
		href ?? (
			selection.entitySelector != null && 'eventId' in selection.entitySelector
			&& selection.entitySelector.eventId != null ?
				resolve('/nostr/article-version/[eventId=stringSegment]', {
			eventId: String(selection.entitySelector.eventId ?? ''),
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
		<ResourceBoundary resource={nostrArticleEvent}>
			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{(resolvedEntity.sensitive === true || String(resolvedEntity.contentWarning ?? '').trim() !== '' ? [String(resolvedEntity.contentWarning ?? '').trim() || 'Sensitive content', [String((resolvedEntity.eventId) ?? '')].filter(Boolean).join(' ')].filter(Boolean).join(' ') : [String((resolvedEntity.title) ?? ''), String((resolvedEntity.identifier) ?? '')].filter(Boolean).join(' ') || title || titleFallback)}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={nostrArticleEvent}>
			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{(resolvedEntity.sensitive === true || String(resolvedEntity.contentWarning ?? '').trim() !== '' ? [String(resolvedEntity.contentWarning ?? '').trim() || 'Sensitive content', [String((resolvedEntity.eventId) ?? '')].filter(Boolean).join(' ')].filter(Boolean).join(' ') : [String((resolvedEntity.eventId) ?? '')].filter(Boolean).join(' ') || [String((resolvedEntity.title) ?? ''), String((resolvedEntity.identifier) ?? '')].filter(Boolean).join(' ') || titleFallback)}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={nostrArticleEvent}>
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
	{/snippet}

	{#snippet TypeAnnotationTooltip()}
		<p>
			One cryptographically signed kind-30023 version of a stable Nostr article coordinate.
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
				<dt>Article</dt>
				<dd>
					<ResourceBoundary
						resource={selection.$article}
					>
						{#snippet children(nostrArticle)}
							{#if nostrArticle != null && nostrArticle[EntityMetaKey.Selector] != null}
								<NostrArticleView
									selection={select(EntityType.NostrArticle, nostrArticle[EntityMetaKey.Selector])}
									prefetched={nostrArticle}
									href={
										(
											nostrArticle[EntityMetaKey.Selector].kind === 30023
											&& nostrArticle[EntityMetaKey.Selector] != null && 'pubkey' in nostrArticle[EntityMetaKey.Selector]
											&& nostrArticle[EntityMetaKey.Selector].pubkey != null
											&& nostrArticle[EntityMetaKey.Selector] != null && 'identifier' in nostrArticle[EntityMetaKey.Selector]
											&& nostrArticle[EntityMetaKey.Selector].identifier != null ?
												resolve('/nostr/article/[pubkey=stringSegment]/[identifier=stringSegment]', {
											pubkey: String(nostrArticle[EntityMetaKey.Selector].pubkey ?? ''),
											identifier: String(nostrArticle[EntityMetaKey.Selector].identifier ?? ''),
										})
										:
												undefined
										)
									}
									layout={EntityLayout.Value}
									open={false}
								/>
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Author</dt>
				<dd>
					<ResourceBoundary
						resource={selection.$author}
					>
						{#snippet children(nostrProfile)}
							{#if nostrProfile != null && nostrProfile[EntityMetaKey.Selector] != null}
								<NostrProfileView
									selection={select(EntityType.NostrProfile, nostrProfile[EntityMetaKey.Selector])}
									prefetched={nostrProfile}
									href={
										(
											nostrProfile[EntityMetaKey.Selector] != null && 'pubkey' in nostrProfile[EntityMetaKey.Selector]
											&& nostrProfile[EntityMetaKey.Selector].pubkey != null ?
												resolve('/nostr/profile/[pubkey=stringSegment]', {
											pubkey: String(nostrProfile[EntityMetaKey.Selector].pubkey ?? ''),
										})
										:
												undefined
										)
									}
									layout={EntityLayout.Value}
									open={false}
								/>
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Created</dt>
				<dd>
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
								<Timestamp timestamp={Number(createdAt)} />
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

			<div>
				<dt>Event ID</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									eventId: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const eventId = resolvedEntity.eventId}
							{#if eventId !== undefined && eventId !== null}
								<TruncatedValue value={String((eventId) ?? '')} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Signature</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									signature: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const signature = resolvedEntity.signature}
							{#if signature !== undefined && signature !== null}
								<TruncatedValue value={String((signature) ?? '')} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
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

						{#if revealedContentWarningSelectorKey === contentWarningSelectorKey}
							{@render ContentWarningContent(content)}
						{/if}
					</Collapsible>
				{:else}
					{@render ContentWarningContent(content)}
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
