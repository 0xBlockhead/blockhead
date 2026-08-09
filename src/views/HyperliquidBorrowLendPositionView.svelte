<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
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
	}: Omit<EntitySelectionViewProps<EntityType.HyperliquidBorrowLendPosition>, 'prefetched'> = $props()

	const account = $derived(selection.entitySelector.$account)
	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.Hyperliquid,
		],
	}))
	const hyperliquidBorrowLendPosition = $derived(viewSelection({
		fields: {
			supplyValue: true,
			borrowValue: true,
		},
	}))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import HyperliquidAccountView from '$/views/HyperliquidAccountView.svelte'
	import HyperliquidBorrowLendReserveView from '$/views/HyperliquidBorrowLendReserveView.svelte'
	import HyperliquidSpotAssetView from '$/views/HyperliquidSpotAssetView.svelte'
</script>


<EntityView
	entityType={EntityType.HyperliquidBorrowLendPosition}
	entitySelector={selection.entitySelector}
	title={title ?? String(selection.entitySelector.tokenIndex)}
	href={
		href === undefined ?
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(accounts)/account/[accountId=stringSegmentOrPolkadotAccountIdOrEvmAddressOrSolanaPubkey]/(selection)/borrow-lend/[tokenIndex=nonNegativeInteger]',
				{
					network: (
						'caip2' in account.$network ?
							caip2StringFromValue(account.$network.caip2)
						:
							account.$network.slug
					),
					accountId: account.address,
					tokenIndex: String(selection.entitySelector.tokenIndex),
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
		<NumberValue
			value={selection.entitySelector.tokenIndex}
		/>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={hyperliquidBorrowLendPosition}>
			{#snippet children(entity)}
				{[(entity.supplyValue ?? ''), (entity.borrowValue ?? '')].filter(Boolean).join(' ') || String(selection.entitySelector.tokenIndex)}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<span data-text="muted">
			<HyperliquidAccountView
				selection={select(EntityType.HyperliquidAccount, selection.entitySelector.$account)}
				layout={EntityLayout.Title}
			/>
		</span>

		<ResourceBoundary
			resource={selection.$asset}
		>
			{#snippet children(hyperliquidSpotAsset)}
				{#if hyperliquidSpotAsset != null}
					<span data-text="muted">
						<HyperliquidSpotAssetView
							selection={select(EntityType.HyperliquidSpotAsset, hyperliquidSpotAsset[EntityMetaKey.Selector])}
							prefetched={hyperliquidSpotAsset}
							layout={EntityLayout.Title}
						/>
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>account</dt>
				<dd>
					<HyperliquidAccountView
						selection={select(EntityType.HyperliquidAccount, selection.entitySelector.$account)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<div>
				<dt>token index</dt>
				<dd>
					<NumberValue
						value={selection.entitySelector.tokenIndex}
					/>
				</dd>
			</div>

			<ResourceBoundary
				resource={selection.$reserve}
			>
				{#snippet children(hyperliquidBorrowLendReserve)}
					{#if hyperliquidBorrowLendReserve != null}
						<div>
							<dt>reserve</dt>
							<dd>
								<HyperliquidBorrowLendReserveView
									selection={select(EntityType.HyperliquidBorrowLendReserve, hyperliquidBorrowLendReserve[EntityMetaKey.Selector])}
									layout={EntityLayout.Value}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$asset}
			>
				{#snippet children(hyperliquidSpotAsset)}
					{#if hyperliquidSpotAsset != null}
						<div>
							<dt>spot asset</dt>
							<dd>
								<HyperliquidSpotAssetView
									selection={select(EntityType.HyperliquidSpotAsset, hyperliquidSpotAsset[EntityMetaKey.Selector])}
									prefetched={hyperliquidSpotAsset}
									layout={EntityLayout.Value}
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
							borrowBasis: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const borrowBasis = entity.borrowBasis}
					{#if borrowBasis != null}
						<div>
							<dt>borrow basis</dt>
							<dd>
								{borrowBasis}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={hyperliquidBorrowLendPosition}
			>
				{#snippet children(entity)}
					{@const borrowValue = entity.borrowValue}
					{#if borrowValue != null}
						<div>
							<dt>borrow value</dt>
							<dd>
								{borrowValue}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							supplyBasis: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const supplyBasis = entity.supplyBasis}
					{#if supplyBasis != null}
						<div>
							<dt>supply basis</dt>
							<dd>
								{supplyBasis}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={hyperliquidBorrowLendPosition}
			>
				{#snippet children(entity)}
					{@const supplyValue = entity.supplyValue}
					{#if supplyValue != null}
						<div>
							<dt>supply value</dt>
							<dd>
								{supplyValue}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
