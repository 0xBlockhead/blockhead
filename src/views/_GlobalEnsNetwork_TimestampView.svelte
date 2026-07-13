<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { EntityProxyData, EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'


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
			selection: EntityProxyResource<typeof schema, EntityType._GlobalEnsNetwork_Timestamp>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType._GlobalEnsNetwork_Timestamp>>
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
	const globalEnsNetworkTimestamp = $derived(selection({
		sources: [
			Source.Constants_Internal,
			Source.TheGraph_Graphql,
			Source.Voltaire_JsonRpc,
		],
	}))
	const titleFallback = $derived('ENS hub observation')
	const viewDomId = $derived('-global-ens-network-timestamp-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import GlobalEnsNetworkView from '$/views/_GlobalEnsNetworkView.svelte'
</script>


<EntityView
	entityType={EntityType._GlobalEnsNetwork_Timestamp}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	href={
		href ?? (pendingEntity.timestampMs !== undefined && pendingEntity.source !== undefined ? resolve('/ens/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]', {
			timestampMs: String(pendingEntity.timestampMs ?? ''),
			source: String(pendingEntity.source ?? ''),
		}) : undefined)
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={globalEnsNetworkTimestamp}>
			{#snippet Pending()}
				<GlobalEnsNetworkView
					selection={select(EntityType._GlobalEnsNetwork, selection.entitySelector.$hub)}
					href={resolve('/ens')}
					layout={EntityLayout.Title}
					open={false}
				/>
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				<GlobalEnsNetworkView
					selection={select(EntityType._GlobalEnsNetwork, selection.entitySelector.$hub)}
					href={resolve('/ens')}
					layout={EntityLayout.Title}
					open={false}
				/>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={globalEnsNetworkTimestamp}>
			{#snippet Pending()}
				{@const timestampMs0 = pendingEntity.timestampMs}
				{#if timestampMs0 !== undefined && timestampMs0 !== null}
					<Timestamp timestamp={Number(timestampMs0)} />
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const timestampMs0 = resolvedEntity.timestampMs}
				{#if timestampMs0 !== undefined && timestampMs0 !== null}
					<Timestamp timestamp={Number(timestampMs0)} />
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Hub</dt>
				<dd>
					<GlobalEnsNetworkView
						selection={select(EntityType._GlobalEnsNetwork, selection.entitySelector.$hub, {})}
						href={resolve('/ens')}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<div>
				<dt>Timestamp</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									timestampMs: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const timestampMs = pendingEntity.timestampMs}
							{#if timestampMs !== undefined && timestampMs !== null}
								<Timestamp timestamp={Number(timestampMs)} />
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const timestampMs = resolvedEntity.timestampMs}
							{#if timestampMs !== undefined && timestampMs !== null}
								<Timestamp timestamp={Number(timestampMs)} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<div>
				<dt>Source</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									source: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const source = pendingEntity.source}
							{#if source !== undefined && source !== null}
								{String((source) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const source = resolvedEntity.source}
							{#if source !== undefined && source !== null}
								{String((source) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					selection({
						fields: {
							observedNameCount: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const observedNameCount = pendingEntity.observedNameCount}
					{#if observedNameCount !== undefined && observedNameCount !== null}
						<div>
							<dt>Observed names</dt>
							<dd>
								<NumberValue value={Number(observedNameCount)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const observedNameCount = resolvedEntity.observedNameCount}
					{#if observedNameCount !== undefined && observedNameCount !== null}
						<div>
							<dt>Observed names</dt>
							<dd>
								<NumberValue value={Number(observedNameCount)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					selection({
						fields: {
							observedRecordCount: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const observedRecordCount = pendingEntity.observedRecordCount}
					{#if observedRecordCount !== undefined && observedRecordCount !== null}
						<div>
							<dt>Observed records</dt>
							<dd>
								<NumberValue value={Number(observedRecordCount)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const observedRecordCount = resolvedEntity.observedRecordCount}
					{#if observedRecordCount !== undefined && observedRecordCount !== null}
						<div>
							<dt>Observed records</dt>
							<dd>
								<NumberValue value={Number(observedRecordCount)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					selection({
						fields: {
							observedReverseRecordCount: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const observedReverseRecordCount = pendingEntity.observedReverseRecordCount}
					{#if observedReverseRecordCount !== undefined && observedReverseRecordCount !== null}
						<div>
							<dt>Observed reverse records</dt>
							<dd>
								<NumberValue value={Number(observedReverseRecordCount)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const observedReverseRecordCount = resolvedEntity.observedReverseRecordCount}
					{#if observedReverseRecordCount !== undefined && observedReverseRecordCount !== null}
						<div>
							<dt>Observed reverse records</dt>
							<dd>
								<NumberValue value={Number(observedReverseRecordCount)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					selection({
						fields: {
							seededContractCount: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const seededContractCount = pendingEntity.seededContractCount}
					{#if seededContractCount !== undefined && seededContractCount !== null}
						<div>
							<dt>Seeded contracts</dt>
							<dd>
								<NumberValue value={Number(seededContractCount)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const seededContractCount = resolvedEntity.seededContractCount}
					{#if seededContractCount !== undefined && seededContractCount !== null}
						<div>
							<dt>Seeded contracts</dt>
							<dd>
								<NumberValue value={Number(seededContractCount)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					selection({
						fields: {
							discoveredResolverContractCount: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const discoveredResolverContractCount = pendingEntity.discoveredResolverContractCount}
					{#if discoveredResolverContractCount !== undefined && discoveredResolverContractCount !== null}
						<div>
							<dt>Discovered resolver contracts</dt>
							<dd>
								<NumberValue value={Number(discoveredResolverContractCount)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const discoveredResolverContractCount = resolvedEntity.discoveredResolverContractCount}
					{#if discoveredResolverContractCount !== undefined && discoveredResolverContractCount !== null}
						<div>
							<dt>Discovered resolver contracts</dt>
							<dd>
								<NumberValue value={Number(discoveredResolverContractCount)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					selection({
						fields: {
							subgraphBlockNumber: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const subgraphBlockNumber = pendingEntity.subgraphBlockNumber}
					{#if subgraphBlockNumber !== undefined && subgraphBlockNumber !== null}
						<div>
							<dt>Subgraph block</dt>
							<dd>
								<NumberValue value={Number(subgraphBlockNumber)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const subgraphBlockNumber = resolvedEntity.subgraphBlockNumber}
					{#if subgraphBlockNumber !== undefined && subgraphBlockNumber !== null}
						<div>
							<dt>Subgraph block</dt>
							<dd>
								<NumberValue value={Number(subgraphBlockNumber)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					selection({
						fields: {
							rpcBlockNumber: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const rpcBlockNumber = pendingEntity.rpcBlockNumber}
					{#if rpcBlockNumber !== undefined && rpcBlockNumber !== null}
						<div>
							<dt>RPC block</dt>
							<dd>
								<NumberValue value={Number(rpcBlockNumber)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const rpcBlockNumber = resolvedEntity.rpcBlockNumber}
					{#if rpcBlockNumber !== undefined && rpcBlockNumber !== null}
						<div>
							<dt>RPC block</dt>
							<dd>
								<NumberValue value={Number(rpcBlockNumber)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					selection({
						fields: {
							reachable: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const reachable = pendingEntity.reachable}
					{#if reachable !== undefined && reachable !== null}
						<div>
							<dt>Reachable</dt>
							<dd>
								{reachable ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const reachable = resolvedEntity.reachable}
					{#if reachable !== undefined && reachable !== null}
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
