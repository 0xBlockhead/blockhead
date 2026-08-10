<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { untrack } from 'svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: Omit<EntitySelectionViewProps<EntityType.Payout>, 'prefetched'> = $props()


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import PayoutClaim_TimestampsView from '$/views/PayoutClaim_TimestampsView.svelte'
	import AssetInstanceView from '$/views/AssetInstanceView.svelte'
	import AssetClassView from '$/views/AssetClassView.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
	import EvmContractView from '$/views/EvmContractView.svelte'
</script>


<EntityView
	entityType={EntityType.Payout}
	entitySelector={selection.entitySelector}
	href={
		href === undefined ?
			resolve(
				'/payout/[payoutSource=stringSegment]/[payoutId=stringSegment]',
				{
					payoutSource: selection.entitySelector.source,
					payoutId: selection.entitySelector.payoutId,
				}
			)
		:
			href ?? undefined
	}
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
						{@const assetInstanceInitial = untrack(() => assetInstance)}
						<div>
							<dt>asset instance</dt>
							<dd>
								<AssetInstanceView
									selection={select(EntityType.AssetInstance, (assetInstance ?? assetInstanceInitial)[EntityMetaKey.Selector])}
									prefetched={assetInstance ?? assetInstanceInitial}
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
						{@const assetClassInitial = untrack(() => assetClass)}
						<div>
							<dt>asset class</dt>
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
				resource={selection.$network}
			>
				{#snippet children(network)}
					{#if network != null}
						{@const networkInitial = untrack(() => network)}
						<div>
							<dt>network</dt>
							<dd>
								<NetworkView
									selection={select(EntityType.Network, (network ?? networkInitial)[EntityMetaKey.Selector])}
									prefetched={network ?? networkInitial}
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
						{@const evmContractInitial = untrack(() => evmContract)}
						<div>
							<dt>distributor contract</dt>
							<dd>
								<EvmContractView
									selection={select(EntityType.EvmContract, (evmContract ?? evmContractInitial)[EntityMetaKey.Selector])}
									prefetched={evmContract ?? evmContractInitial}
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
					<PayoutClaim_TimestampsView
						selection={claimsResource}
						countResource={claimsResource.count}
						title='claims'
						id='claims'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
