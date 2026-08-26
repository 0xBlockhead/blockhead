<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2StringFromValue } from '$/lib/caip2.ts'


	// Context
	import { getAppClient } from '$/routes/applicationClient.ts'


	const select = getAppClient().select

	// State
	let {
		selection,
		title,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: Omit<EntitySelectionViewProps<EntityType.IcpNetwork_Timestamp>, 'prefetched'> = $props()


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import IcpNetworkView from '$/views/IcpNetworkView.svelte'
</script>


<EntityView
	entityType={EntityType.IcpNetwork_Timestamp}
	entitySelector={selection.entitySelector}
	title={title ?? 'ICP network timestamp'}
	href={
		href === undefined ?
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
				{
					network: (
						'caip2' in selection.entitySelector.$network.$network ?
							caip2StringFromValue(selection.entitySelector.$network.$network.caip2)
						:
							selection.entitySelector.$network.$network.slug
					),
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
					<IcpNetworkView
						selection={select(EntityType.IcpNetwork, selection.entitySelector.$network)}
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
								{registryVersion}
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
								{subnetCount}
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
								{canisterCount}
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
								{boundaryNodeCount}
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
