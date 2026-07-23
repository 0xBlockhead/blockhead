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
			selection: RegisteredEntityProxyResource<EntityType.NostrSearchQuery>
			prefetched?: RegisteredEntityProxyPrefetchedData<EntityType.NostrSearchQuery>
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
	const nostrSearchQuery = $derived(selection(prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails ? {
		sources: selection.sources,
		fields: {
			resultCount: true,
		},
	} : {
		sources: selection.sources,
		fields: {
			resultCount: true,
			completed: true,
		},
	}))
	const titleFallback = $derived([String((pendingEntity.query) ?? '')].filter(Boolean).join(' ') || 'Nostr profile search')
	const viewDomId = $derived('nostr-search-query-' + encodeURIComponent(stringify(selection.entitySelector ?? prefetched[EntityMetaKey.Selector])))


	// Components
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import NostrProfilesView from '$/views/NostrProfilesView.svelte'
</script>


<EntityView
	entityType={EntityType.NostrSearchQuery}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	href={
		href ?? (
			selection.entitySelector != null && 'query' in selection.entitySelector
			&& selection.entitySelector.query != null ?
				resolve('/nostr/search/[query=stringSegment]', {
			query: String(selection.entitySelector.query ?? ''),
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
		{#if layout !== EntityLayout.SummaryDetails && Object.hasOwn(prefetched, 'resultCount')}
			{[String((pendingEntity.query) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
		{:else}
			<ResourceBoundary resource={nostrSearchQuery}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{[String((resolvedEntity.query) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Value()}
		{#if layout !== EntityLayout.SummaryDetails && Object.hasOwn(prefetched, 'resultCount')}
			{@const resultCount0 = pendingEntity.resultCount}
			{#if resultCount0 !== undefined && resultCount0 !== null}
				<NumberValue
					value={resultCount0}
				/>
			{/if}
		{:else}
			<ResourceBoundary resource={nostrSearchQuery}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const resultCount0 = resolvedEntity.resultCount}
					{#if resultCount0 !== undefined && resultCount0 !== null}
						<NumberValue
							value={resultCount0}
						/>
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet TypeAnnotationTooltip()}
		<p>
			A bounded NostrBand profile search addressed by its normalized query.
		</p>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Query</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									query: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const query = resolvedEntity.query}
							{#if query !== undefined && query !== null}
								{String((query) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Results</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									resultCount: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const resultCount = resolvedEntity.resultCount}
							{#if resultCount !== undefined && resultCount !== null}
								<NumberValue
									value={resultCount}
								/>
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Completed</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									completed: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const completed = resolvedEntity.completed}
							{#if completed !== undefined && completed !== null}
								{completed ? 'Yes' : 'No'}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
				<CollapsibleTabs
					id={viewDomId + '-carousel-nostr-search-results'}
					sectionIdPrefix={viewDomId}
					sections={
						[
							{
								id: 'nostr-search-profiles',
								label: 'Profiles',
								ownsSection: true,
							},
						]
					}
					data-card
					class='network-view-collapsible-results'
				>
					{#snippet Summary()}
						<header data-row-item="flexible" data-row="wrap gap-4">
							<HeadingComponent>Profile results</HeadingComponent>
						</header>
					{/snippet}

					{#snippet MarkerNostrSearchProfiles(_context, Content)}
						{@const nostrSearchResultsNostrSearchProfilesResource = selection
		.$$profiles({
			sources: [
				Source.NostrBand_Rest,
			],
		})}
						<ResourceBoundary
							resource={nostrSearchResultsNostrSearchProfilesResource}
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

					{#snippet SectionNostrSearchProfiles({ id, label, open, active })}
						{@const nostrSearchResultsNostrSearchProfilesResource = selection
		.$$profiles({
			sources: [
				Source.NostrBand_Rest,
			],
		})}
						<ResourceBoundary
							resource={nostrSearchResultsNostrSearchProfilesResource}
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
										selection={nostrSearchResultsNostrSearchProfilesResource}
										CollapsibleProps={{ canToggle: false }}
										collapsible={false}
										data-column-item="flexible"
										data-card
										data-scroll-container
										open={open}
										title={label}
										emptyText='No matching Nostr profiles.'
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
