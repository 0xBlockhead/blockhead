<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2StringFromValue } from '$/lib/caip2.ts'


	// Context
	import { getAppClient } from '$/routes/applicationClient.ts'


	const select = getAppClient().select

	// State
	let {
		selection,
		prefetched = {},
		title,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: EntitySelectionViewProps<EntityType.CardanoAddress_Timestamp> = $props()

	const address = $derived(selection.entitySelector.$address)
	const cardanoAddressTimestamp = $derived(selection({
		fields: {
			timestampMs: true,
			lovelaceBalance: true,
			transactionCount: true,
		},
	}))
	const titleFallback = $derived(String(prefetched.timestampMs ?? '') || String(selection.entitySelector.blockSlot) || 'Cardano address timestamp')


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import CardanoAddressView from '$/views/CardanoAddressView.svelte'
</script>


<EntityView
	entityType={EntityType.CardanoAddress_Timestamp}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	href={
		href === undefined ?
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(accounts)/account/cardano/[address=stringSegment]/(cardanoAddress)/observation/cardano-block/[blockSlot=nonNegativeBigInt]/[source=stringSegment]',
				{
					network: (
						address.$network.caip2 !== undefined ?
							caip2StringFromValue(address.$network.caip2)
						:
							address.$network.slug
					),
					address: address.address,
					blockSlot: String(selection.entitySelector.blockSlot),
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
		<ResourceBoundary resource={cardanoAddressTimestamp}>
			{#snippet children(entity)}
				{@const timestampMs = entity.timestampMs}
				{#if timestampMs != null}
					<Timestamp timestamp={timestampMs} />
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={cardanoAddressTimestamp}>
			{#snippet children(entity)}
				{String(entity.lovelaceBalance ?? '') || String(entity.timestampMs ?? '') || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={cardanoAddressTimestamp}>
			{#snippet children(entity)}
				{@const transactionCount = entity.transactionCount}
				{#if transactionCount != null}
					<span data-text="muted">
						{transactionCount}
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>Address</dt>
				<dd>
					<CardanoAddressView
						selection={select(EntityType.CardanoAddress, selection.entitySelector.$address)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<div>
				<dt>block slot</dt>
				<dd>
					{selection.entitySelector.blockSlot}
				</dd>
			</div>

			<div>
				<dt>Source</dt>
				<dd>
					{selection.entitySelector.source}
				</dd>
			</div>

			<ResourceBoundary
				resource={cardanoAddressTimestamp}
			>
				{#snippet children(entity)}
					{@const timestampMs = entity.timestampMs}
					{#if timestampMs != null}
						<div>
							<dt>Timestamp</dt>
							<dd>
								<Timestamp timestamp={timestampMs} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							blockHash: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const blockHash = entity.blockHash}
					{#if blockHash != null}
						<div>
							<dt>Block hash</dt>
							<dd>
								<TruncatedValue value={blockHash} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={cardanoAddressTimestamp}
			>
				{#snippet children(entity)}
					{@const lovelaceBalance = entity.lovelaceBalance}
					{#if lovelaceBalance != null}
						<div>
							<dt>lovelace balance</dt>
							<dd>
								{lovelaceBalance}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							nativeAssetCount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const nativeAssetCount = entity.nativeAssetCount}
					{#if nativeAssetCount != null}
						<div>
							<dt>native asset count</dt>
							<dd>
								{nativeAssetCount}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							utxoCount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const utxoCount = entity.utxoCount}
					{#if utxoCount != null}
						<div>
							<dt>UTXO count</dt>
							<dd>
								{utxoCount}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={cardanoAddressTimestamp}
			>
				{#snippet children(entity)}
					{@const transactionCount = entity.transactionCount}
					{#if transactionCount != null}
						<div>
							<dt>transaction count</dt>
							<dd>
								{transactionCount}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
