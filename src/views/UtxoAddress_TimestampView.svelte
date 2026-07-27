<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2StringFromValue } from '$/lib/caip2.ts'


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
	}: EntitySelectionViewProps<EntityType.UtxoAddress_Timestamp> = $props()

	const pendingEntity = $derived({ ...selection.entitySelector, ...prefetched })
	const utxoAddressTimestamp = $derived(selection({
		fields: {
			balanceSats: true,
		},
	}))
	const titleFallback = $derived(String(pendingEntity.timestampMs ?? '') || 'UTXO address timestamp')


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import UtxoAddressView from '$/views/UtxoAddressView.svelte'
</script>


<EntityView
	entityType={EntityType.UtxoAddress_Timestamp}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	href={
		href ?? resolve(
			'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/address/[address=stringSegment]/(utxoAddress)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
			{
				network: (
					'caip2' in selection.entitySelector.$address.$network ?
						String(caip2StringFromValue(selection.entitySelector.$address.$network.caip2))
					:
						String(selection.entitySelector.$address.$network.slug)
				),
				address: String(selection.entitySelector.$address.address),
				timestampMs: String(selection.entitySelector.timestampMs),
				source: String(selection.entitySelector.source),
			}
		)
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<Timestamp timestamp={Number(pendingEntity.timestampMs)} />
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={utxoAddressTimestamp}>
			{#snippet children(entity)}
				{@const balanceSats0 = entity.balanceSats}
				{#if balanceSats0 != null}
					<NumberValue
						value={balanceSats0}
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<span data-text="muted">
			{pendingEntity.source}
		</span>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<ResourceBoundary
				resource={utxoAddressTimestamp}
			>
				{#snippet children(entity)}
					{@const balanceSats = entity.balanceSats}
					{#if balanceSats != null}
						<div>
							<dt>Balance</dt>
							<dd>
								<NumberValue
									value={balanceSats}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							transactionCount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const transactionCount = entity.transactionCount}
					{#if transactionCount != null}
						<div>
							<dt>Transaction count</dt>
							<dd>
								{String(transactionCount)}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							fundedOutputCount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const fundedOutputCount = entity.fundedOutputCount}
					{#if fundedOutputCount != null}
						<div>
							<dt>Funded output count</dt>
							<dd>
								{String(fundedOutputCount)}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							fundedValueSats: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const fundedValueSats = entity.fundedValueSats}
					{#if fundedValueSats != null}
						<div>
							<dt>Funded value</dt>
							<dd>
								<NumberValue
									value={fundedValueSats}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					selection({
						fields: {
							spentOutputCount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const spentOutputCount = entity.spentOutputCount}
					{#if spentOutputCount != null}
						<div>
							<dt>Spent output count</dt>
							<dd>
								{String(spentOutputCount)}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							spentValueSats: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const spentValueSats = entity.spentValueSats}
					{#if spentValueSats != null}
						<div>
							<dt>Spent value</dt>
							<dd>
								<NumberValue
									value={spentValueSats}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							unspentOutputCount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const unspentOutputCount = entity.unspentOutputCount}
					{#if unspentOutputCount != null}
						<div>
							<dt>Unspent output count</dt>
							<dd>
								{String(unspentOutputCount)}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							mempoolTransactionCount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const mempoolTransactionCount = entity.mempoolTransactionCount}
					{#if mempoolTransactionCount != null}
						<div>
							<dt>Mempool transaction count</dt>
							<dd>
								{String(mempoolTransactionCount)}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<div>
				<dt>Timestamp</dt>
				<dd>
					<Timestamp timestamp={Number(pendingEntity.timestampMs)} />
				</dd>
			</div>

			<div>
				<dt>Source</dt>
				<dd>
					{pendingEntity.source}
				</dd>
			</div>

			<div>
				<dt>Address</dt>
				<dd>
					<UtxoAddressView
						selection={select(EntityType.UtxoAddress, selection.entitySelector.$address)}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>
		</dl>
	{/snippet}
</EntityView>
