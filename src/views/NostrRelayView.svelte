<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
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
	}: EntitySelectionViewProps<EntityType.NostrRelay> = $props()

	const pendingEntity = $derived({ ...selection.entitySelector, ...prefetched })
	const titleFallback = $derived((pendingEntity.relayUrl ?? '') || 'Nostr relay')
	const viewDomId = $derived('nostr-relay-' + encodeURIComponent(stringify(selection.entitySelector)))


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
	entitySelector={selection.entitySelector}
	id={viewDomId}
	title={title ?? titleFallback}
	href={
		href ?? resolve(
			'/(social)/(nostr)/nostr/(globalNostrNetwork)/relay/[relayKey=stringSegment]',
			{
				relayKey: encodeURIComponent(String(selection.entitySelector.relayUrl)),
			}
		)
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<TruncatedValue value={pendingEntity.relayUrl} />
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
					<TruncatedValue value={pendingEntity.relayUrl} />
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
						id='timestamps'
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

			{#snippet SectionNostrRelayLiveNotes({ id, label, open })}
				<NostrNotesView
					selection={selection.$$notes}
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
			{/snippet}

		</CollapsibleTabs>
	{/snippet}
</EntityView>
