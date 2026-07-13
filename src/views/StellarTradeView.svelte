<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityProxyData, EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'


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
			selection: EntityProxyResource<typeof schema, EntityType.StellarTrade>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.StellarTrade>>
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
	const stellarTrade = $derived(selection({}))
	const titleFallback = $derived('stellar trade')
	const viewDomId = $derived('stellar-trade-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import StellarNetworkView from '$/views/StellarNetworkView.svelte'
	import StellarAccountView from '$/views/StellarAccountView.svelte'
	import StellarOfferView from '$/views/StellarOfferView.svelte'
	import StellarLiquidityPoolView from '$/views/StellarLiquidityPoolView.svelte'
	import StellarAssetView from '$/views/StellarAssetView.svelte'
	import StellarTransactionView from '$/views/StellarTransactionView.svelte'
	import StellarOperationView from '$/views/StellarOperationView.svelte'
</script>


<EntityView
	entityType={EntityType.StellarTrade}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={stellarTrade}>
			{#snippet Pending()}
				{title || 'stellar trade'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>network</dt>
				<dd>
					<StellarNetworkView
						selection={select(EntityType.StellarNetwork, selection.entitySelector.$network, {})}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>trade ID</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									tradeId: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const tradeId = pendingEntity.tradeId}
							{#if tradeId !== undefined && tradeId !== null}
								{String((tradeId) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const tradeId = resolvedEntity.tradeId}
							{#if tradeId !== undefined && tradeId !== null}
								{String((tradeId) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Source</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									source: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const source = pendingEntity.source}
							{#if source !== undefined && source !== null}
								{String((source) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const source = resolvedEntity.source}
							{#if source !== undefined && source !== null}
								{String((source) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							ledgerCloseTimeMs: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const ledgerCloseTimeMs = pendingEntity.ledgerCloseTimeMs}
					{#if ledgerCloseTimeMs !== undefined && ledgerCloseTimeMs !== null}
						<div>
							<dt>ledger close time ms</dt>
							<dd>
								{String((ledgerCloseTimeMs) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const ledgerCloseTimeMs = resolvedEntity.ledgerCloseTimeMs}
					{#if ledgerCloseTimeMs !== undefined && ledgerCloseTimeMs !== null}
						<div>
							<dt>ledger close time ms</dt>
							<dd>
								{String((ledgerCloseTimeMs) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$baseAccount}
			>
				{#snippet Pending()}{/snippet}

				{#snippet children(stellarAccount)}
					{#if stellarAccount != null && stellarAccount[EntityMetaKey.Selector] != null}
						<div>
							<dt>base account</dt>
							<dd>
								<StellarAccountView
									selection={select(EntityType.StellarAccount, stellarAccount[EntityMetaKey.Selector])}
									prefetched={stellarAccount}
									layout={EntityLayout.Value}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$counterAccount}
			>
				{#snippet Pending()}{/snippet}

				{#snippet children(stellarAccount)}
					{#if stellarAccount != null && stellarAccount[EntityMetaKey.Selector] != null}
						<div>
							<dt>counter account</dt>
							<dd>
								<StellarAccountView
									selection={select(EntityType.StellarAccount, stellarAccount[EntityMetaKey.Selector])}
									prefetched={stellarAccount}
									layout={EntityLayout.Value}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$baseOffer}
			>
				{#snippet Pending()}{/snippet}

				{#snippet children(stellarOffer)}
					{#if stellarOffer != null && stellarOffer[EntityMetaKey.Selector] != null}
						<div>
							<dt>base offer</dt>
							<dd>
								<StellarOfferView
									selection={select(EntityType.StellarOffer, stellarOffer[EntityMetaKey.Selector])}
									prefetched={stellarOffer}
									layout={EntityLayout.Value}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$counterOffer}
			>
				{#snippet Pending()}{/snippet}

				{#snippet children(stellarOffer)}
					{#if stellarOffer != null && stellarOffer[EntityMetaKey.Selector] != null}
						<div>
							<dt>counter offer</dt>
							<dd>
								<StellarOfferView
									selection={select(EntityType.StellarOffer, stellarOffer[EntityMetaKey.Selector])}
									prefetched={stellarOffer}
									layout={EntityLayout.Value}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$baseLiquidityPool}
			>
				{#snippet Pending()}{/snippet}

				{#snippet children(stellarLiquidityPool)}
					{#if stellarLiquidityPool != null && stellarLiquidityPool[EntityMetaKey.Selector] != null}
						<div>
							<dt>base liquidity pool</dt>
							<dd>
								<StellarLiquidityPoolView
									selection={select(EntityType.StellarLiquidityPool, stellarLiquidityPool[EntityMetaKey.Selector])}
									prefetched={stellarLiquidityPool}
									layout={EntityLayout.Value}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$counterLiquidityPool}
			>
				{#snippet Pending()}{/snippet}

				{#snippet children(stellarLiquidityPool)}
					{#if stellarLiquidityPool != null && stellarLiquidityPool[EntityMetaKey.Selector] != null}
						<div>
							<dt>counter liquidity pool</dt>
							<dd>
								<StellarLiquidityPoolView
									selection={select(EntityType.StellarLiquidityPool, stellarLiquidityPool[EntityMetaKey.Selector])}
									prefetched={stellarLiquidityPool}
									layout={EntityLayout.Value}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$baseAsset}
			>
				{#snippet Pending()}{/snippet}

				{#snippet children(stellarAsset)}
					{#if stellarAsset != null && stellarAsset[EntityMetaKey.Selector] != null}
						<div>
							<dt>base asset</dt>
							<dd>
								<StellarAssetView
									selection={select(EntityType.StellarAsset, stellarAsset[EntityMetaKey.Selector])}
									prefetched={stellarAsset}
									layout={EntityLayout.Value}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$counterAsset}
			>
				{#snippet Pending()}{/snippet}

				{#snippet children(stellarAsset)}
					{#if stellarAsset != null && stellarAsset[EntityMetaKey.Selector] != null}
						<div>
							<dt>counter asset</dt>
							<dd>
								<StellarAssetView
									selection={select(EntityType.StellarAsset, stellarAsset[EntityMetaKey.Selector])}
									prefetched={stellarAsset}
									layout={EntityLayout.Value}
									open={false}
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
							baseAmount: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const baseAmount = pendingEntity.baseAmount}
					{#if baseAmount !== undefined && baseAmount !== null}
						<div>
							<dt>base amount</dt>
							<dd>
								{String((baseAmount) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const baseAmount = resolvedEntity.baseAmount}
					{#if baseAmount !== undefined && baseAmount !== null}
						<div>
							<dt>base amount</dt>
							<dd>
								{String((baseAmount) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							counterAmount: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const counterAmount = pendingEntity.counterAmount}
					{#if counterAmount !== undefined && counterAmount !== null}
						<div>
							<dt>counter amount</dt>
							<dd>
								{String((counterAmount) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const counterAmount = resolvedEntity.counterAmount}
					{#if counterAmount !== undefined && counterAmount !== null}
						<div>
							<dt>counter amount</dt>
							<dd>
								{String((counterAmount) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							priceNumerator: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const priceNumerator = pendingEntity.priceNumerator}
					{#if priceNumerator !== undefined && priceNumerator !== null}
						<div>
							<dt>price numerator</dt>
							<dd>
								{String((priceNumerator) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const priceNumerator = resolvedEntity.priceNumerator}
					{#if priceNumerator !== undefined && priceNumerator !== null}
						<div>
							<dt>price numerator</dt>
							<dd>
								{String((priceNumerator) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							priceDenominator: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const priceDenominator = pendingEntity.priceDenominator}
					{#if priceDenominator !== undefined && priceDenominator !== null}
						<div>
							<dt>price denominator</dt>
							<dd>
								{String((priceDenominator) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const priceDenominator = resolvedEntity.priceDenominator}
					{#if priceDenominator !== undefined && priceDenominator !== null}
						<div>
							<dt>price denominator</dt>
							<dd>
								{String((priceDenominator) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$transaction}
			>
				{#snippet Pending()}{/snippet}

				{#snippet children(stellarTransaction)}
					{#if stellarTransaction != null && stellarTransaction[EntityMetaKey.Selector] != null}
						<div>
							<dt>transaction</dt>
							<dd>
								<StellarTransactionView
									selection={select(EntityType.StellarTransaction, stellarTransaction[EntityMetaKey.Selector])}
									prefetched={stellarTransaction}
									layout={EntityLayout.Value}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$operation}
			>
				{#snippet Pending()}{/snippet}

				{#snippet children(stellarOperation)}
					{#if stellarOperation != null && stellarOperation[EntityMetaKey.Selector] != null}
						<div>
							<dt>operation</dt>
							<dd>
								<StellarOperationView
									selection={select(EntityType.StellarOperation, stellarOperation[EntityMetaKey.Selector])}
									prefetched={stellarOperation}
									layout={EntityLayout.Value}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
