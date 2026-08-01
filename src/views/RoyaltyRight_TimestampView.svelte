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
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: EntitySelectionViewProps<EntityType.RoyaltyRight_Timestamp> = $props()


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import NftCollectionView from '$/views/NftCollectionView.svelte'
	import NftTokenView from '$/views/NftTokenView.svelte'
</script>


<EntityView
	entityType={EntityType.RoyaltyRight_Timestamp}
	entitySelector={selection.entitySelector}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>target key</dt>
				<dd>
					{selection.entitySelector.targetKey}
				</dd>
			</div>

			<div>
				<dt>right key</dt>
				<dd>
					{selection.entitySelector.rightKey}
				</dd>
			</div>

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
				<dt>source kind</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									sourceKind: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{entity.sourceKind}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={selection.$collection}
			>
				{#snippet children(nftCollection)}
					{#if nftCollection != null}
						<div>
							<dt>collection</dt>
							<dd>
								<NftCollectionView
									selection={select(EntityType.NftCollection, nftCollection[EntityMetaKey.Selector])}
									prefetched={nftCollection}
									layout={EntityLayout.Value}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$token}
			>
				{#snippet children(nftToken)}
					{#if nftToken != null}
						<div>
							<dt>token</dt>
							<dd>
								<NftTokenView
									selection={select(EntityType.NftToken, nftToken[EntityMetaKey.Selector])}
									prefetched={nftToken}
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
							basisPoints: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const basisPoints = entity.basisPoints}
					{#if basisPoints != null}
						<div>
							<dt>basis points</dt>
							<dd>
								{basisPoints}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<div>
				<dt>calculation kind</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									calculationKind: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{entity.calculationKind}
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
							salePriceDenominationPolicy: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const salePriceDenominationPolicy = entity.salePriceDenominationPolicy}
					{#if salePriceDenominationPolicy != null}
						<div>
							<dt>sale price denomination policy</dt>
							<dd>
								{salePriceDenominationPolicy}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							enforcementKind: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const enforcementKind = entity.enforcementKind}
					{#if enforcementKind != null}
						<div>
							<dt>enforcement kind</dt>
							<dd>
								{enforcementKind}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							ledgerCoordinateKind: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const ledgerCoordinateKind = entity.ledgerCoordinateKind}
					{#if ledgerCoordinateKind != null}
						<div>
							<dt>ledger coordinate kind</dt>
							<dd>
								{ledgerCoordinateKind}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							ledgerCoordinateValue: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const ledgerCoordinateValue = entity.ledgerCoordinateValue}
					{#if ledgerCoordinateValue != null}
						<div>
							<dt>ledger coordinate value</dt>
							<dd>
								{ledgerCoordinateValue}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							contractAddress: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const contractAddress = entity.contractAddress}
					{#if contractAddress != null}
						<div>
							<dt>contract address</dt>
							<dd>
								<TruncatedValue value={contractAddress} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
