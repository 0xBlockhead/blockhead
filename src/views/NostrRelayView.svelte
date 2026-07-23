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
			selection: RegisteredEntityProxyResource<EntityType.NostrRelay>
			prefetched?: RegisteredEntityProxyPrefetchedData<EntityType.NostrRelay>
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
	const nostrRelay = $derived(selection(prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails ? {
		sources: selection.sources,
		fields: {},
	} : {
		sources: selection.sources,
	}))
	const titleFallback = $derived([String((pendingEntity.relayUrl) ?? '')].filter(Boolean).join(' ') || 'Nostr relay')
	const viewDomId = $derived('nostr-relay-' + encodeURIComponent(stringify(selection.entitySelector ?? prefetched[EntityMetaKey.Selector])))


	// Components
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import NostrRelay_TimestampsView from '$/views/NostrRelay_TimestampsView.svelte'
	import NostrRelay_TimestampView from '$/views/NostrRelay_TimestampView.svelte'
	import NostrNotesView from '$/views/NostrNotesView.svelte'
</script>


<EntityView
	entityType={EntityType.NostrRelay}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	href={
		href ?? (
			selection.entitySelector != null && 'relayUrl' in selection.entitySelector
			&& selection.entitySelector.relayUrl != null ?
				resolve('/nostr/relay/[relayKey=stringSegment]', {
			relayKey: encodeURIComponent(String(selection.entitySelector.relayUrl ?? '')),
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
		{#if layout !== EntityLayout.SummaryDetails}
			{@const relayUrl0 = pendingEntity.relayUrl}
			{#if relayUrl0 !== undefined && relayUrl0 !== null}
				<TruncatedValue value={String((relayUrl0) ?? '')} />
			{/if}
		{:else}
			<ResourceBoundary resource={nostrRelay}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const relayUrl0 = resolvedEntity.relayUrl}
					{#if relayUrl0 !== undefined && relayUrl0 !== null}
						<TruncatedValue value={String((relayUrl0) ?? '')} />
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet TypeAnnotationTooltip()}
		<p>
			A Nostr relay is a WebSocket endpoint that can publish, store, and serve signed events; relay metadata is optional NIP-11 source data.
		</p>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Latest observation</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection
								.$$timestamps({
									sources: [
										Source.NostrBand_Rest,
										Source.NostrRelay_Nip11_Http,
									],
									limit: 1,
									orderBy: [
										[({ fieldRow }) => fieldRow[EntityMetaKey.Value][EntityMetaKey.Selector].timestampMs ?? Number.NEGATIVE_INFINITY, 'desc'],
									],
								})
						}
					>
						{#snippet children(nostrRelayTimestamps)}
							{@const nostrRelayTimestamp = nostrRelayTimestamps.values[0]}
							{#if nostrRelayTimestamp != null}
								{@const nostrRelayTimestampSelector = nostrRelayTimestamp[EntityMetaKey.Selector]}
								<NostrRelay_TimestampView
									selection={
										select(EntityType.NostrRelay_Timestamp, nostrRelayTimestampSelector, {
											sources: [
												Source.NostrBand_Rest,
												Source.NostrRelay_Nip11_Http,
											],
										})
									}
									href={
										(
											nostrRelayTimestamp[EntityMetaKey.Selector] != null && 'timestampMs' in nostrRelayTimestamp[EntityMetaKey.Selector]
											&& nostrRelayTimestamp[EntityMetaKey.Selector].timestampMs != null
											&& nostrRelayTimestamp[EntityMetaKey.Selector] != null && 'source' in nostrRelayTimestamp[EntityMetaKey.Selector]
											&& nostrRelayTimestamp[EntityMetaKey.Selector].source != null
											&& nostrRelayTimestamp[EntityMetaKey.Selector] != null && '$relay' in nostrRelayTimestamp[EntityMetaKey.Selector]
											&& nostrRelayTimestamp[EntityMetaKey.Selector].$relay != null && 'relayUrl' in nostrRelayTimestamp[EntityMetaKey.Selector].$relay
											&& nostrRelayTimestamp[EntityMetaKey.Selector].$relay.relayUrl != null ?
												resolve('/nostr/relay/[relayKey=stringSegment]/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]', {
											timestampMs: String(nostrRelayTimestamp[EntityMetaKey.Selector].timestampMs ?? ''),
											source: String(nostrRelayTimestamp[EntityMetaKey.Selector].source ?? ''),
											relayKey: encodeURIComponent(String(nostrRelayTimestamp[EntityMetaKey.Selector].$relay.relayUrl ?? '')),
										})
										:
												undefined
										)
									}
									prefetched={{ ...nostrRelayTimestampSelector, ...nostrRelayTimestamp }}
									layout={EntityLayout.Value}
									open={false}
								/>
							{:else}
								<p data-text="muted" data-section-state="resolved-empty">No latest observation available.</p>
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<div>
				<dt>Relay URL</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									relayUrl: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const relayUrl = resolvedEntity.relayUrl}
							{#if relayUrl !== undefined && relayUrl !== null}
								<TruncatedValue value={String((relayUrl) ?? '')} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
				{@const nostrRelayNostrRelayTimestampsViewTimestampsResource = selection
		.$$timestamps({
			sources: [
				Source.NostrBand_Rest,
				Source.NostrRelay_Nip11_Http,
			],
			limit: 64,
		})}
				<ResourceBoundary
					resource={nostrRelayNostrRelayTimestampsViewTimestampsResource}
				>
					{#snippet children(entities)}
						{#if entities.values.length > 0}
						<NostrRelay_TimestampsView
							selection={nostrRelayNostrRelayTimestampsViewTimestampsResource}
							countResource={nostrRelayNostrRelayTimestampsViewTimestampsResource.count}
							title='Observation history'
							id='NostrRelay_TimestampsView-timestamps'
						/>
						{/if}
					{/snippet}
				</ResourceBoundary>

				<CollapsibleTabs
					id={viewDomId + '-carousel-nostr-relay-live'}
					sectionIdPrefix={viewDomId}
					sections={
						[
							{
								id: 'nostr-relay-live-notes',
								label: 'Live notes',
								ownsSection: true,
							},
						]
					}
					data-card
					class='network-view-collapsible-live'
				>
					{#snippet Summary()}
						<header data-row-item="flexible" data-row="wrap gap-4">
							<HeadingComponent>Live relay activity</HeadingComponent>
						</header>
					{/snippet}

					{#snippet MarkerNostrRelayLiveNotes(_context, Content)}
						{@const nostrRelayLiveNotesResource = selection
		.$$notes({
			sources: [
				Source.NostrRelay_WebSocket,
			],
		})}
						<ResourceBoundary
							resource={nostrRelayLiveNotesResource}
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

					{#snippet SectionNostrRelayLiveNotes({ id, label, open, active })}
						{@const nostrRelayLiveNotesResource = selection
		.$$notes({
			sources: [
				Source.NostrRelay_WebSocket,
			],
		})}
						<ResourceBoundary
							resource={nostrRelayLiveNotesResource}
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
										selection={nostrRelayLiveNotesResource}
										CollapsibleProps={{ canToggle: false }}
										collapsible={false}
										data-column-item="flexible"
										data-card
										data-scroll-container
										open={open}
										title={label}
										emptyText='No live notes received.'
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
