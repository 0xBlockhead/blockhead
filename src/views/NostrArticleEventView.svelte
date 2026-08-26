<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { untrack } from 'svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { stringify } from 'devalue'


	// Context
	import { getAppClient } from '$/routes/applicationClient.ts'


	const select = getAppClient().select

	// State
	let {
		selection,
		prefetched = {},
		title,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: EntitySelectionViewProps<EntityType.NostrArticleEvent> = $props()

	const pendingEntity = $derived({ ...selection.entitySelector, ...prefetched })
	let revealedContentWarningSelectorKey = $state<string>()
	const contentWarningSelectorKey = $derived(stringify(selection.entitySelector))
	const nostrArticleEvent = $derived(selection({
		fields: {
			identifier: true,
			createdAt: true,
			signature: true,
			title: true,
			publishedAt: true,
			sensitive: true,
			contentWarning: true,
		},
	}))
	const titleFallback = $derived((
		pendingEntity.sensitive === true || (pendingEntity.contentWarning ?? '').trim() !== '' ?
			[(pendingEntity.contentWarning ?? '').trim() || 'Sensitive content', (pendingEntity.eventId ?? '')].filter(Boolean).join(' ')
		:
			[(prefetched.title ?? ''), (prefetched.identifier ?? '')].filter(Boolean).join(' ') || selection.entitySelector.eventId || 'Nostr article event'
	))


	// Components
	import Collapsible from '$/components/Collapsible.svelte'
	import Markdown from '$/components/Markdown.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import NostrArticleView from '$/views/NostrArticleView.svelte'
	import NostrProfileView from '$/views/NostrProfileView.svelte'
	import MediaView from '$/views/MediaView.svelte'
</script>


<EntityView
	entityType={EntityType.NostrArticleEvent}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	href={
		href === undefined ?
			resolve(
				'/(social)/(nostr)/nostr/(globalNostrNetwork)/article-version/[eventId=stringSegment]',
				{
					eventId: selection.entitySelector.eventId,
				}
			)
		:
			href ?? undefined
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Icon()}
		<ResourceBoundary resource={nostrArticleEvent}>
			{#snippet children(entity)}
				{@const reference = entity.$image}
				{#if reference != null}
					<MediaView
						selection={select(EntityType.Media, reference[EntityMetaKey.Selector])}
						prefetched={reference}
						layout={EntityLayout.Value}
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Title()}
		<ResourceBoundary resource={nostrArticleEvent}>
			{#snippet children(entity)}
				{
					entity.sensitive === true || (entity.contentWarning ?? '').trim() !== '' ?
							[(entity.contentWarning ?? '').trim() || 'Sensitive content', (pendingEntity.eventId ?? '')].filter(Boolean).join(' ')
						:
							[(entity.title ?? ''), entity.identifier].filter(Boolean).join(' ') || title || titleFallback
				}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={nostrArticleEvent}>
			{#snippet children(entity)}
				{
					entity.sensitive === true || (entity.contentWarning ?? '').trim() !== '' ?
							[(entity.contentWarning ?? '').trim() || 'Sensitive content', (pendingEntity.eventId ?? '')].filter(Boolean).join(' ')
						:
							selection.entitySelector.eventId || [(entity.title ?? ''), entity.identifier].filter(Boolean).join(' ') || titleFallback
				}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={nostrArticleEvent}>
			{#snippet children(entity)}
				<span data-text="muted">
					<Timestamp timestamp={entity.createdAt} />
				</span>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet ContentWarningContent(content)}
		{#if content != null && content !== ''}
			<Markdown content={content} />
		{/if}
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>Article</dt>
				<dd>
					<ResourceBoundary
						resource={selection.$article}
					>
						{#snippet children(nostrArticle)}
							{@const nostrArticleInitial = untrack(() => nostrArticle)}
							<NostrArticleView
								selection={select(EntityType.NostrArticle, (nostrArticle ?? nostrArticleInitial)[EntityMetaKey.Selector])}
								layout={EntityLayout.Value}
							/>
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
							{@const nostrProfileInitial = untrack(() => nostrProfile)}
							<NostrProfileView
								selection={select(EntityType.NostrProfile, (nostrProfile ?? nostrProfileInitial)[EntityMetaKey.Selector])}
								layout={EntityLayout.Value}
							/>
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Created</dt>
				<dd>
					<ResourceBoundary
						resource={nostrArticleEvent}
					>
						{#snippet children(entity)}
							<Timestamp timestamp={entity.createdAt} />
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={nostrArticleEvent}
			>
				{#snippet children(entity)}
					{@const publishedAt = entity.publishedAt}
					{#if publishedAt != null}
						<div>
							<dt>Published</dt>
							<dd>
								<Timestamp timestamp={publishedAt} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<div>
				<dt>Event ID</dt>
				<dd>
					<TruncatedValue value={selection.entitySelector.eventId} />
				</dd>
			</div>

			<div>
				<dt>Signature</dt>
				<dd>
					<ResourceBoundary
						resource={nostrArticleEvent}
					>
						{#snippet children(entity)}
							<TruncatedValue value={entity.signature} />
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>

		<ResourceBoundary
			resource={
				selection({
					fields: {
						content: true,
						sensitive: true,
						contentWarning: true,
					},
				})
			}
		>
			{#snippet children(entity)}
				{@const content = entity.content}
				{@const contentWarningText = (entity.contentWarning ?? '').trim()}
				{#if entity.sensitive === true || contentWarningText !== ''}
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
