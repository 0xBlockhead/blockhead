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
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
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
			selection: RegisteredEntityProxyResource<EntityType.NostrRepost>
			prefetched?: RegisteredEntityProxyPrefetchedData<EntityType.NostrRepost>
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
	const nostrRepost = $derived(selection({
		sources: selection.sources,
		fields: {
			kind: true,
			pubkey: true,
			createdAt: true,
			repostedEventId: true,
		},
	}))
	const titleFallback = $derived([String((pendingEntity.repostedEventId) ?? '')].filter(Boolean).join(' ') || 'Nostr repost')
	const viewDomId = $derived('nostr-repost-' + encodeURIComponent(stringify(selection.entitySelector ?? prefetched[EntityMetaKey.Selector])))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import NostrProfileView from '$/views/NostrProfileView.svelte'
	import NostrNoteView from '$/views/NostrNoteView.svelte'
	import NostrArticleView from '$/views/NostrArticleView.svelte'
</script>


<EntityView
	entityType={EntityType.NostrRepost}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	href={
		href ?? (
			selection.entitySelector != null && 'eventId' in selection.entitySelector
			&& selection.entitySelector.eventId != null ?
				resolve('/nostr/repost/[eventId=stringSegment]', {
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
		<ResourceBoundary resource={nostrRepost}>
			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const repostedEventId0 = resolvedEntity.repostedEventId}
				{#if repostedEventId0 !== undefined && repostedEventId0 !== null}
					<TruncatedValue value={String((repostedEventId0) ?? '')} />
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<TruncatedValue
			value={String(selection.entitySelector.eventId ?? '')}
			format={TruncatedValueFormat.Visual}
		/>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={nostrRepost}>
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
			A Nostr repost is a kind-6 or kind-16 event keyed by event id and linked to the reposted note or article.
		</p>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
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
						<div>
							<dt>Created</dt>
							<dd>
								<Timestamp timestamp={Number(createdAt)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			{#if contentOpen}
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
									{String((kind) ?? '')}
								{/if}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>
			{/if}

			{#if contentOpen}
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
			{/if}

			{#if contentOpen}
				<ResourceBoundary
					resource={
						selection
							.$author({
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
								</dd>
							</div>
						{/if}
					{/snippet}
				</ResourceBoundary>
			{/if}

			{#if contentOpen}
				<ResourceBoundary
					resource={
						selection({
							sources: selection.sources,
							fields: {
								repostedEventId: true,
							},
						})
					}
				>
					{#snippet children(entity)}
						{@const resolvedEntity = { ...pendingEntity, ...entity }}
						{@const repostedEventId = resolvedEntity.repostedEventId}
						{#if repostedEventId !== undefined && repostedEventId !== null}
							<div>
								<dt>Reposted event ID</dt>
								<dd>
									<TruncatedValue value={String((repostedEventId) ?? '')} />
								</dd>
							</div>
						{/if}
					{/snippet}
				</ResourceBoundary>
			{/if}

			{#if contentOpen}
				<ResourceBoundary
					resource={
						selection
							.$repostedNote({
								sources: [
									Source.NostrBand_Rest,
								],
							})
					}
				>
					{#snippet children(nostrNote)}
						{#if nostrNote != null && nostrNote[EntityMetaKey.Selector] != null}
							<div>
								<dt>Reposted note</dt>
								<dd>
									<NostrNoteView
										selection={select(EntityType.NostrNote, nostrNote[EntityMetaKey.Selector])}
										prefetched={nostrNote}
										href={
											(
												nostrNote[EntityMetaKey.Selector] != null && 'eventId' in nostrNote[EntityMetaKey.Selector]
												&& nostrNote[EntityMetaKey.Selector].eventId != null ?
													resolve('/nostr/note/[eventId=stringSegment]', {
												eventId: String(nostrNote[EntityMetaKey.Selector].eventId ?? ''),
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
			{/if}

			{#if contentOpen}
				<ResourceBoundary
					resource={
						selection
							.$repostedArticle({
								sources: [
									Source.NostrBand_Rest,
								],
							})
					}
				>
					{#snippet children(nostrArticle)}
						{#if nostrArticle != null && nostrArticle[EntityMetaKey.Selector] != null}
							<div>
								<dt>Reposted article</dt>
								<dd>
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
								</dd>
							</div>
						{/if}
					{/snippet}
				</ResourceBoundary>
			{/if}
		</dl>
	{/snippet}
</EntityView>
