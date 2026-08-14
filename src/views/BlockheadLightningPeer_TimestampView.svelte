<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2StringFromValue } from '$/lib/caip2.ts'
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
	}: Omit<EntitySelectionViewProps<EntityType.BlockheadLightningPeer_Timestamp>, 'prefetched'> = $props()

	const peer = $derived(selection.entitySelector.$peer)
	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.LightningLnd_Rest,
			Source.Local_Internal,
		],
	}))
	const blockheadLightningPeerTimestamp = $derived(viewSelection({
		fields: {
			address: true,
			inbound: true,
		},
	}))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import BlockheadLightningPeerView from '$/views/BlockheadLightningPeerView.svelte'
</script>


<EntityView
	entityType={EntityType.BlockheadLightningPeer_Timestamp}
	entitySelector={selection.entitySelector}
	title={title ?? String(selection.entitySelector.timestampMs)}
	href={
		href === undefined ?
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/~/lightning/connection/[connectionId=stringSegment]/node-state/(blockheadLightningNodeState)/peer/[publicKey=stringSegment]/(blockheadLightningPeer)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
				{
					network: (
						'caip2' in peer.$localNodeState.$network.$network ?
							caip2StringFromValue(peer.$localNodeState.$network.$network.caip2)
						:
							peer.$localNodeState.$network.$network.slug
					),
					connectionId: peer.$localNodeState.connectionId,
					publicKey: peer.publicKey,
					timestampMs: String(selection.entitySelector.timestampMs),
					source: selection.entitySelector.source,
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
		<Timestamp timestamp={selection.entitySelector.timestampMs} />
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={blockheadLightningPeerTimestamp}>
			{#snippet children(entity)}
				{(entity.address ?? '') || String(selection.entitySelector.timestampMs)}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={blockheadLightningPeerTimestamp}>
			{#snippet children(entity)}
				{@const inbound = entity.inbound}
				{#if inbound != null}
					<span data-text="muted">
						{inbound ? 'Yes' : 'No'}
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>peer</dt>
				<dd>
					<BlockheadLightningPeerView
						selection={select(EntityType.BlockheadLightningPeer, selection.entitySelector.$peer)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<div>
				<dt>Timestamp</dt>
				<dd>
					<Timestamp timestamp={selection.entitySelector.timestampMs} />
				</dd>
			</div>

			<div>
				<dt>Source</dt>
				<dd>
					{selection.entitySelector.source}
				</dd>
			</div>

			<ResourceBoundary
				resource={blockheadLightningPeerTimestamp}
			>
				{#snippet children(entity)}
					{@const address = entity.address}
					{#if address != null}
						<div>
							<dt>Address</dt>
							<dd>
								<TruncatedValue value={address} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={blockheadLightningPeerTimestamp}
			>
				{#snippet children(entity)}
					{@const inbound = entity.inbound}
					{#if inbound != null}
						<div>
							<dt>Inbound</dt>
							<dd>
								{inbound ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							bytesSent: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const bytesSent = entity.bytesSent}
					{#if bytesSent != null}
						<div>
							<dt>Bytes sent</dt>
							<dd>
								<NumberValue
									value={bytesSent}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							bytesRecv: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const bytesRecv = entity.bytesRecv}
					{#if bytesRecv != null}
						<div>
							<dt>Bytes received</dt>
							<dd>
								<NumberValue
									value={bytesRecv}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							satsSent: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const satsSent = entity.satsSent}
					{#if satsSent != null}
						<div>
							<dt>Sats sent</dt>
							<dd>
								<NumberValue
									value={satsSent}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							satsRecv: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const satsRecv = entity.satsRecv}
					{#if satsRecv != null}
						<div>
							<dt>Sats received</dt>
							<dd>
								<NumberValue
									value={satsRecv}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							pingTimeMicros: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const pingTimeMicros = entity.pingTimeMicros}
					{#if pingTimeMicros != null}
						<div>
							<dt>Ping time microseconds</dt>
							<dd>
								<NumberValue
									value={pingTimeMicros}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
