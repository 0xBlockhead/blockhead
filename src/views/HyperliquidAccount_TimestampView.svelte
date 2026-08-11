<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2StringFromValue } from '$/lib/caip2.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: Omit<EntitySelectionViewProps<EntityType.HyperliquidAccount_Timestamp>, 'prefetched'> = $props()

	const account = $derived(selection.entitySelector.$account)


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import HyperliquidAccountView from '$/views/HyperliquidAccountView.svelte'
</script>


<EntityView
	entityType={EntityType.HyperliquidAccount_Timestamp}
	entitySelector={selection.entitySelector}
	href={
		href === undefined ?
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(accounts)/account/[accountId=stringSegmentOrPolkadotAccountIdOrEvmAddressOrSolanaPubkey]/(selection)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]/(nearAccountTimestamp)/[infoType=stringSegment]',
				{
					network: (
						'caip2' in account.$network ?
							caip2StringFromValue(account.$network.caip2)
						:
							account.$network.slug
					),
					accountId: account.address,
					timestampMs: String(selection.entitySelector.timestampMs),
					source: selection.entitySelector.source,
					infoType: selection.entitySelector.infoType,
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
				<dt>account</dt>
				<dd>
					<HyperliquidAccountView
						selection={select(EntityType.HyperliquidAccount, selection.entitySelector.$account)}
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

			<div>
				<dt>Info operation</dt>
				<dd>
					{selection.entitySelector.infoType}
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							accountValue: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const accountValue = entity.accountValue}
					{#if accountValue != null}
						<div>
							<dt>account value</dt>
							<dd>
								{accountValue}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							totalNtlPos: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const totalNtlPos = entity.totalNtlPos}
					{#if totalNtlPos != null}
						<div>
							<dt>total ntl pos</dt>
							<dd>
								{totalNtlPos}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							totalRawUsd: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const totalRawUsd = entity.totalRawUsd}
					{#if totalRawUsd != null}
						<div>
							<dt>total raw usd</dt>
							<dd>
								{totalRawUsd}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							totalMarginUsed: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const totalMarginUsed = entity.totalMarginUsed}
					{#if totalMarginUsed != null}
						<div>
							<dt>total margin used</dt>
							<dd>
								{totalMarginUsed}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							withdrawable: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const withdrawable = entity.withdrawable}
					{#if withdrawable != null}
						<div>
							<dt>withdrawable</dt>
							<dd>
								{withdrawable}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							crossMaintenanceMarginUsed: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const crossMaintenanceMarginUsed = entity.crossMaintenanceMarginUsed}
					{#if crossMaintenanceMarginUsed != null}
						<div>
							<dt>cross maintenance margin used</dt>
							<dd>
								{crossMaintenanceMarginUsed}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							borrowLendHealth: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const borrowLendHealth = entity.borrowLendHealth}
					{#if borrowLendHealth != null}
						<div>
							<dt>borrow lend health</dt>
							<dd>
								{borrowLendHealth}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							borrowLendHealthFactor: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const borrowLendHealthFactor = entity.borrowLendHealthFactor}
					{#if borrowLendHealthFactor != null}
						<div>
							<dt>borrow lend health factor</dt>
							<dd>
								{borrowLendHealthFactor}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
