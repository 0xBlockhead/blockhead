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
		title,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: Omit<EntitySelectionViewProps<EntityType.SuiRegulatedCoinState_Timestamp>, 'prefetched'> = $props()

	const coinType = $derived(selection.entitySelector.$coinType)


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import SuiCoinTypeView from '$/views/SuiCoinTypeView.svelte'
</script>


<EntityView
	entityType={EntityType.SuiRegulatedCoinState_Timestamp}
	entitySelector={selection.entitySelector}
	title={title ?? 'Sui regulated coin state timestamp'}
	href={
		href === undefined ?
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/coin-type/[coinType=stringSegment]/(suiCoinType)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
				{
					network: (
						'caip2' in coinType.$network.$network ?
							caip2StringFromValue(coinType.$network.$network.caip2)
						:
							coinType.$network.$network.slug
					),
					coinType: coinType.coinType,
					timestampMs: String(selection.entitySelector.timestampMs),
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
	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>coin type</dt>
				<dd>
					<SuiCoinTypeView
						selection={select(EntityType.SuiCoinType, selection.entitySelector.$coinType)}
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
							denyCapObjectId: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const denyCapObjectId = entity.denyCapObjectId}
					{#if denyCapObjectId != null}
						<div>
							<dt>deny cap object ID</dt>
							<dd>
								{denyCapObjectId}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							denyListObjectId: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const denyListObjectId = entity.denyListObjectId}
					{#if denyListObjectId != null}
						<div>
							<dt>deny list object ID</dt>
							<dd>
								{denyListObjectId}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							globalPause: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const globalPause = entity.globalPause}
					{#if globalPause != null}
						<div>
							<dt>global pause</dt>
							<dd>
								{globalPause ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							denyListEpoch: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const denyListEpoch = entity.denyListEpoch}
					{#if denyListEpoch != null}
						<div>
							<dt>deny list epoch</dt>
							<dd>
								{denyListEpoch}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							deniedAddressCount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const deniedAddressCount = entity.deniedAddressCount}
					{#if deniedAddressCount != null}
						<div>
							<dt>denied address count</dt>
							<dd>
								{deniedAddressCount}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
