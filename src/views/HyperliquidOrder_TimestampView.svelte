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
	}: Omit<EntitySelectionViewProps<EntityType.HyperliquidOrder_Timestamp>, 'prefetched'> = $props()

	const order = $derived(selection.entitySelector.$order)


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import HyperliquidOrderView from '$/views/HyperliquidOrderView.svelte'
</script>


<EntityView
	entityType={EntityType.HyperliquidOrder_Timestamp}
	entitySelector={selection.entitySelector}
	href={
		href === undefined ?
			(
				'cloid' in order ?
					resolve(
						'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(accounts)/account/[accountId=stringSegmentOrPolkadotAccountIdOrEvmAddressOrSolanaPubkey]/(selection)/order/client/[cloid=stringSegment]/(hyperliquidOrder)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
						{
							network: (
								'caip2' in order.$account.$network ?
									caip2StringFromValue(order.$account.$network.caip2)
								:
									order.$account.$network.slug
							),
							accountId: order.$account.address,
							cloid: order.cloid,
							timestampMs: String(selection.entitySelector.timestampMs),
							source: selection.entitySelector.source,
						}
					)
				:
					undefined
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
				<dt>order</dt>
				<dd>
					<HyperliquidOrderView
						selection={select(EntityType.HyperliquidOrder, selection.entitySelector.$order)}
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
							status: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const status = entity.status}
					{#if status != null}
						<div>
							<dt>status</dt>
							<dd>
								{status}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							statusTimestampMs: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const statusTimestampMs = entity.statusTimestampMs}
					{#if statusTimestampMs != null}
						<div>
							<dt>status timestamp ms</dt>
							<dd>
								<Timestamp timestamp={statusTimestampMs} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							size: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const size = entity.size}
					{#if size != null}
						<div>
							<dt>size</dt>
							<dd>
								{size}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							filledSize: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const filledSize = entity.filledSize}
					{#if filledSize != null}
						<div>
							<dt>filled size</dt>
							<dd>
								{filledSize}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							remainingSize: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const remainingSize = entity.remainingSize}
					{#if remainingSize != null}
						<div>
							<dt>remaining size</dt>
							<dd>
								{remainingSize}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							lastFillTid: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const lastFillTid = entity.lastFillTid}
					{#if lastFillTid != null}
						<div>
							<dt>last fill tid</dt>
							<dd>
								{lastFillTid}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
