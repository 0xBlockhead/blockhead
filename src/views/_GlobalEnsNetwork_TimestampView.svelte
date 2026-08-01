<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


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
	}: Omit<EntitySelectionViewProps<EntityType._GlobalEnsNetwork_Timestamp>, 'prefetched'> = $props()

	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.Constants_Internal,
			Source.TheGraph_Graphql,
			Source.Voltaire_JsonRpc,
		],
	}))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import GlobalEnsNetworkView from '$/views/_GlobalEnsNetworkView.svelte'
</script>


<EntityView
	entityType={EntityType._GlobalEnsNetwork_Timestamp}
	entitySelector={selection.entitySelector}
	title={title ?? 'ENS hub observation'}
	href={
		href === undefined ?
			resolve(
				'/(explore)/(ens)/ens/(globalEnsNetwork)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
				{
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
	{#snippet Title()}
		<GlobalEnsNetworkView
			selection={select(EntityType._GlobalEnsNetwork, selection.entitySelector.$hub)}
			href={null}
			layout={EntityLayout.Title}
		/>
	{/snippet}

	{#snippet Value()}
		<Timestamp timestamp={selection.entitySelector.timestampMs} />
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>Hub</dt>
				<dd>
					<GlobalEnsNetworkView
						selection={select(EntityType._GlobalEnsNetwork, selection.entitySelector.$hub)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<div>
				<dt>Timestamp</dt>
				<dd>
					<Timestamp timestamp={selection.entitySelector.timestampMs} />
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<div>
				<dt>Source</dt>
				<dd>
					{selection.entitySelector.source}
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							observedNameCount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const observedNameCount = entity.observedNameCount}
					{#if observedNameCount != null}
						<div>
							<dt>Observed names</dt>
							<dd>
								<NumberValue
									value={observedNameCount}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							observedRecordCount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const observedRecordCount = entity.observedRecordCount}
					{#if observedRecordCount != null}
						<div>
							<dt>Observed records</dt>
							<dd>
								<NumberValue
									value={observedRecordCount}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							observedReverseRecordCount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const observedReverseRecordCount = entity.observedReverseRecordCount}
					{#if observedReverseRecordCount != null}
						<div>
							<dt>Observed reverse records</dt>
							<dd>
								<NumberValue
									value={observedReverseRecordCount}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							seededContractCount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const seededContractCount = entity.seededContractCount}
					{#if seededContractCount != null}
						<div>
							<dt>Seeded contracts</dt>
							<dd>
								<NumberValue
									value={seededContractCount}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							discoveredResolverContractCount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const discoveredResolverContractCount = entity.discoveredResolverContractCount}
					{#if discoveredResolverContractCount != null}
						<div>
							<dt>Discovered resolver contracts</dt>
							<dd>
								<NumberValue
									value={discoveredResolverContractCount}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							subgraphBlockNumber: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const subgraphBlockNumber = entity.subgraphBlockNumber}
					{#if subgraphBlockNumber != null}
						<div>
							<dt>Subgraph block</dt>
							<dd>
								<NumberValue
									value={subgraphBlockNumber}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							rpcBlockNumber: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const rpcBlockNumber = entity.rpcBlockNumber}
					{#if rpcBlockNumber != null}
						<div>
							<dt>RPC block</dt>
							<dd>
								<NumberValue
									value={rpcBlockNumber}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							reachable: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const reachable = entity.reachable}
					{#if reachable != null}
						<div>
							<dt>Reachable</dt>
							<dd>
								{reachable ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
