<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


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
	}: EntitySelectionViewProps<EntityType.BlockheadCashuMeltQuote> = $props()

	const pendingEntity = $derived({ ...selection.entitySelector, ...prefetched })
	const blockheadCashuMeltQuote = $derived(selection({
		fields: {
			amount: true,
		},
	}))
	const titleFallback = $derived((pendingEntity.quoteId ?? '') || 'blockhead Cashu melt quote')


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import BlockheadCashuProofsView from '$/views/BlockheadCashuProofsView.svelte'
	import BlockheadCashuMeltQuote_TimestampsView from '$/views/BlockheadCashuMeltQuote_TimestampsView.svelte'
	import CashuMintView from '$/views/CashuMintView.svelte'
	import BlockheadCashuWalletStateView from '$/views/BlockheadCashuWalletStateView.svelte'
</script>


<EntityView
	entityType={EntityType.BlockheadCashuMeltQuote}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{(pendingEntity.quoteId ?? '') || 'blockhead Cashu melt quote'}
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={blockheadCashuMeltQuote}>
			{#snippet children(entity)}
				{@const amount0 = entity.amount}
				{#if amount0 != null}
					<NumberValue
						value={amount0}
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>mint</dt>
				<dd>
					<CashuMintView
						selection={select(EntityType.CashuMint, selection.entitySelector.$mint)}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>method</dt>
				<dd>
					{pendingEntity.method}
				</dd>
			</div>

			<div>
				<dt>quote ID</dt>
				<dd>
					{pendingEntity.quoteId}
				</dd>
			</div>

			<div>
				<dt>request</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									request: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{entity.request}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={selection.$walletState}
			>
				{#snippet children(blockheadCashuWalletState)}
					{#if blockheadCashuWalletState != null}
						<div>
							<dt>wallet state</dt>
							<dd>
								<BlockheadCashuWalletStateView
									selection={select(EntityType.BlockheadCashuWalletState, blockheadCashuWalletState[EntityMetaKey.Selector])}
									prefetched={blockheadCashuWalletState}
									layout={EntityLayout.Value}
									open={false}
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
							amount: true,
							unit: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const amount = entity.amount}
					{#if amount != null}
						<div>
							<dt>amount</dt>
							<dd>
								<NumberValue
									value={amount}
								/>

								<span>{entity.unit == null ? '' : ` ${String(entity.unit)}`}</span>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							feeReserve: true,
							unit: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const feeReserve = entity.feeReserve}
					{#if feeReserve != null}
						<div>
							<dt>fee reserve</dt>
							<dd>
								<NumberValue
									value={feeReserve}
								/>

								<span>{entity.unit == null ? '' : ` ${String(entity.unit)}`}</span>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{@const blockheadCashuMeltQuoteBlockheadCashuProofsViewInputProofsResource = selection.$$inputProofs}
		<ResourceBoundary
			resource={blockheadCashuMeltQuoteBlockheadCashuProofsViewInputProofsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<BlockheadCashuProofsView
						selection={blockheadCashuMeltQuoteBlockheadCashuProofsViewInputProofsResource}
						countResource={blockheadCashuMeltQuoteBlockheadCashuProofsViewInputProofsResource.count}
						title='input proofs'
						id='input-proofs'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
		{@const blockheadCashuMeltQuoteBlockheadCashuMeltQuoteTimestampsViewTimestampsResource = selection.$$timestamps}
		<ResourceBoundary
			resource={blockheadCashuMeltQuoteBlockheadCashuMeltQuoteTimestampsViewTimestampsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<BlockheadCashuMeltQuote_TimestampsView
						selection={blockheadCashuMeltQuoteBlockheadCashuMeltQuoteTimestampsViewTimestampsResource}
						countResource={blockheadCashuMeltQuoteBlockheadCashuMeltQuoteTimestampsViewTimestampsResource.count}
						title='timestamps'
						id='timestamps'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
