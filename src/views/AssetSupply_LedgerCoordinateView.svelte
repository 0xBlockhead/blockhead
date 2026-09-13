<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { untrack } from 'svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2StringFromValue } from '$/lib/caip2.ts'


	// Context
	import { getAppClient } from '$/routes/applicationClient.ts'


	const select = getAppClient().select

	// State
	let {
		selection,
		title,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: Omit<EntitySelectionViewProps<EntityType.AssetSupply_LedgerCoordinate>, 'prefetched'> = $props()

	const assetInstance = $derived(selection.entitySelector.$assetInstance)
	const assetSupplyLedgerCoordinate = $derived(selection({
		fields: {
			totalSupply: true,
			$assetInstance: {
				fields: {
					decimals: true,
					symbol: true,
				},
			},
		},
	}))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import AssetInstanceView from '$/views/AssetInstanceView.svelte'
	import AssetClassView from '$/views/AssetClassView.svelte'
</script>


<EntityView
	entityType={EntityType.AssetSupply_LedgerCoordinate}
	entitySelector={selection.entitySelector}
	title={title ?? (selection.entitySelector.supplyScopeKey || 'asset supply ledger coordinate')}
	href={
		href === undefined ?
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/asset/[kind=stringSegment]/[assetKey=stringSegment]/(assetInstance)/supply/[supplyScopeKey=stringSegment]/ledger/[ledgerCoordinateKind=stringSegment]/[ledgerCoordinateValue=nonNegativeBigInt]/[source=stringSegment]',
				{
					network: (
						assetInstance.$network.caip2 !== undefined ?
							caip2StringFromValue(assetInstance.$network.caip2)
						:
							assetInstance.$network.slug
					),
					kind: assetInstance.kind,
					assetKey: assetInstance.assetKey,
					supplyScopeKey: selection.entitySelector.supplyScopeKey,
					ledgerCoordinateKind: selection.entitySelector.ledgerCoordinateKind,
					ledgerCoordinateValue: String(selection.entitySelector.ledgerCoordinateValue),
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
	{#snippet Value()}
		<ResourceBoundary resource={assetSupplyLedgerCoordinate}>
			{#snippet children(entity)}
				{@const totalSupply = entity.totalSupply}
				{#if totalSupply != null}
					<NumberValue
						value={totalSupply}
						decimalPlaces={selection.entitySelector.$assetInstance.decimals}
					/>

					<span>{selection.entitySelector.$assetInstance.symbol == null ? '' : ` ${selection.entitySelector.$assetInstance.symbol}`}</span>
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
			<div>
				<dt>asset instance</dt>
				<dd>
					<AssetInstanceView
						selection={select(EntityType.AssetInstance, selection.entitySelector.$assetInstance)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<div>
				<dt>supply scope key</dt>
				<dd>
					{selection.entitySelector.supplyScopeKey}
				</dd>
			</div>

			<ResourceBoundary
				resource={selection.$class}
			>
				{#snippet children(assetClass)}
					{#if assetClass != null}
						{@const assetClassInitial = untrack(() => assetClass)}
						<div>
							<dt>class</dt>
							<dd>
								<AssetClassView
									selection={select(EntityType.AssetClass, (assetClass ?? assetClassInitial)[EntityMetaKey.Selector])}
									prefetched={assetClass ?? assetClassInitial}
									layout={EntityLayout.Value}
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
							classKey: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const classKey = entity.classKey}
					{#if classKey != null}
						<div>
							<dt>class key</dt>
							<dd>
								{classKey}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<div>
				<dt>ledger coordinate kind</dt>
				<dd>
					{selection.entitySelector.ledgerCoordinateKind}
				</dd>
			</div>

			<div>
				<dt>ledger coordinate value</dt>
				<dd>
					<NumberValue
						value={selection.entitySelector.ledgerCoordinateValue}
					/>
				</dd>
			</div>

			<div>
				<dt>Source</dt>
				<dd>
					{selection.entitySelector.source}
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={assetSupplyLedgerCoordinate}
			>
				{#snippet children(entity)}
					{@const totalSupply = entity.totalSupply}
					{#if totalSupply != null}
						<div>
							<dt>total supply</dt>
							<dd>
								<NumberValue
									value={totalSupply}
									decimalPlaces={selection.entitySelector.$assetInstance.decimals}
								/>

								<span>{selection.entitySelector.$assetInstance.symbol == null ? '' : ` ${selection.entitySelector.$assetInstance.symbol}`}</span>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							maxSupply: true,
							$assetInstance: {
								fields: {
									decimals: true,
									symbol: true,
								},
							},
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const maxSupply = entity.maxSupply}
					{#if maxSupply != null}
						<div>
							<dt>max supply</dt>
							<dd>
								<NumberValue
									value={maxSupply}
									decimalPlaces={selection.entitySelector.$assetInstance.decimals}
								/>

								<span>{selection.entitySelector.$assetInstance.symbol == null ? '' : ` ${selection.entitySelector.$assetInstance.symbol}`}</span>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							mintedSupply: true,
							$assetInstance: {
								fields: {
									decimals: true,
									symbol: true,
								},
							},
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const mintedSupply = entity.mintedSupply}
					{#if mintedSupply != null}
						<div>
							<dt>minted supply</dt>
							<dd>
								<NumberValue
									value={mintedSupply}
									decimalPlaces={selection.entitySelector.$assetInstance.decimals}
								/>

								<span>{selection.entitySelector.$assetInstance.symbol == null ? '' : ` ${selection.entitySelector.$assetInstance.symbol}`}</span>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							burnedSupply: true,
							$assetInstance: {
								fields: {
									decimals: true,
									symbol: true,
								},
							},
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const burnedSupply = entity.burnedSupply}
					{#if burnedSupply != null}
						<div>
							<dt>burned supply</dt>
							<dd>
								<NumberValue
									value={burnedSupply}
									decimalPlaces={selection.entitySelector.$assetInstance.decimals}
								/>

								<span>{selection.entitySelector.$assetInstance.symbol == null ? '' : ` ${selection.entitySelector.$assetInstance.symbol}`}</span>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
