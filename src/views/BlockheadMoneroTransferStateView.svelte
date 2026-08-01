<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
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
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: EntitySelectionViewProps<EntityType.BlockheadMoneroTransferState> = $props()

	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.Local_Internal,
		],
	}))
	const blockheadMoneroTransferState = $derived(viewSelection({
		fields: {
			direction: true,
			amountAtomicUnits: true,
		},
	}))
	const titleFallback = $derived(selection.entitySelector.txHash || 'blockhead monero transfer state')


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import BlockheadMoneroTransferState_TimestampsView from '$/views/BlockheadMoneroTransferState_TimestampsView.svelte'
	import BlockheadWalletView from '$/views/BlockheadWalletView.svelte'
	import MoneroNetworkView from '$/views/MoneroNetworkView.svelte'
	import MoneroTransactionView from '$/views/MoneroTransactionView.svelte'
</script>


<EntityView
	entityType={EntityType.BlockheadMoneroTransferState}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Value()}
		<ResourceBoundary resource={blockheadMoneroTransferState}>
			{#snippet children(entity)}
				{entity.direction || selection.entitySelector.txHash || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={blockheadMoneroTransferState}>
			{#snippet children(entity)}
				{@const amountAtomicUnits = entity.amountAtomicUnits}
				{#if amountAtomicUnits != null}
					<span data-text="muted">
						<NumberValue
							value={amountAtomicUnits}
						/>
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>wallet ID</dt>
				<dd>
					{selection.entitySelector.walletId}
				</dd>
			</div>

			<ResourceBoundary
				resource={selection.$wallet}
			>
				{#snippet children(blockheadWallet)}
					{#if blockheadWallet != null}
						<div>
							<dt>wallet</dt>
							<dd>
								<BlockheadWalletView
									selection={select(EntityType.BlockheadWallet, blockheadWallet[EntityMetaKey.Selector])}
									prefetched={blockheadWallet}
									layout={EntityLayout.Value}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<div>
				<dt>network</dt>
				<dd>
					<ResourceBoundary
						resource={selection.$network}
					>
						{#snippet children(moneroNetwork)}
							<MoneroNetworkView
								selection={select(EntityType.MoneroNetwork, moneroNetwork[EntityMetaKey.Selector])}
								prefetched={moneroNetwork}
								layout={EntityLayout.Value}
							/>
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={selection.$transaction}
			>
				{#snippet children(moneroTransaction)}
					{#if moneroTransaction != null}
						<div>
							<dt>transaction</dt>
							<dd>
								<MoneroTransactionView
									selection={select(EntityType.MoneroTransaction, moneroTransaction[EntityMetaKey.Selector])}
									prefetched={moneroTransaction}
									layout={EntityLayout.Value}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<div>
				<dt>Transaction hash</dt>
				<dd>
					<TruncatedValue value={selection.entitySelector.txHash} />
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
				<dt>direction</dt>
				<dd>
					<ResourceBoundary
						resource={blockheadMoneroTransferState}
					>
						{#snippet children(entity)}
							{entity.direction}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={blockheadMoneroTransferState}
			>
				{#snippet children(entity)}
					{@const amountAtomicUnits = entity.amountAtomicUnits}
					{#if amountAtomicUnits != null}
						<div>
							<dt>amount atomic units</dt>
							<dd>
								<NumberValue
									value={amountAtomicUnits}
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
							feeAtomicUnits: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const feeAtomicUnits = entity.feeAtomicUnits}
					{#if feeAtomicUnits != null}
						<div>
							<dt>fee atomic units</dt>
							<dd>
								<NumberValue
									value={feeAtomicUnits}
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
					viewSelection({
						fields: {
							accountIndex: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const accountIndex = entity.accountIndex}
					{#if accountIndex != null}
						<div>
							<dt>account index</dt>
							<dd>
								<NumberValue
									value={accountIndex}
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
							addressIndex: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const addressIndex = entity.addressIndex}
					{#if addressIndex != null}
						<div>
							<dt>address index</dt>
							<dd>
								<NumberValue
									value={addressIndex}
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
							paymentId: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const paymentId = entity.paymentId}
					{#if paymentId != null}
						<div>
							<dt>payment ID</dt>
							<dd>
								{paymentId}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							note: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const note = entity.note}
					{#if note != null}
						<div>
							<dt>note</dt>
							<dd>
								{note}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							keyImage: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const keyImage = entity.keyImage}
					{#if keyImage != null}
						<div>
							<dt>key image</dt>
							<dd>
								{keyImage}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							timestampMs: true,
						},
					})
				}
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
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{@const timestampsResource = selection.$$timestamps}
		<ResourceBoundary
			resource={timestampsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<BlockheadMoneroTransferState_TimestampsView
						selection={timestampsResource}
						countResource={timestampsResource.count}
						title='timestamps'
						id='timestamps'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
