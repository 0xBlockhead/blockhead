<!-- Generated from APP.ts. -->

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
		title,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: Omit<EntitySelectionViewProps<EntityType.NostrRelay>, 'prefetched'> = $props()

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
	title={title ?? (selection.entitySelector.relayUrl || 'Nostr relay')}
	href={
		href === undefined ?
			resolve(
				'/(social)/(nostr)/nostr/(globalNostrNetwork)/relay/[relayKey=stringSegment]',
				{
					relayKey: encodeURIComponent(selection.entitySelector.relayUrl),
				}
			)
		:
			href ?? undefined
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<TruncatedValue value={selection.entitySelector.relayUrl} />
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>Latest observation</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection
							.$$timestamps({
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
					<TruncatedValue value={selection.entitySelector.relayUrl} />
				</dd>
			</div>
		</dl>
	{/snippet}

	{#snippet Details()}
		{@const timestampsResource = selection
			.$$timestamps({
				limit: 64,
			})}
		<ResourceBoundary
			resource={timestampsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<NostrRelay_TimestampsView
						selection={timestampsResource}
						countResource={timestampsResource.count}
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

			{#snippet SectionNostrRelayLiveNotes({ id, label })}
				<NostrNotesView
					selection={selection.$$notes}
					collapsible={false}
					title={label}
					emptyText='No live notes received.'
					id={`${id}-list`}
				/>
			{/snippet}

		</CollapsibleTabs>
	{/snippet}
</EntityView>
