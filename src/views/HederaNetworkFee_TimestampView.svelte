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
	}: Omit<EntitySelectionViewProps<EntityType.HederaNetworkFee_Timestamp>, 'prefetched'> = $props()

	const network = $derived(selection.entitySelector.$network)


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
</script>


<EntityView
	entityType={EntityType.HederaNetworkFee_Timestamp}
	entitySelector={selection.entitySelector}
	href={
		href === undefined ?
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/fee/[transactionType=stringSegment]/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
				{
					network: (
						'caip2' in network ?
							caip2StringFromValue(network.caip2)
						:
							network.slug
					),
					transactionType: selection.entitySelector.transactionType,
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
				<dt>network</dt>
				<dd>
					<NetworkView
						selection={select(EntityType.Network, selection.entitySelector.$network)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<div>
				<dt>transaction type</dt>
				<dd>
					{selection.entitySelector.transactionType}
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
							gasTinybar: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const gasTinybar = entity.gasTinybar}
					{#if gasTinybar != null}
						<div>
							<dt>gas tinybar</dt>
							<dd>
								{gasTinybar}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							baseTinycent: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const baseTinycent = entity.baseTinycent}
					{#if baseTinycent != null}
						<div>
							<dt>base tinycent</dt>
							<dd>
								{baseTinycent}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							nodeTinycent: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const nodeTinycent = entity.nodeTinycent}
					{#if nodeTinycent != null}
						<div>
							<dt>node tinycent</dt>
							<dd>
								{nodeTinycent}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							networkTinycent: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const networkTinycent = entity.networkTinycent}
					{#if networkTinycent != null}
						<div>
							<dt>network tinycent</dt>
							<dd>
								{networkTinycent}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							serviceTinycent: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const serviceTinycent = entity.serviceTinycent}
					{#if serviceTinycent != null}
						<div>
							<dt>service tinycent</dt>
							<dd>
								{serviceTinycent}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							totalTinycent: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const totalTinycent = entity.totalTinycent}
					{#if totalTinycent != null}
						<div>
							<dt>total tinycent</dt>
							<dd>
								{totalTinycent}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
