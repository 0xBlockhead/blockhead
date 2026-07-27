<!-- Generated from APP.ts. Do not edit by hand. -->

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
		title,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: EntitySelectionViewProps<EntityType.HederaNetworkFee_Timestamp> = $props()

	const pendingEntity = $derived({ ...selection.entitySelector, ...prefetched })
	const titleFallback = 'hedera network fee timestamp'


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
</script>


<EntityView
	entityType={EntityType.HederaNetworkFee_Timestamp}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		hedera network fee timestamp
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>network</dt>
				<dd>
					<NetworkView
						selection={select(EntityType.Network, selection.entitySelector.$network)}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>transaction type</dt>
				<dd>
					{pendingEntity.transactionType}
				</dd>
			</div>

			<div>
				<dt>Timestamp</dt>
				<dd>
					<Timestamp timestamp={Number(pendingEntity.timestampMs)} />
				</dd>
			</div>

			<div>
				<dt>Source</dt>
				<dd>
					{pendingEntity.source}
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
								{String(gasTinybar)}
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
								{String(baseTinycent)}
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
								{String(nodeTinycent)}
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
								{String(networkTinycent)}
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
								{String(serviceTinycent)}
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
								{String(totalTinycent)}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
