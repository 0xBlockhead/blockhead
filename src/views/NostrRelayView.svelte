<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { RegisteredEntityProxyData, RegisteredEntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
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
			prefetched?: Partial<RegisteredEntityProxyData<EntityType.NostrRelay>>
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
	const nostrRelay = $derived(selection({}))
	const titleFallback = $derived([String((pendingEntity.relayUrl) ?? '')].filter(Boolean).join(' ') || 'Nostr relay')
	const viewDomId = $derived('nostr-relay-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import NostrRelay_TimestampsView from '$/views/NostrRelay_TimestampsView.svelte'
	import NostrRelay_TimestampView from '$/views/NostrRelay_TimestampView.svelte'
</script>


<EntityView
	entityType={EntityType.NostrRelay}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	href={
		href ?? (pendingEntity.relayUrl !== undefined ? resolve('/nostr/relay/[relayKey=stringSegment]', {
			relayKey: String(pendingEntity.relayUrl ?? ''),
		}) : undefined)
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={nostrRelay}>
			{#snippet Pending()}
				{@const relayUrl0 = pendingEntity.relayUrl}
				{#if relayUrl0 !== undefined && relayUrl0 !== null}
					<TruncatedValue value={String((relayUrl0) ?? '')} />
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const relayUrl0 = resolvedEntity.relayUrl}
				{#if relayUrl0 !== undefined && relayUrl0 !== null}
					<TruncatedValue value={String((relayUrl0) ?? '')} />
				{/if}
			{/snippet}
		</ResourceBoundary>
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
							selection.$$timestamps({
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
										(nostrRelayTimestamp[EntityMetaKey.Selector].timestampMs !== undefined && nostrRelayTimestamp[EntityMetaKey.Selector].source !== undefined && nostrRelayTimestamp[EntityMetaKey.Selector].$relay !== undefined && nostrRelayTimestamp[EntityMetaKey.Selector].$relay.relayUrl !== undefined ? resolve('/nostr/relay/[relayKey=stringSegment]/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]', {
											timestampMs: String(nostrRelayTimestamp[EntityMetaKey.Selector].timestampMs ?? ''),
											source: String(nostrRelayTimestamp[EntityMetaKey.Selector].source ?? ''),
											relayKey: String(nostrRelayTimestamp[EntityMetaKey.Selector].$relay.relayUrl ?? ''),
										}) : undefined)
									}
									prefetched={{ ...nostrRelayTimestampSelector, ...nostrRelayTimestamp }}
									layout={EntityLayout.Value}
									open={false}
								/>
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
								fields: {
									relayUrl: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const relayUrl = pendingEntity.relayUrl}
							{#if relayUrl !== undefined && relayUrl !== null}
								<TruncatedValue value={String((relayUrl) ?? '')} />
							{/if}
						{/snippet}

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
		{#if detailsOpen}
			<NostrRelay_TimestampsView
				selection={
						selection.$$timestamps({
							sources: [
								Source.NostrBand_Rest,
								Source.NostrRelay_Nip11_Http,
							],
							limit: 64,
							count: true,
						})
					}
				title='Observation history'
				emptyText='No Nostr relay observations.'
				id='NostrRelay_TimestampsView-timestamps'
			/>
		{/if}
	{/snippet}
</EntityView>
