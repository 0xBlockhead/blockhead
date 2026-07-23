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
	import { UrlString } from '$/schema/UrlString.ts'
	import { Source } from '$/sources/Source.ts'


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
			selection: RegisteredEntityProxyResource<EntityType._GlobalNostrNetwork>
			prefetched?: RegisteredEntityProxyPrefetchedData<EntityType._GlobalNostrNetwork>
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
	const globalNostrNetwork = $derived(selection(prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails ? {
		sources: selection.sources,
		fields: {},
	} : {
		sources: selection.sources,
		fields: {
			protocolName: true,
			registryName: true,
			homeUrl: true,
			docsUrl: true,
			relationshipModel: true,
		},
	}))
	const titleFallback = $derived(['Nostr'].filter(Boolean).join(' ') || 'Nostr')
	const viewDomId = $derived('-global-nostr-network-' + encodeURIComponent(stringify(selection.entitySelector ?? prefetched[EntityMetaKey.Selector])))


	// Components
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import NostrProfilesView from '$/views/NostrProfilesView.svelte'
	import NostrRelaysView from '$/views/NostrRelaysView.svelte'
	import NostrNotesView from '$/views/NostrNotesView.svelte'
	import NostrArticlesView from '$/views/NostrArticlesView.svelte'
	import NostrRepostsView from '$/views/NostrRepostsView.svelte'
</script>


<EntityView
	entityType={EntityType._GlobalNostrNetwork}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	href={
		href ?? (
			selection.entitySelector.scope === '_GlobalNostrNetwork' ?
				resolve('/nostr')
		:
				undefined
		)
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{#if layout !== EntityLayout.SummaryDetails}
			{['Nostr'].filter(Boolean).join(' ') || title || titleFallback}
		{:else}
			<ResourceBoundary resource={globalNostrNetwork}>
				{#snippet children(entity)}
					{['Nostr'].filter(Boolean).join(' ') || title || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet TypeAnnotationTooltip()}
		<p>
			Nostr is a relay-based social protocol for signed events. Profiles, notes, reposts, and articles are event kinds; relays are transport endpoints and are not global proof that an event exists everywhere.
		</p>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					selection({
						sources: selection.sources,
						fields: {
							registryName: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const registryName = resolvedEntity.registryName}
					{#if registryName !== undefined && registryName !== null}
						<div>
							<dt>Registry name</dt>
							<dd>
								{String((registryName) ?? '')}
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
							protocolName: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const protocolName = resolvedEntity.protocolName}
					{#if protocolName !== undefined && protocolName !== null}
						<div>
							<dt>Protocol</dt>
							<dd>
								{String((protocolName) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			{#if contentOpen}
				<ResourceBoundary
					resource={
						selection({
							sources: selection.sources,
							fields: {
								homeUrl: true,
							},
						})
					}
				>
					{#snippet children(entity)}
						{@const resolvedEntity = { ...pendingEntity, ...entity }}
						{@const homeUrl = resolvedEntity.homeUrl}
						{#if homeUrl !== undefined && homeUrl !== null}
							<div>
								<dt>Home</dt>
								<dd>
									<svelte:element
										this={'a'}
										href={String(homeUrl)}
										target="_blank"
										rel="noreferrer noopener"
									>
										<TruncatedValue value={String(homeUrl)} />
									</svelte:element>
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
								docsUrl: true,
							},
						})
					}
				>
					{#snippet children(entity)}
						{@const resolvedEntity = { ...pendingEntity, ...entity }}
						{@const docsUrl = resolvedEntity.docsUrl}
						{#if docsUrl !== undefined && docsUrl !== null}
							<div>
								<dt>NIPs</dt>
								<dd>
									<svelte:element
										this={'a'}
										href={String(docsUrl)}
										target="_blank"
										rel="noreferrer noopener"
									>
										<TruncatedValue value={String(docsUrl)} />
									</svelte:element>
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
								relationshipModel: true,
							},
						})
					}
				>
					{#snippet children(entity)}
						{@const resolvedEntity = { ...pendingEntity, ...entity }}
						{@const relationshipModel = resolvedEntity.relationshipModel}
						{#if relationshipModel !== undefined && relationshipModel !== null}
							<div>
								<dt>Connection model</dt>
								<dd>
									<span data-text="long-text">{String((relationshipModel) ?? '')}</span>
								</dd>
							</div>
						{/if}
					{/snippet}
				</ResourceBoundary>
			{/if}
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
				<CollapsibleTabs
					id={viewDomId + '-carousel-nostr-directory'}
					sectionIdPrefix={viewDomId}
					sections={
						[
							{
								id: 'nostr-profiles',
								label: 'Profiles',
								ownsSection: true,
							},
							{
								id: 'nostr-relays',
								label: 'Relays',
								ownsSection: true,
							},
						]
					}
					data-card
					class='network-view-collapsible-directory'
				>
					{#snippet Summary()}
						<header data-row-item="flexible" data-row="wrap gap-4">
							<HeadingComponent>Directory</HeadingComponent>
						</header>
					{/snippet}

					{#snippet MarkerNostrProfiles(_context, Content)}
						{@const nostrDirectoryNostrProfilesResource = selection
		.$$observedProfiles({
			sources: [
				Source.NostrBand_Rest,
			],
		})}
						<ResourceBoundary
							resource={nostrDirectoryNostrProfilesResource}
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

					{#snippet SectionNostrProfiles({ id, label, open, active })}
						{@const nostrDirectoryNostrProfilesResource = selection
		.$$observedProfiles({
			sources: [
				Source.NostrBand_Rest,
			],
		})}
						<ResourceBoundary
							resource={nostrDirectoryNostrProfilesResource}
						>
							{#snippet children(nostrProfile)}
								<section
									id={id}
									aria-labelledby={`${id}:marker`}
									data-scroll-marker-label={label}
									data-column-item="flexible"
									data-column
									data-active={active}
								>
									<NostrProfilesView
										selection={nostrDirectoryNostrProfilesResource}
										href={resolve('/nostr/profiles')}
										CollapsibleProps={{ canToggle: false }}
										collapsible={false}
										data-column-item="flexible"
										data-card
										data-scroll-container
										open={open}
										title={label}
										emptyText='No Nostr profiles in this observed.'
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

					{#snippet MarkerNostrRelays(_context, Content)}
						{@const nostrDirectoryNostrRelaysResource = selection
		.$$observedRelays({
			sources: [
				Source.Constants_Internal,
				Source.NostrBand_Rest,
			],
		})}
						<ResourceBoundary
							resource={nostrDirectoryNostrRelaysResource}
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

					{#snippet SectionNostrRelays({ id, label, open, active })}
						{@const nostrDirectoryNostrRelaysResource = selection
		.$$observedRelays({
			sources: [
				Source.Constants_Internal,
				Source.NostrBand_Rest,
			],
		})}
						<ResourceBoundary
							resource={nostrDirectoryNostrRelaysResource}
						>
							{#snippet children(nostrRelay)}
								<section
									id={id}
									aria-labelledby={`${id}:marker`}
									data-scroll-marker-label={label}
									data-column-item="flexible"
									data-column
									data-active={active}
								>
									<NostrRelaysView
										selection={nostrDirectoryNostrRelaysResource}
										href={resolve('/nostr/relays')}
										CollapsibleProps={{ canToggle: false }}
										collapsible={false}
										data-column-item="flexible"
										data-card
										data-scroll-container
										open={open}
										title={label}
										emptyText='No Nostr relays in this observed.'
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
					id={viewDomId + '-carousel-nostr-content'}
					sectionIdPrefix={viewDomId}
					sections={
						[
							{
								id: 'nostr-notes',
								label: 'Notes',
								ownsSection: true,
							},
							{
								id: 'nostr-articles',
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

					{#snippet MarkerNostrNotes(_context, Content)}
						{@const nostrContentNostrNotesResource = selection
		.$$observedNotes({
			sources: [
				Source.Constants_Internal,
				Source.NostrBand_Rest,
			],
		})}
						<ResourceBoundary
							resource={nostrContentNostrNotesResource}
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

					{#snippet SectionNostrNotes({ id, label, open, active })}
						{@const nostrContentNostrNotesResource = selection
		.$$observedNotes({
			sources: [
				Source.Constants_Internal,
				Source.NostrBand_Rest,
			],
		})}
						<ResourceBoundary
							resource={nostrContentNostrNotesResource}
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
										selection={nostrContentNostrNotesResource}
										href={resolve('/nostr/notes')}
										CollapsibleProps={{ canToggle: false }}
										collapsible={false}
										data-column-item="flexible"
										data-card
										data-scroll-container
										open={open}
										title={label}
										emptyText='No Nostr notes in this observed.'
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

					{#snippet MarkerNostrArticles(_context, Content)}
						{@const nostrContentNostrArticlesResource = selection
		.$$observedArticles({
			sources: [
				Source.Constants_Internal,
				Source.NostrBand_Rest,
			],
		})}
						<ResourceBoundary
							resource={nostrContentNostrArticlesResource}
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

					{#snippet SectionNostrArticles({ id, label, open, active })}
						{@const nostrContentNostrArticlesResource = selection
		.$$observedArticles({
			sources: [
				Source.Constants_Internal,
				Source.NostrBand_Rest,
			],
		})}
						<ResourceBoundary
							resource={nostrContentNostrArticlesResource}
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
										selection={nostrContentNostrArticlesResource}
										href={resolve('/nostr/articles')}
										CollapsibleProps={{ canToggle: false }}
										collapsible={false}
										data-column-item="flexible"
										data-card
										data-scroll-container
										open={open}
										title={label}
										emptyText='No Nostr articles in this observed.'
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
					id={viewDomId + '-carousel-nostr-engagement'}
					sectionIdPrefix={viewDomId}
					sections={
						[
							{
								id: 'nostr-reposts',
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

					{#snippet MarkerNostrReposts(_context, Content)}
						{@const nostrEngagementNostrRepostsResource = selection
		.$$observedReposts({
			sources: [
				Source.Constants_Internal,
				Source.NostrBand_Rest,
			],
		})}
						<ResourceBoundary
							resource={nostrEngagementNostrRepostsResource}
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

					{#snippet SectionNostrReposts({ id, label, open, active })}
						{@const nostrEngagementNostrRepostsResource = selection
		.$$observedReposts({
			sources: [
				Source.Constants_Internal,
				Source.NostrBand_Rest,
			],
		})}
						<ResourceBoundary
							resource={nostrEngagementNostrRepostsResource}
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
										selection={nostrEngagementNostrRepostsResource}
										href={resolve('/nostr/reposts')}
										CollapsibleProps={{ canToggle: false }}
										collapsible={false}
										data-column-item="flexible"
										data-card
										data-scroll-container
										open={open}
										title={label}
										emptyText='No Nostr reposts in this observed.'
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
