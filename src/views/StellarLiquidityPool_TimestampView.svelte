<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: Omit<EntitySelectionViewProps<EntityType.StellarLiquidityPool_Timestamp>, 'prefetched'> = $props()


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import StellarLiquidityPoolView from '$/views/StellarLiquidityPoolView.svelte'
</script>


<EntityView
	entityType={EntityType.StellarLiquidityPool_Timestamp}
	entitySelector={selection.entitySelector}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>liquidity pool</dt>
				<dd>
					<StellarLiquidityPoolView
						selection={select(EntityType.StellarLiquidityPool, selection.entitySelector.$liquidityPool)}
						layout={EntityLayout.Value}
					/>
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

			<ResourceBoundary
				resource={
					selection({
						fields: {
							ledgerSequence: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const ledgerSequence = entity.ledgerSequence}
					{#if ledgerSequence != null}
						<div>
							<dt>ledger sequence</dt>
							<dd>
								{ledgerSequence}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							reserveA: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const reserveA = entity.reserveA}
					{#if reserveA != null}
						<div>
							<dt>reserve a</dt>
							<dd>
								{reserveA}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							reserveB: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const reserveB = entity.reserveB}
					{#if reserveB != null}
						<div>
							<dt>reserve b</dt>
							<dd>
								{reserveB}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							totalShares: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const totalShares = entity.totalShares}
					{#if totalShares != null}
						<div>
							<dt>total shares</dt>
							<dd>
								{totalShares}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							accounts: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const accounts = entity.accounts}
					{#if accounts != null}
						<div>
							<dt>accounts</dt>
							<dd>
								{accounts}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
