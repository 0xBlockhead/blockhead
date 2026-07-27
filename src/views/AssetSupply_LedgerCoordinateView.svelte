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
	}: EntitySelectionViewProps<EntityType.AssetSupply_LedgerCoordinate> = $props()

	const pendingEntity = $derived({ ...selection.entitySelector, ...prefetched })
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
	const titleFallback = $derived((pendingEntity.supplyScopeKey ?? '') || 'asset supply ledger coordinate')


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import AssetInstanceView from '$/views/AssetInstanceView.svelte'
	import AssetClassView from '$/views/AssetClassView.svelte'
</script>


<EntityView
	entityType={EntityType.AssetSupply_LedgerCoordinate}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{(pendingEntity.supplyScopeKey ?? '') || 'asset supply ledger coordinate'}
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={assetSupplyLedgerCoordinate}>
			{#snippet children(entity)}
				{@const totalSupply0 = entity.totalSupply}
				{#if totalSupply0 != null}
					<NumberValue
						value={totalSupply0}
						decimalPlaces={pendingEntity.$assetInstance.decimals}
					/>

					<span>{pendingEntity.$assetInstance.symbol == null ? '' : ` ${String(pendingEntity.$assetInstance.symbol)}`}</span>
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
			<div>
				<dt>asset instance</dt>
				<dd>
					<AssetInstanceView
						selection={select(EntityType.AssetInstance, selection.entitySelector.$assetInstance)}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>supply scope key</dt>
				<dd>
					{pendingEntity.supplyScopeKey}
				</dd>
			</div>

			<ResourceBoundary
				resource={selection.$class}
			>
				{#snippet children(assetClass)}
					{#if assetClass != null}
						<div>
							<dt>class</dt>
							<dd>
								<AssetClassView
									selection={select(EntityType.AssetClass, assetClass[EntityMetaKey.Selector])}
									prefetched={assetClass}
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
					{pendingEntity.ledgerCoordinateKind}
				</dd>
			</div>

			<div>
				<dt>ledger coordinate value</dt>
				<dd>
					<NumberValue
						value={pendingEntity.ledgerCoordinateValue}
					/>
				</dd>
			</div>

			<div>
				<dt>Source</dt>
				<dd>
					{pendingEntity.source}
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
									decimalPlaces={pendingEntity.$assetInstance.decimals}
								/>

								<span>{pendingEntity.$assetInstance.symbol == null ? '' : ` ${String(pendingEntity.$assetInstance.symbol)}`}</span>
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
									decimalPlaces={pendingEntity.$assetInstance.decimals}
								/>

								<span>{pendingEntity.$assetInstance.symbol == null ? '' : ` ${String(pendingEntity.$assetInstance.symbol)}`}</span>
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
									decimalPlaces={pendingEntity.$assetInstance.decimals}
								/>

								<span>{pendingEntity.$assetInstance.symbol == null ? '' : ` ${String(pendingEntity.$assetInstance.symbol)}`}</span>
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
									decimalPlaces={pendingEntity.$assetInstance.decimals}
								/>

								<span>{pendingEntity.$assetInstance.symbol == null ? '' : ` ${String(pendingEntity.$assetInstance.symbol)}`}</span>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
