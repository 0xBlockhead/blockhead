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
		prefetched = {},
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: EntitySelectionViewProps<EntityType.TronTransactionReceipt> = $props()


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import TronTransactionView from '$/views/TronTransactionView.svelte'
</script>


<EntityView
	entityType={EntityType.TronTransactionReceipt}
	entitySelector={selection.entitySelector}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>Transaction</dt>
				<dd>
					<TronTransactionView
						selection={select(EntityType.TronTransaction, selection.entitySelector.$transaction)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							feeSun: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const feeSun = entity.feeSun}
					{#if feeSun != null}
						<div>
							<dt>Fee sun</dt>
							<dd>
								{feeSun}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							result: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const result = entity.result}
					{#if result != null}
						<div>
							<dt>Result</dt>
							<dd>
								{result}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							resMessageHex: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resMessageHex = entity.resMessageHex}
					{#if resMessageHex != null}
						<div>
							<dt>Result message hex</dt>
							<dd>
								{resMessageHex}
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
							<dt>Contract address</dt>
							<dd>
								<TruncatedValue value={contractAddress} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							energyUsage: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const energyUsage = entity.energyUsage}
					{#if energyUsage != null}
						<div>
							<dt>Energy usage</dt>
							<dd>
								{energyUsage}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							originEnergyUsage: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const originEnergyUsage = entity.originEnergyUsage}
					{#if originEnergyUsage != null}
						<div>
							<dt>Origin energy usage</dt>
							<dd>
								{originEnergyUsage}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							energyUsageTotal: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const energyUsageTotal = entity.energyUsageTotal}
					{#if energyUsageTotal != null}
						<div>
							<dt>Energy usage total</dt>
							<dd>
								{energyUsageTotal}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							energyFeeSun: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const energyFeeSun = entity.energyFeeSun}
					{#if energyFeeSun != null}
						<div>
							<dt>Energy fee sun</dt>
							<dd>
								{energyFeeSun}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							energyPenaltyTotal: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const energyPenaltyTotal = entity.energyPenaltyTotal}
					{#if energyPenaltyTotal != null}
						<div>
							<dt>Energy penalty total</dt>
							<dd>
								{energyPenaltyTotal}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							netUsage: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const netUsage = entity.netUsage}
					{#if netUsage != null}
						<div>
							<dt>Net usage</dt>
							<dd>
								{netUsage}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							netFeeSun: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const netFeeSun = entity.netFeeSun}
					{#if netFeeSun != null}
						<div>
							<dt>Net fee sun</dt>
							<dd>
								{netFeeSun}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							logCount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const logCount = entity.logCount}
					{#if logCount != null}
						<div>
							<dt>Logs</dt>
							<dd>
								{logCount}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							internalTransactionCount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const internalTransactionCount = entity.internalTransactionCount}
					{#if internalTransactionCount != null}
						<div>
							<dt>Internal transactions</dt>
							<dd>
								{internalTransactionCount}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<div>
				<dt>Contract result hex</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									contractResultHex: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{entity.contractResultHex.values.join(', ')}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>
	{/snippet}
</EntityView>
