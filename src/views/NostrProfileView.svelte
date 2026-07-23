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
			selection: RegisteredEntityProxyResource<EntityType.NostrProfile>
			prefetched?: RegisteredEntityProxyPrefetchedData<EntityType.NostrProfile>
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
	const nostrProfile = $derived(selection(prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails ? {
		sources: selection.sources,
		fields: {},
	} : {
		sources: selection.sources,
	}))
	const titleFallback = $derived([String((pendingEntity.pubkey) ?? '')].filter(Boolean).join(' ') || 'Nostr profile')
	const viewDomId = $derived('nostr-profile-' + encodeURIComponent(stringify(selection.entitySelector ?? prefetched[EntityMetaKey.Selector])))


	// Components
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import NostrProfileMetadataEventsView from '$/views/NostrProfileMetadataEventsView.svelte'
	import NostrProfileMetadataEventView from '$/views/NostrProfileMetadataEventView.svelte'
	import NostrNotesView from '$/views/NostrNotesView.svelte'
	import NostrArticlesView from '$/views/NostrArticlesView.svelte'
	import NostrRepostsView from '$/views/NostrRepostsView.svelte'
</script>


<EntityView
	entityType={EntityType.NostrProfile}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	href={
		href ?? (
			selection.entitySelector != null && 'pubkey' in selection.entitySelector
			&& selection.entitySelector.pubkey != null ?
				resolve('/nostr/profile/[pubkey=stringSegment]', {
			pubkey: String(selection.entitySelector.pubkey ?? ''),
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
		<ResourceBoundary resource={nostrProfile}>
			{#snippet children(entity)}
				<ResourceBoundary
					resource={
						selection
							.$latestMetadataEvent({
								sources: [
									Source.NostrBand_Rest,
									Source.Primal_Rest,
								],
							})
					}
				>
					{#snippet children(nostrProfileMetadataEvent)}
						{#if nostrProfileMetadataEvent != null && nostrProfileMetadataEvent[EntityMetaKey.Selector] != null}
							<NostrProfileMetadataEventView
								selection={select(EntityType.NostrProfileMetadataEvent, nostrProfileMetadataEvent[EntityMetaKey.Selector])}
								prefetched={nostrProfileMetadataEvent}
								href=""
								layout={EntityLayout.Title}
								open={false}
							/>
						{/if}
					{/snippet}
				</ResourceBoundary>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet TypeAnnotationTooltip()}
		<p>
			A Nostr profile is replaceable kind-0 metadata keyed by a 64-character lowercase hex public key.
		</p>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Pubkey</dt>
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
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					selection
						.$latestMetadataEvent({
							sources: [
								Source.NostrBand_Rest,
								Source.Primal_Rest,
							],
						})
				}
			>
				{#snippet children(nostrProfileMetadataEvent)}
					{#if nostrProfileMetadataEvent != null && nostrProfileMetadataEvent[EntityMetaKey.Selector] != null}
						<div>
							<dt>Latest signed metadata</dt>
							<dd>
								<NostrProfileMetadataEventView
									selection={select(EntityType.NostrProfileMetadataEvent, nostrProfileMetadataEvent[EntityMetaKey.Selector])}
									prefetched={nostrProfileMetadataEvent}
									href={
										(
											nostrProfileMetadataEvent[EntityMetaKey.Selector] != null && 'eventId' in nostrProfileMetadataEvent[EntityMetaKey.Selector]
											&& nostrProfileMetadataEvent[EntityMetaKey.Selector].eventId != null ?
												resolve('/nostr/profile-metadata-version/[eventId=stringSegment]', {
											eventId: String(nostrProfileMetadataEvent[EntityMetaKey.Selector].eventId ?? ''),
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
				{@const nostrProfileNostrProfileMetadataEventsViewMetadataEventsResource = selection
		.$$metadataEvents({
			sources: [
				Source.NostrBand_Rest,
				Source.Primal_Rest,
			],
		})}
				<ResourceBoundary
					resource={nostrProfileNostrProfileMetadataEventsViewMetadataEventsResource}
				>
					{#snippet children(entities)}
						{#if entities.values.length > 0}
						<NostrProfileMetadataEventsView
							selection={nostrProfileNostrProfileMetadataEventsViewMetadataEventsResource}
							countResource={nostrProfileNostrProfileMetadataEventsViewMetadataEventsResource.count}
							title='Signed metadata history'
							id='NostrProfileMetadataEventsView-metadata-events'
						/>
						{/if}
					{/snippet}
				</ResourceBoundary>

				<CollapsibleTabs
					id={viewDomId + '-carousel-nostr-profile-content'}
					sectionIdPrefix={viewDomId}
					sections={
						[
							{
								id: 'nostr-profile-notes',
								label: 'Notes',
								ownsSection: true,
							},
							{
								id: 'nostr-profile-articles',
								label: 'Articles',
								ownsSection: true,
							},
						]
					}
					data-card
					class='network-view-collapsible-content'
				>
					{#snippet Summary()}
						<header data-row-item="flexible" data-row="wrap gap-4">
							<HeadingComponent>Notes and articles</HeadingComponent>
						</header>
					{/snippet}

					{#snippet MarkerNostrProfileNotes(_context, Content)}
						{@const nostrProfileContentNostrProfileNotesResource = selection
		.$$notes({
			sources: [
				Source.Constants_Internal,
				Source.NostrBand_Rest,
			],
		})}
						<ResourceBoundary
							resource={nostrProfileContentNostrProfileNotesResource}
						>
							{#snippet children(_resolved)}
								{@render Content()}
							{/snippet}

							{#snippet PendingContent()}
								{@render Content()}
							{/snippet}

							{#snippet FailedContent(_error, _retry)}
								{@render Content()}
							{/snippet}
						</ResourceBoundary>
					{/snippet}

					{#snippet SectionNostrProfileNotes({ id, label, open, active })}
						{@const nostrProfileContentNostrProfileNotesResource = selection
		.$$notes({
			sources: [
				Source.Constants_Internal,
				Source.NostrBand_Rest,
			],
		})}
						<ResourceBoundary
							resource={nostrProfileContentNostrProfileNotesResource}
						>
							{#snippet children(nostrNote)}
								<section
									id={id}
									aria-labelledby={`${id}:marker`}
									data-scroll-marker-label={label}
									data-column-item="flexible"
									data-column
									data-active={active}
								>
									<NostrNotesView
										selection={nostrProfileContentNostrProfileNotesResource}
										CollapsibleProps={{ canToggle: false }}
										collapsible={false}
										data-column-item="flexible"
										data-card
										data-scroll-container
										open={open}
										title={label}
										emptyText='No notes in this observed.'
										id={`${id}-list`}
									/>
								</section>
							{/snippet}

							{#snippet Pending()}
								<section id={id} aria-labelledby={`${id}:marker`} data-scroll-marker-label={label} data-column-item="flexible" data-column data-active={active}>
									<article id={`${id}-list`} data-column-item="flexible" data-card data-scroll-container>
										<span data-tag data-text="muted" data-resource-state="pending" class="loading inline-placeholder" aria-busy="true" aria-label="Loading…">•••</span>
									</article>
								</section>
							{/snippet}

							{#snippet Failed(_error, _retry)}
								<section id={id} aria-labelledby={`${id}:marker`} data-scroll-marker-label={label} data-column-item="flexible" data-column data-active={active}>
									<article id={`${id}-list`} data-column-item="flexible" data-card data-scroll-container>
										<span data-tag data-resource-state="failed" class="inline-placeholder" aria-label="Failed to load">•••</span>
									</article>
								</section>
							{/snippet}
						</ResourceBoundary>
					{/snippet}

					{#snippet MarkerNostrProfileArticles(_context, Content)}
						{@const nostrProfileContentNostrProfileArticlesResource = selection
		.$$articles({
			sources: [
				Source.Constants_Internal,
				Source.NostrBand_Rest,
			],
		})}
						<ResourceBoundary
							resource={nostrProfileContentNostrProfileArticlesResource}
						>
							{#snippet children(_resolved)}
								{@render Content()}
							{/snippet}

							{#snippet PendingContent()}
								{@render Content()}
							{/snippet}

							{#snippet FailedContent(_error, _retry)}
								{@render Content()}
							{/snippet}
						</ResourceBoundary>
					{/snippet}

					{#snippet SectionNostrProfileArticles({ id, label, open, active })}
						{@const nostrProfileContentNostrProfileArticlesResource = selection
		.$$articles({
			sources: [
				Source.Constants_Internal,
				Source.NostrBand_Rest,
			],
		})}
						<ResourceBoundary
							resource={nostrProfileContentNostrProfileArticlesResource}
						>
							{#snippet children(nostrArticle)}
								<section
									id={id}
									aria-labelledby={`${id}:marker`}
									data-scroll-marker-label={label}
									data-column-item="flexible"
									data-column
									data-active={active}
								>
									<NostrArticlesView
										selection={nostrProfileContentNostrProfileArticlesResource}
										CollapsibleProps={{ canToggle: false }}
										collapsible={false}
										data-column-item="flexible"
										data-card
										data-scroll-container
										open={open}
										title={label}
										emptyText='No articles in this observed.'
										id={`${id}-list`}
									/>
								</section>
							{/snippet}

							{#snippet Pending()}
								<section id={id} aria-labelledby={`${id}:marker`} data-scroll-marker-label={label} data-column-item="flexible" data-column data-active={active}>
									<article id={`${id}-list`} data-column-item="flexible" data-card data-scroll-container>
										<span data-tag data-text="muted" data-resource-state="pending" class="loading inline-placeholder" aria-busy="true" aria-label="Loading…">•••</span>
									</article>
								</section>
							{/snippet}

							{#snippet Failed(_error, _retry)}
								<section id={id} aria-labelledby={`${id}:marker`} data-scroll-marker-label={label} data-column-item="flexible" data-column data-active={active}>
									<article id={`${id}-list`} data-column-item="flexible" data-card data-scroll-container>
										<span data-tag data-resource-state="failed" class="inline-placeholder" aria-label="Failed to load">•••</span>
									</article>
								</section>
							{/snippet}
						</ResourceBoundary>
					{/snippet}

				</CollapsibleTabs>

				<CollapsibleTabs
					id={viewDomId + '-carousel-nostr-profile-engagement'}
					sectionIdPrefix={viewDomId}
					sections={
						[
							{
								id: 'nostr-profile-reposts',
								label: 'Reposts',
								ownsSection: true,
							},
						]
					}
					data-card
					class='network-view-collapsible-engagement'
				>
					{#snippet Summary()}
						<header data-row-item="flexible" data-row="wrap gap-4">
							<HeadingComponent>Engagement</HeadingComponent>
						</header>
					{/snippet}

					{#snippet MarkerNostrProfileReposts(_context, Content)}
						{@const nostrProfileEngagementNostrProfileRepostsResource = selection
		.$$reposts({
			sources: [
				Source.Constants_Internal,
				Source.NostrBand_Rest,
			],
		})}
						<ResourceBoundary
							resource={nostrProfileEngagementNostrProfileRepostsResource}
						>
							{#snippet children(_resolved)}
								{@render Content()}
							{/snippet}

							{#snippet PendingContent()}
								{@render Content()}
							{/snippet}

							{#snippet FailedContent(_error, _retry)}
								{@render Content()}
							{/snippet}
						</ResourceBoundary>
					{/snippet}

					{#snippet SectionNostrProfileReposts({ id, label, open, active })}
						{@const nostrProfileEngagementNostrProfileRepostsResource = selection
		.$$reposts({
			sources: [
				Source.Constants_Internal,
				Source.NostrBand_Rest,
			],
		})}
						<ResourceBoundary
							resource={nostrProfileEngagementNostrProfileRepostsResource}
						>
							{#snippet children(nostrRepost)}
								<section
									id={id}
									aria-labelledby={`${id}:marker`}
									data-scroll-marker-label={label}
									data-column-item="flexible"
									data-column
									data-active={active}
								>
									<NostrRepostsView
										selection={nostrProfileEngagementNostrProfileRepostsResource}
										CollapsibleProps={{ canToggle: false }}
										collapsible={false}
										data-column-item="flexible"
										data-card
										data-scroll-container
										open={open}
										title={label}
										emptyText='No reposts in this observed.'
										id={`${id}-list`}
									/>
								</section>
							{/snippet}

							{#snippet Pending()}
								<section id={id} aria-labelledby={`${id}:marker`} data-scroll-marker-label={label} data-column-item="flexible" data-column data-active={active}>
									<article id={`${id}-list`} data-column-item="flexible" data-card data-scroll-container>
										<span data-tag data-text="muted" data-resource-state="pending" class="loading inline-placeholder" aria-busy="true" aria-label="Loading…">•••</span>
									</article>
								</section>
							{/snippet}

							{#snippet Failed(_error, _retry)}
								<section id={id} aria-labelledby={`${id}:marker`} data-scroll-marker-label={label} data-column-item="flexible" data-column data-active={active}>
									<article id={`${id}-list`} data-column-item="flexible" data-card data-scroll-container>
										<span data-tag data-resource-state="failed" class="inline-placeholder" aria-label="Failed to load">•••</span>
									</article>
								</section>
							{/snippet}
						</ResourceBoundary>
					{/snippet}

				</CollapsibleTabs>
	{/snippet}
</EntityView>
