<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityProxyData, EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityLayout } from '$/components/EntityView.svelte'
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

	const globalEnsNetworkTimestamp = $derived(selection({
		sources: [
			Source.Constants_Internal,
			Source.TheGraph_Graphql,
			Source.Voltaire_JsonRpc,
		],
		fields: {
			sourceWindowNameCount: true,
			sourceWindowRecordCount: true,
			sourceWindowReverseRecordCount: true,
			localCatalogContractCount: true,
			discoveredResolverContractCount: true,
			subgraphBlockNumber: true,
			rpcBlockNumber: true,
			reachable: true,
		},
	}))
	const titleFallback = $derived('ENS hub observation')
	const viewDomId = $derived('-global-ens-network-timestamp-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))
	// Components
	import EntityView from '$/components/EntityView.svelte'
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import GlobalEnsNetworkView from '$/views/_GlobalEnsNetworkView.svelte'
</script>


<EntityView
	entityType={EntityType._GlobalEnsNetwork_Timestamp}
	entitySelector={selection.entitySelector}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{#if layout === EntityLayout.Summary || layout === EntityLayout.SummaryInline}
			<GlobalEnsNetworkView
				selection={select(EntityType._GlobalEnsNetwork, selection.entitySelector.$hub)}
				layout={EntityLayout.Title}
				open={false}
			/>
		{:else}
			<ResourceBoundary resource={globalEnsNetworkTimestamp}>
				{#snippet Pending()}
					<GlobalEnsNetworkView
						selection={select(EntityType._GlobalEnsNetwork, selection.entitySelector.$hub)}
						layout={EntityLayout.Title}
						open={false}
					/>
				{/snippet}

				{#snippet children(entity)}
					<GlobalEnsNetworkView
						selection={select(EntityType._GlobalEnsNetwork, selection.entitySelector.$hub)}
						layout={EntityLayout.Title}
						open={false}
					/>
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Value()}
		{#if layout === EntityLayout.Summary || layout === EntityLayout.SummaryInline}
			{@const timestampMs0 = ({ ...selection.entitySelector, ...prefetched }).timestampMs}
			{#if timestampMs0 !== undefined && timestampMs0 !== null}
				<Timestamp timestamp={Number(timestampMs0)} />
			{/if}
		{:else}
			<ResourceBoundary resource={globalEnsNetworkTimestamp}>
				{#snippet Pending()}
					{@const timestampMs0 = ({ ...selection.entitySelector, ...prefetched }).timestampMs}
					{#if timestampMs0 !== undefined && timestampMs0 !== null}
						<Timestamp timestamp={Number(timestampMs0)} />
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const timestampMs0 = ({ ...selection.entitySelector, ...prefetched, ...entity }).timestampMs}
					{#if timestampMs0 !== undefined && timestampMs0 !== null}
						<Timestamp timestamp={Number(timestampMs0)} />
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Source</dt>
				<dd>
					<ResourceBoundary resource={globalEnsNetworkTimestamp}>
						{#snippet Pending()}
							{@const source = prefetched.source ?? selection.entitySelector.source}
							{#if source !== undefined && source !== null}
								{String((source) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const source = entity.source ?? selection.entitySelector.source ?? prefetched.source}
							{#if source !== undefined && source !== null}
								{String((source) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary resource={globalEnsNetworkTimestamp}>
				{#snippet Pending()}
					{@const sourceWindowNameCount = prefetched.sourceWindowNameCount ?? selection.entitySelector.sourceWindowNameCount}
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
					{@const sourceWindowNameCount = entity.sourceWindowNameCount ?? selection.entitySelector.sourceWindowNameCount ?? prefetched.sourceWindowNameCount}
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
			<ResourceBoundary resource={globalEnsNetworkTimestamp}>
				{#snippet Pending()}
					{@const sourceWindowRecordCount = prefetched.sourceWindowRecordCount ?? selection.entitySelector.sourceWindowRecordCount}
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
					{@const sourceWindowRecordCount = entity.sourceWindowRecordCount ?? selection.entitySelector.sourceWindowRecordCount ?? prefetched.sourceWindowRecordCount}
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
			<ResourceBoundary resource={globalEnsNetworkTimestamp}>
				{#snippet Pending()}
					{@const sourceWindowReverseRecordCount = prefetched.sourceWindowReverseRecordCount ?? selection.entitySelector.sourceWindowReverseRecordCount}
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
					{@const sourceWindowReverseRecordCount = entity.sourceWindowReverseRecordCount ?? selection.entitySelector.sourceWindowReverseRecordCount ?? prefetched.sourceWindowReverseRecordCount}
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
			<ResourceBoundary resource={globalEnsNetworkTimestamp}>
				{#snippet Pending()}
					{@const localCatalogContractCount = prefetched.localCatalogContractCount ?? selection.entitySelector.localCatalogContractCount}
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
					{@const localCatalogContractCount = entity.localCatalogContractCount ?? selection.entitySelector.localCatalogContractCount ?? prefetched.localCatalogContractCount}
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
			<ResourceBoundary resource={globalEnsNetworkTimestamp}>
				{#snippet Pending()}
					{@const discoveredResolverContractCount = prefetched.discoveredResolverContractCount ?? selection.entitySelector.discoveredResolverContractCount}
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
					{@const discoveredResolverContractCount = entity.discoveredResolverContractCount ?? selection.entitySelector.discoveredResolverContractCount ?? prefetched.discoveredResolverContractCount}
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
			<ResourceBoundary resource={globalEnsNetworkTimestamp}>
				{#snippet Pending()}
					{@const subgraphBlockNumber = prefetched.subgraphBlockNumber ?? selection.entitySelector.subgraphBlockNumber}
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
					{@const subgraphBlockNumber = entity.subgraphBlockNumber ?? selection.entitySelector.subgraphBlockNumber ?? prefetched.subgraphBlockNumber}
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
			<ResourceBoundary resource={globalEnsNetworkTimestamp}>
				{#snippet Pending()}
					{@const rpcBlockNumber = prefetched.rpcBlockNumber ?? selection.entitySelector.rpcBlockNumber}
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
					{@const rpcBlockNumber = entity.rpcBlockNumber ?? selection.entitySelector.rpcBlockNumber ?? prefetched.rpcBlockNumber}
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
			<ResourceBoundary resource={globalEnsNetworkTimestamp}>
				{#snippet Pending()}
					{@const reachable = prefetched.reachable ?? selection.entitySelector.reachable}
					{#if reachable !== undefined && reachable !== null}
						<div>
							<dt>Reachable</dt>
							<dd>
								{String((reachable) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const reachable = entity.reachable ?? selection.entitySelector.reachable ?? prefetched.reachable}
					{#if reachable !== undefined && reachable !== null}
						<div>
							<dt>Reachable</dt>
							<dd>
								{String((reachable) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
