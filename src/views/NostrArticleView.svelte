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
			prefetched?: RegisteredEntityProxyPrefetchedData<EntityType.NostrArticle>
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
	const nostrArticle = $derived(selection(prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails ? {
		sources: selection.sources,
		fields: {},
	} : {
		sources: selection.sources,
	}))
	const titleFallback = $derived([String((pendingEntity.identifier) ?? '')].filter(Boolean).join(' ') || 'Nostr article')
	const viewDomId = $derived('nostr-article-' + encodeURIComponent(stringify(selection.entitySelector ?? prefetched[EntityMetaKey.Selector])))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import NostrArticleEventsView from '$/views/NostrArticleEventsView.svelte'
	import NostrArticleEventView from '$/views/NostrArticleEventView.svelte'
</script>


<EntityView
	entityType={EntityType.NostrArticle}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	href={
		href ?? (
			selection.entitySelector.kind === 30023
			&& selection.entitySelector != null && 'pubkey' in selection.entitySelector
			&& selection.entitySelector.pubkey != null
			&& selection.entitySelector != null && 'identifier' in selection.entitySelector
			&& selection.entitySelector.identifier != null ?
				resolve('/nostr/article/[pubkey=stringSegment]/[identifier=stringSegment]', {
			pubkey: String(selection.entitySelector.pubkey ?? ''),
			identifier: String(selection.entitySelector.identifier ?? ''),
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
		<ResourceBoundary resource={nostrArticle}>
			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				<ResourceBoundary
					resource={
						selection
							.$latestEvent({
								sources: [
									Source.NostrBand_Rest,
									Source.Primal_Rest,
								],
							})
					}
				>
					{#snippet children(nostrArticleEvent)}
						{#if nostrArticleEvent != null && nostrArticleEvent[EntityMetaKey.Selector] != null}
							<NostrArticleEventView
								selection={select(EntityType.NostrArticleEvent, nostrArticleEvent[EntityMetaKey.Selector])}
								prefetched={nostrArticleEvent}
								href=""
								layout={EntityLayout.Title}
								open={false}
							/>
						{/if}
					{/snippet}
				</ResourceBoundary>
				{@const identifier1 = resolvedEntity.identifier}
				{#if identifier1 !== undefined && identifier1 !== null}
					{String((identifier1) ?? '')}
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={nostrArticle}>
			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const pubkey0 = resolvedEntity.pubkey}
				{#if pubkey0 !== undefined && pubkey0 !== null}
					<TruncatedValue value={String((pubkey0) ?? '')} />
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={nostrArticle}>
			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const kind0 = resolvedEntity.kind}
				{#if kind0 !== undefined && kind0 !== null}
					<span data-text="muted">
						<span>kind </span>
						{String((kind0) ?? '')}
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
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					selection
						.$latestEvent({
							sources: [
								Source.NostrBand_Rest,
								Source.Primal_Rest,
							],
						})
				}
			>
				{#snippet children(nostrArticleEvent)}
					{#if nostrArticleEvent != null && nostrArticleEvent[EntityMetaKey.Selector] != null}
						<div>
							<dt>Latest signed version</dt>
							<dd>
								<NostrArticleEventView
									selection={select(EntityType.NostrArticleEvent, nostrArticleEvent[EntityMetaKey.Selector])}
									prefetched={nostrArticleEvent}
									href={
										(
											nostrArticleEvent[EntityMetaKey.Selector] != null && 'eventId' in nostrArticleEvent[EntityMetaKey.Selector]
											&& nostrArticleEvent[EntityMetaKey.Selector].eventId != null ?
												resolve('/nostr/article-version/[eventId=stringSegment]', {
											eventId: String(nostrArticleEvent[EntityMetaKey.Selector].eventId ?? ''),
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
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
				{@const nostrArticleNostrArticleEventsViewEventsResource = selection
		.$$events({
			sources: [
				Source.NostrBand_Rest,
				Source.Primal_Rest,
			],
		})}
				<ResourceBoundary
					resource={nostrArticleNostrArticleEventsViewEventsResource}
				>
					{#snippet children(entities)}
						{#if entities.values.length > 0}
						<NostrArticleEventsView
							selection={nostrArticleNostrArticleEventsViewEventsResource}
							countResource={nostrArticleNostrArticleEventsViewEventsResource.count}
							title='Signed version history'
							id='NostrArticleEventsView-events'
						/>
						{/if}
					{/snippet}
				</ResourceBoundary>
	{/snippet}
</EntityView>
