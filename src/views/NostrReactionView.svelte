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
			selection: RegisteredEntityProxyResource<EntityType.NostrReaction>
			prefetched?: RegisteredEntityProxyPrefetchedData<EntityType.NostrReaction>
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
	const nostrReaction = $derived(selection({
		sources: selection.sources,
		fields: {
			kind: true,
			pubkey: true,
			createdAt: true,
			content: true,
		},
	}))
	const titleFallback = $derived([String((pendingEntity.content) ?? '')].filter(Boolean).join(' ') || [String((pendingEntity.eventId) ?? '')].filter(Boolean).join(' ') || 'Nostr reaction')
	const viewDomId = $derived('nostr-reaction-' + encodeURIComponent(stringify(selection.entitySelector ?? prefetched[EntityMetaKey.Selector])))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import NostrProfileView from '$/views/NostrProfileView.svelte'
	import NostrNoteView from '$/views/NostrNoteView.svelte'
	import NostrArticleView from '$/views/NostrArticleView.svelte'
</script>


<EntityView
	entityType={EntityType.NostrReaction}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	href={
		href ?? (
			selection.entitySelector != null && 'eventId' in selection.entitySelector
			&& selection.entitySelector.eventId != null ?
				resolve('/nostr/reaction/[eventId=stringSegment]', {
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
		<ResourceBoundary
			resource={nostrReaction}
			placeholderText="Loading reaction..."
		>
			{#snippet Pending()}
				<TruncatedValue
					value={String(selection.entitySelector.eventId ?? '')}
					format={TruncatedValueFormat.Visual}
				/>
			{/snippet}

			{#snippet children(entity)}
				{String(entity.content ?? '') || '+'}
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
		<ResourceBoundary resource={nostrReaction}>
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
			A Nostr reaction is a kind-7 event keyed by event id and scoped to the note or article it reacts to.
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
						selection
							.$targetNote({
								sources: [
									Source.NostrBand_Rest,
								],
							})
					}
				>
					{#snippet children(nostrNote)}
						{#if nostrNote != null && nostrNote[EntityMetaKey.Selector] != null}
							<div>
								<dt>Target note</dt>
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
							.$targetArticle({
								sources: [
									Source.NostrBand_Rest,
								],
							})
					}
				>
					{#snippet children(nostrArticle)}
						{#if nostrArticle != null && nostrArticle[EntityMetaKey.Selector] != null}
							<div>
								<dt>Target article</dt>
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

		<ResourceBoundary
			resource={
				selection({
					sources: selection.sources,
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
					<p>{String((content) ?? '')}</p>
				{:else}
					<p data-text="muted">No reaction content available.</p>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
