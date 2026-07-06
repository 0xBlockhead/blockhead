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
		href ?? (pendingEntity.timestampMs !== undefined && pendingEntity.source !== undefined ? resolve('/(explore)/(ens)/ens/observations/[timestampMs=nonNegativeInteger]/[source]', {
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
					href={resolve('/(explore)/(ens)/ens')}
					layout={EntityLayout.Title}
					open={false}
				/>
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				<GlobalEnsNetworkView
					selection={select(EntityType._GlobalEnsNetwork, selection.entitySelector.$hub)}
					href={resolve('/(explore)/(ens)/ens')}
					layout={EntityLayout.Title}
					open={false}
				/>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={globalEnsNetworkTimestamp}>
			{#snippet Pending()}
				{@const timestampMs0 = selection.entitySelector.timestampMs ?? prefetched.timestampMs}
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
						selection={select(EntityType._GlobalEnsNetwork, selection.entitySelector.$hub)}
						href={resolve('/(explore)/(ens)/ens')}
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
							{@const timestampMs = selection.entitySelector.timestampMs ?? prefetched.timestampMs}
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
							{@const source = selection.entitySelector.source ?? prefetched.source}
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
							sourceWindowNameCount: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const sourceWindowNameCount = prefetched.sourceWindowNameCount}
					{#if sourceWindowNameCount !== undefined && sourceWindowNameCount !== null}
						<div>
							<dt>Source window names</dt>
							<dd>
								<NumberValue value={Number(sourceWindowNameCount)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const sourceWindowNameCount = resolvedEntity.sourceWindowNameCount}
					{#if sourceWindowNameCount !== undefined && sourceWindowNameCount !== null}
						<div>
							<dt>Source window names</dt>
							<dd>
								<NumberValue value={Number(sourceWindowNameCount)} />
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
							sourceWindowRecordCount: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const sourceWindowRecordCount = prefetched.sourceWindowRecordCount}
					{#if sourceWindowRecordCount !== undefined && sourceWindowRecordCount !== null}
						<div>
							<dt>Source window records</dt>
							<dd>
								<NumberValue value={Number(sourceWindowRecordCount)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const sourceWindowRecordCount = resolvedEntity.sourceWindowRecordCount}
					{#if sourceWindowRecordCount !== undefined && sourceWindowRecordCount !== null}
						<div>
							<dt>Source window records</dt>
							<dd>
								<NumberValue value={Number(sourceWindowRecordCount)} />
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
							sourceWindowReverseRecordCount: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const sourceWindowReverseRecordCount = prefetched.sourceWindowReverseRecordCount}
					{#if sourceWindowReverseRecordCount !== undefined && sourceWindowReverseRecordCount !== null}
						<div>
							<dt>Source window reverse records</dt>
							<dd>
								<NumberValue value={Number(sourceWindowReverseRecordCount)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const sourceWindowReverseRecordCount = resolvedEntity.sourceWindowReverseRecordCount}
					{#if sourceWindowReverseRecordCount !== undefined && sourceWindowReverseRecordCount !== null}
						<div>
							<dt>Source window reverse records</dt>
							<dd>
								<NumberValue value={Number(sourceWindowReverseRecordCount)} />
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
							localCatalogContractCount: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const localCatalogContractCount = prefetched.localCatalogContractCount}
					{#if localCatalogContractCount !== undefined && localCatalogContractCount !== null}
						<div>
							<dt>Local catalog contracts</dt>
							<dd>
								<NumberValue value={Number(localCatalogContractCount)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const localCatalogContractCount = resolvedEntity.localCatalogContractCount}
					{#if localCatalogContractCount !== undefined && localCatalogContractCount !== null}
						<div>
							<dt>Local catalog contracts</dt>
							<dd>
								<NumberValue value={Number(localCatalogContractCount)} />
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
					{@const discoveredResolverContractCount = prefetched.discoveredResolverContractCount}
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
					{@const subgraphBlockNumber = prefetched.subgraphBlockNumber}
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
					{@const rpcBlockNumber = prefetched.rpcBlockNumber}
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
					{@const reachable = prefetched.reachable}
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
