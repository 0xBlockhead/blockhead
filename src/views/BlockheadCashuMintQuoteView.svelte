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
	}: EntitySelectionViewProps<EntityType.BlockheadCashuMintQuote> = $props()

	const pendingEntity = $derived({ ...selection.entitySelector, ...prefetched })
	const blockheadCashuMintQuote = $derived(selection({
		fields: {
			amount: true,
			unit: true,
		},
	}))
	const titleFallback = $derived((pendingEntity.quoteId ?? '') || 'blockhead Cashu mint quote')


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import BlockheadCashuMintQuote_TimestampsView from '$/views/BlockheadCashuMintQuote_TimestampsView.svelte'
	import CashuMintView from '$/views/CashuMintView.svelte'
	import BlockheadCashuWalletStateView from '$/views/BlockheadCashuWalletStateView.svelte'
</script>


<EntityView
	entityType={EntityType.BlockheadCashuMintQuote}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{(pendingEntity.quoteId ?? '') || 'blockhead Cashu mint quote'}
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={blockheadCashuMintQuote}>
			{#snippet children(entity)}
				{@const amount0 = entity.amount}
				{#if amount0 != null}
					<NumberValue
						value={amount0}
					/>

					<span>{entity.unit == null ? '' : ` ${String(entity.unit)}`}</span>
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
				resource={blockheadCashuMintQuote}
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
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{@const blockheadCashuMintQuoteBlockheadCashuMintQuoteTimestampsViewTimestampsResource = selection.$$timestamps}
		<ResourceBoundary
			resource={blockheadCashuMintQuoteBlockheadCashuMintQuoteTimestampsViewTimestampsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<BlockheadCashuMintQuote_TimestampsView
						selection={blockheadCashuMintQuoteBlockheadCashuMintQuoteTimestampsViewTimestampsResource}
						countResource={blockheadCashuMintQuoteBlockheadCashuMintQuoteTimestampsViewTimestampsResource.count}
						title='timestamps'
						id='timestamps'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
