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
	}: EntitySelectionViewProps<EntityType.BnbBeaconTokenTransfer> = $props()

	const transaction = $derived(selection.entitySelector.$transaction)
	const bnbBeaconTokenTransfer = $derived(selection({
		fields: {
			symbol: true,
			amount: true,
		},
	}))
	const titleFallback = $derived((prefetched.symbol ?? '') || 'bnb beacon token transfer')


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import BnbBeaconTransactionView from '$/views/BnbBeaconTransactionView.svelte'
</script>


<EntityView
	entityType={EntityType.BnbBeaconTokenTransfer}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	href={
		href === undefined ?
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(bnb-beacon)/bnb-beacon/transaction/[txHash=stringSegment]/(bnbBeaconTransaction)/transfer/[transferIndex=nonNegativeInteger]',
				{
					network: (
						'caip2' in transaction.$network.$network ?
							caip2StringFromValue(transaction.$network.$network.caip2)
						:
							transaction.$network.$network.slug
					),
					txHash: transaction.txHash,
					transferIndex: String(selection.entitySelector.transferIndex),
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
		<ResourceBoundary resource={bnbBeaconTokenTransfer}>
			{#snippet children(entity)}
				{entity.symbol || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={bnbBeaconTokenTransfer}>
			{#snippet children(entity)}
				<NumberValue
					value={entity.amount}
				/>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<span data-text="muted">
			<BnbBeaconTransactionView
				selection={select(EntityType.BnbBeaconTransaction, selection.entitySelector.$transaction)}
				layout={EntityLayout.Title}
			/>
		</span>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>transaction</dt>
				<dd>
					<BnbBeaconTransactionView
						selection={select(EntityType.BnbBeaconTransaction, selection.entitySelector.$transaction)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<div>
				<dt>transfer index</dt>
				<dd>
					<NumberValue
						value={selection.entitySelector.transferIndex}
					/>
				</dd>
			</div>

			<div>
				<dt>Symbol</dt>
				<dd>
					<ResourceBoundary
						resource={bnbBeaconTokenTransfer}
					>
						{#snippet children(entity)}
							{entity.symbol}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					selection({
						fields: {
							fromAddress: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const fromAddress = entity.fromAddress}
					{#if fromAddress != null}
						<div>
							<dt>from address</dt>
							<dd>
								<TruncatedValue value={fromAddress} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							toAddress: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const toAddress = entity.toAddress}
					{#if toAddress != null}
						<div>
							<dt>to address</dt>
							<dd>
								<TruncatedValue value={toAddress} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<div>
				<dt>amount</dt>
				<dd>
					<ResourceBoundary
						resource={bnbBeaconTokenTransfer}
					>
						{#snippet children(entity)}
							<NumberValue
								value={entity.amount}
							/>
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>
	{/snippet}
</EntityView>
