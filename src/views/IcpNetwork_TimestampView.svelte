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
	}: EntitySelectionViewProps<EntityType.IcpNetwork_Timestamp> = $props()

	const pendingEntity = $derived({ ...selection.entitySelector, ...prefetched })
	const titleFallback = 'ICP network timestamp'


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import IcpNetworkView from '$/views/IcpNetworkView.svelte'
</script>


<EntityView
	entityType={EntityType.IcpNetwork_Timestamp}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		ICP network timestamp
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>network</dt>
				<dd>
					<IcpNetworkView
						selection={select(EntityType.IcpNetwork, selection.entitySelector.$network)}
						layout={EntityLayout.Value}
						open={false}
					/>
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
							registryVersion: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const registryVersion = entity.registryVersion}
					{#if registryVersion != null}
						<div>
							<dt>registry version</dt>
							<dd>
								{String(registryVersion)}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							subnetCount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const subnetCount = entity.subnetCount}
					{#if subnetCount != null}
						<div>
							<dt>subnet count</dt>
							<dd>
								{String(subnetCount)}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							canisterCount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const canisterCount = entity.canisterCount}
					{#if canisterCount != null}
						<div>
							<dt>canister count</dt>
							<dd>
								{String(canisterCount)}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							boundaryNodeCount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const boundaryNodeCount = entity.boundaryNodeCount}
					{#if boundaryNodeCount != null}
						<div>
							<dt>boundary node count</dt>
							<dd>
								{String(boundaryNodeCount)}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							rootKeyHash: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const rootKeyHash = entity.rootKeyHash}
					{#if rootKeyHash != null}
						<div>
							<dt>root key hash</dt>
							<dd>
								<TruncatedValue value={rootKeyHash} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
