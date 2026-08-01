<!-- Generated from APP.ts. -->

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

	const address = $derived(selection.entitySelector.$address)
	const utxoAddressTimestamp = $derived(selection({
		fields: {
			balanceSats: true,
		},
	}))


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
	title={title ?? String(selection.entitySelector.timestampMs)}
	href={
		href === undefined ?
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/address/[address=stringSegment]/(utxoAddress)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
				{
					network: (
						'caip2' in address.$network ?
							caip2StringFromValue(address.$network.caip2)
						:
							address.$network.slug
					),
					address: address.address,
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
		<ResourceBoundary resource={utxoAddressTimestamp}>
			{#snippet children(entity)}
				{@const balanceSats = entity.balanceSats}
				{#if balanceSats != null}
					<NumberValue
						value={balanceSats}
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<span data-text="muted">
			{selection.entitySelector.source}
		</span>
	{/snippet}

	{#snippet Content()}
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
								{transactionCount}
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
								{fundedOutputCount}
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
								{spentOutputCount}
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
								{unspentOutputCount}
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
								{mempoolTransactionCount}
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
					<Timestamp timestamp={selection.entitySelector.timestampMs} />
				</dd>
			</div>

			<div>
				<dt>Source</dt>
				<dd>
					{selection.entitySelector.source}
				</dd>
			</div>

			<div>
				<dt>Address</dt>
				<dd>
					<UtxoAddressView
						selection={select(EntityType.UtxoAddress, selection.entitySelector.$address)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>
		</dl>
	{/snippet}
</EntityView>
