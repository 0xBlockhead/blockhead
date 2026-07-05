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
			selection: EntityProxyResource<typeof schema, EntityType.TronTransactionReceipt>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.TronTransactionReceipt>>
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
	const tronTransactionReceipt = $derived(selection({}))
	const titleFallback = $derived('tron transaction receipt')
	const viewDomId = $derived('tron-transaction-receipt-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))
	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import TronTransactionView from '$/views/TronTransactionView.svelte'
</script>


<EntityView
	entityType={EntityType.TronTransactionReceipt}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={tronTransactionReceipt}>
			{#snippet Pending()}
				{title || 'tron transaction receipt'}
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
				<dt>Transaction</dt>
				<dd>
					<TronTransactionView
						selection={select(EntityType.TronTransaction, selection.entitySelector.$transaction)}
						layout={EntityLayout.Title}
						open={false}
					/>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						sources: [
							Source.TronGrid_Rest,
							Source.TronFullNode_Rest,
							Source.TronSolidityNode_Rest,
							Source.TronScan_Rest,
						],
						fields: {
							feeSun: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const feeSun = prefetched.feeSun}
					{#if feeSun !== undefined && feeSun !== null}
						<div>
							<dt>Fee sun</dt>
							<dd>
								{String((feeSun) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const feeSun = resolvedEntity.feeSun}
					{#if feeSun !== undefined && feeSun !== null}
						<div>
							<dt>Fee sun</dt>
							<dd>
								{String((feeSun) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						sources: [
							Source.TronGrid_Rest,
							Source.TronFullNode_Rest,
							Source.TronSolidityNode_Rest,
							Source.TronScan_Rest,
						],
						fields: {
							result: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const result = prefetched.result}
					{#if result !== undefined && result !== null}
						<div>
							<dt>Result</dt>
							<dd>
								{String((result) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const result = resolvedEntity.result}
					{#if result !== undefined && result !== null}
						<div>
							<dt>Result</dt>
							<dd>
								{String((result) ?? '')}
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
				{#snippet Pending()}
					{@const resMessageHex = prefetched.resMessageHex}
					{#if resMessageHex !== undefined && resMessageHex !== null}
						<div>
							<dt>Result message hex</dt>
							<dd>
								{String((resMessageHex) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const resMessageHex = resolvedEntity.resMessageHex}
					{#if resMessageHex !== undefined && resMessageHex !== null}
						<div>
							<dt>Result message hex</dt>
							<dd>
								{String((resMessageHex) ?? '')}
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
				{#snippet Pending()}
					{@const contractAddress = prefetched.contractAddress}
					{#if contractAddress !== undefined && contractAddress !== null}
						<div>
							<dt>Contract address</dt>
							<dd>
								<TruncatedValue value={String((contractAddress) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const contractAddress = resolvedEntity.contractAddress}
					{#if contractAddress !== undefined && contractAddress !== null}
						<div>
							<dt>Contract address</dt>
							<dd>
								<TruncatedValue value={String((contractAddress) ?? '')} />
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
				{#snippet Pending()}
					{@const energyUsage = prefetched.energyUsage}
					{#if energyUsage !== undefined && energyUsage !== null}
						<div>
							<dt>Energy usage</dt>
							<dd>
								{String((energyUsage) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const energyUsage = resolvedEntity.energyUsage}
					{#if energyUsage !== undefined && energyUsage !== null}
						<div>
							<dt>Energy usage</dt>
							<dd>
								{String((energyUsage) ?? '')}
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
				{#snippet Pending()}
					{@const originEnergyUsage = prefetched.originEnergyUsage}
					{#if originEnergyUsage !== undefined && originEnergyUsage !== null}
						<div>
							<dt>Origin energy usage</dt>
							<dd>
								{String((originEnergyUsage) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const originEnergyUsage = resolvedEntity.originEnergyUsage}
					{#if originEnergyUsage !== undefined && originEnergyUsage !== null}
						<div>
							<dt>Origin energy usage</dt>
							<dd>
								{String((originEnergyUsage) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						sources: [
							Source.TronGrid_Rest,
							Source.TronFullNode_Rest,
							Source.TronSolidityNode_Rest,
						],
						fields: {
							energyUsageTotal: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const energyUsageTotal = prefetched.energyUsageTotal}
					{#if energyUsageTotal !== undefined && energyUsageTotal !== null}
						<div>
							<dt>Energy usage total</dt>
							<dd>
								{String((energyUsageTotal) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const energyUsageTotal = resolvedEntity.energyUsageTotal}
					{#if energyUsageTotal !== undefined && energyUsageTotal !== null}
						<div>
							<dt>Energy usage total</dt>
							<dd>
								{String((energyUsageTotal) ?? '')}
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
				{#snippet Pending()}
					{@const energyFeeSun = prefetched.energyFeeSun}
					{#if energyFeeSun !== undefined && energyFeeSun !== null}
						<div>
							<dt>Energy fee sun</dt>
							<dd>
								{String((energyFeeSun) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const energyFeeSun = resolvedEntity.energyFeeSun}
					{#if energyFeeSun !== undefined && energyFeeSun !== null}
						<div>
							<dt>Energy fee sun</dt>
							<dd>
								{String((energyFeeSun) ?? '')}
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
				{#snippet Pending()}
					{@const energyPenaltyTotal = prefetched.energyPenaltyTotal}
					{#if energyPenaltyTotal !== undefined && energyPenaltyTotal !== null}
						<div>
							<dt>Energy penalty total</dt>
							<dd>
								{String((energyPenaltyTotal) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const energyPenaltyTotal = resolvedEntity.energyPenaltyTotal}
					{#if energyPenaltyTotal !== undefined && energyPenaltyTotal !== null}
						<div>
							<dt>Energy penalty total</dt>
							<dd>
								{String((energyPenaltyTotal) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						sources: [
							Source.TronGrid_Rest,
							Source.TronFullNode_Rest,
							Source.TronSolidityNode_Rest,
						],
						fields: {
							netUsage: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const netUsage = prefetched.netUsage}
					{#if netUsage !== undefined && netUsage !== null}
						<div>
							<dt>Net usage</dt>
							<dd>
								{String((netUsage) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const netUsage = resolvedEntity.netUsage}
					{#if netUsage !== undefined && netUsage !== null}
						<div>
							<dt>Net usage</dt>
							<dd>
								{String((netUsage) ?? '')}
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
				{#snippet Pending()}
					{@const netFeeSun = prefetched.netFeeSun}
					{#if netFeeSun !== undefined && netFeeSun !== null}
						<div>
							<dt>Net fee sun</dt>
							<dd>
								{String((netFeeSun) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const netFeeSun = resolvedEntity.netFeeSun}
					{#if netFeeSun !== undefined && netFeeSun !== null}
						<div>
							<dt>Net fee sun</dt>
							<dd>
								{String((netFeeSun) ?? '')}
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
				{#snippet Pending()}
					{@const logCount = prefetched.logCount}
					{#if logCount !== undefined && logCount !== null}
						<div>
							<dt>Logs</dt>
							<dd>
								{String((logCount) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const logCount = resolvedEntity.logCount}
					{#if logCount !== undefined && logCount !== null}
						<div>
							<dt>Logs</dt>
							<dd>
								{String((logCount) ?? '')}
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
				{#snippet Pending()}
					{@const internalTransactionCount = prefetched.internalTransactionCount}
					{#if internalTransactionCount !== undefined && internalTransactionCount !== null}
						<div>
							<dt>Internal transactions</dt>
							<dd>
								{String((internalTransactionCount) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const internalTransactionCount = resolvedEntity.internalTransactionCount}
					{#if internalTransactionCount !== undefined && internalTransactionCount !== null}
						<div>
							<dt>Internal transactions</dt>
							<dd>
								{String((internalTransactionCount) ?? '')}
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
								sources: [
									Source.TronGrid_Rest,
									Source.TronFullNode_Rest,
									Source.TronSolidityNode_Rest,
								],
								fields: {
									contractResultHex: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const contractResultHex = prefetched.contractResultHex}
							{#if contractResultHex !== undefined && contractResultHex !== null}
								{(contractResultHex?.values ?? []).map((value) => String(value ?? '')).filter(Boolean).join(', ')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const contractResultHex = resolvedEntity.contractResultHex}
							{#if contractResultHex !== undefined && contractResultHex !== null}
								{(contractResultHex?.values ?? []).map((value) => String(value ?? '')).filter(Boolean).join(', ')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>
	{/snippet}
</EntityView>
