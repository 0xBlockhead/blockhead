<!-- Generated from APP.ts. -->

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
	}: EntitySelectionViewProps<EntityType.Payout> = $props()


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import AssetInstanceView from '$/views/AssetInstanceView.svelte'
	import AssetClassView from '$/views/AssetClassView.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
	import EvmContractView from '$/views/EvmContractView.svelte'
</script>


<EntityView
	entityType={EntityType.Payout}
	entitySelector={selection.entitySelector}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>Source</dt>
				<dd>
					{selection.entitySelector.source}
				</dd>
			</div>

			<div>
				<dt>payout ID</dt>
				<dd>
					{selection.entitySelector.payoutId}
				</dd>
			</div>

			<ResourceBoundary
				resource={selection.$assetInstance}
			>
				{#snippet children(assetInstance)}
					{#if assetInstance != null}
						<div>
							<dt>asset instance</dt>
							<dd>
								<AssetInstanceView
									selection={select(EntityType.AssetInstance, assetInstance[EntityMetaKey.Selector])}
									prefetched={assetInstance}
									layout={EntityLayout.Value}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$assetClass}
			>
				{#snippet children(assetClass)}
					{#if assetClass != null}
						<div>
							<dt>asset class</dt>
							<dd>
								<AssetClassView
									selection={select(EntityType.AssetClass, assetClass[EntityMetaKey.Selector])}
									prefetched={assetClass}
									layout={EntityLayout.Value}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$network}
			>
				{#snippet children(network)}
					{#if network != null}
						<div>
							<dt>network</dt>
							<dd>
								<NetworkView
									selection={select(EntityType.Network, network[EntityMetaKey.Selector])}
									prefetched={network}
									layout={EntityLayout.Value}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$distributorContract}
			>
				{#snippet children(evmContract)}
					{#if evmContract != null}
						<div>
							<dt>distributor contract</dt>
							<dd>
								<EvmContractView
									selection={select(EntityType.EvmContract, evmContract[EntityMetaKey.Selector])}
									prefetched={evmContract}
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
					selection({
						fields: {
							snapshotCoordinate: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const snapshotCoordinate = entity.snapshotCoordinate}
					{#if snapshotCoordinate != null}
						<div>
							<dt>snapshot coordinate</dt>
							<dd>
								{snapshotCoordinate}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							merkleRoot: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const merkleRoot = entity.merkleRoot}
					{#if merkleRoot != null}
						<div>
							<dt>merkle root</dt>
							<dd>
								{merkleRoot}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							totalAmount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const totalAmount = entity.totalAmount}
					{#if totalAmount != null}
						<div>
							<dt>total amount</dt>
							<dd>
								{totalAmount}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							recipientCount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const recipientCount = entity.recipientCount}
					{#if recipientCount != null}
						<div>
							<dt>recipient count</dt>
							<dd>
								{recipientCount}
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
							openedAt: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const openedAt = entity.openedAt}
					{#if openedAt != null}
						<div>
							<dt>opened AT</dt>
							<dd>
								<Timestamp timestamp={openedAt} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							closedAt: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const closedAt = entity.closedAt}
					{#if closedAt != null}
						<div>
							<dt>closed AT</dt>
							<dd>
								<Timestamp timestamp={closedAt} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details()}
		{@const claimsResource = selection.$$claims}
		<ResourceBoundary
			resource={claimsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<EntitiesList
						entityType={EntityType.PayoutClaim_Timestamp}
						countResource={claimsResource.count}
						title='claims'
						open={true}
						id='claims'
						resource={claimsResource()}
					>
						{#snippet Item({ item: payoutClaimTimestamp })}
							<EntityView
								entityType={EntityType.PayoutClaim_Timestamp}
								entitySelector={payoutClaimTimestamp[EntityMetaKey.Selector]}
							/>
						{/snippet}
					</EntitiesList>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
