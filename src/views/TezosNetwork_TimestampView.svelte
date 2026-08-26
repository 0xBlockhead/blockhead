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
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: Omit<EntitySelectionViewProps<EntityType.TezosNetwork_Timestamp>, 'prefetched'> = $props()


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import TezosNetworkView from '$/views/TezosNetworkView.svelte'
</script>


<EntityView
	entityType={EntityType.TezosNetwork_Timestamp}
	entitySelector={selection.entitySelector}
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
					<TezosNetworkView
						selection={select(EntityType.TezosNetwork, selection.entitySelector.$network)}
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
							latestLevel: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const latestLevel = entity.latestLevel}
					{#if latestLevel != null}
						<div>
							<dt>latest level</dt>
							<dd>
								{latestLevel}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							protocolHash: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const protocolHash = entity.protocolHash}
					{#if protocolHash != null}
						<div>
							<dt>protocol hash</dt>
							<dd>
								<TruncatedValue value={protocolHash} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							cycle: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const cycle = entity.cycle}
					{#if cycle != null}
						<div>
							<dt>cycle</dt>
							<dd>
								{cycle}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							totalSupplyMutez: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const totalSupplyMutez = entity.totalSupplyMutez}
					{#if totalSupplyMutez != null}
						<div>
							<dt>total supply mutez</dt>
							<dd>
								{totalSupplyMutez}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							activeBakerCount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const activeBakerCount = entity.activeBakerCount}
					{#if activeBakerCount != null}
						<div>
							<dt>active baker count</dt>
							<dd>
								{activeBakerCount}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							indexerLagBlocks: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const indexerLagBlocks = entity.indexerLagBlocks}
					{#if indexerLagBlocks != null}
						<div>
							<dt>indexer lag blocks</dt>
							<dd>
								{indexerLagBlocks}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
