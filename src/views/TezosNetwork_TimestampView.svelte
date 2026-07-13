<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityProxyData, EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'


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
			selection: EntityProxyResource<typeof schema, EntityType.TezosNetwork_Timestamp>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.TezosNetwork_Timestamp>>
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
	const tezosNetworkTimestamp = $derived(selection({}))
	const titleFallback = $derived('tezos network timestamp')
	const viewDomId = $derived('tezos-network-timestamp-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import TezosNetworkView from '$/views/TezosNetworkView.svelte'
</script>


<EntityView
	entityType={EntityType.TezosNetwork_Timestamp}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={tezosNetworkTimestamp}>
			{#snippet Pending()}
				{title || 'tezos network timestamp'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>network</dt>
				<dd>
					<TezosNetworkView
						selection={select(EntityType.TezosNetwork, selection.entitySelector.$network, {})}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

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

			<ResourceBoundary
				resource={
					selection({
						fields: {
							latestLevel: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const latestLevel = pendingEntity.latestLevel}
					{#if latestLevel !== undefined && latestLevel !== null}
						<div>
							<dt>latest level</dt>
							<dd>
								{String((latestLevel) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const latestLevel = resolvedEntity.latestLevel}
					{#if latestLevel !== undefined && latestLevel !== null}
						<div>
							<dt>latest level</dt>
							<dd>
								{String((latestLevel) ?? '')}
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
				{#snippet Pending()}
					{@const protocolHash = pendingEntity.protocolHash}
					{#if protocolHash !== undefined && protocolHash !== null}
						<div>
							<dt>protocol hash</dt>
							<dd>
								<TruncatedValue value={String((protocolHash) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const protocolHash = resolvedEntity.protocolHash}
					{#if protocolHash !== undefined && protocolHash !== null}
						<div>
							<dt>protocol hash</dt>
							<dd>
								<TruncatedValue value={String((protocolHash) ?? '')} />
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
				{#snippet Pending()}
					{@const cycle = pendingEntity.cycle}
					{#if cycle !== undefined && cycle !== null}
						<div>
							<dt>cycle</dt>
							<dd>
								{String((cycle) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const cycle = resolvedEntity.cycle}
					{#if cycle !== undefined && cycle !== null}
						<div>
							<dt>cycle</dt>
							<dd>
								{String((cycle) ?? '')}
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
				{#snippet Pending()}
					{@const totalSupplyMutez = pendingEntity.totalSupplyMutez}
					{#if totalSupplyMutez !== undefined && totalSupplyMutez !== null}
						<div>
							<dt>total supply mutez</dt>
							<dd>
								{String((totalSupplyMutez) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const totalSupplyMutez = resolvedEntity.totalSupplyMutez}
					{#if totalSupplyMutez !== undefined && totalSupplyMutez !== null}
						<div>
							<dt>total supply mutez</dt>
							<dd>
								{String((totalSupplyMutez) ?? '')}
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
				{#snippet Pending()}
					{@const activeBakerCount = pendingEntity.activeBakerCount}
					{#if activeBakerCount !== undefined && activeBakerCount !== null}
						<div>
							<dt>active baker count</dt>
							<dd>
								{String((activeBakerCount) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const activeBakerCount = resolvedEntity.activeBakerCount}
					{#if activeBakerCount !== undefined && activeBakerCount !== null}
						<div>
							<dt>active baker count</dt>
							<dd>
								{String((activeBakerCount) ?? '')}
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
				{#snippet Pending()}
					{@const indexerLagBlocks = pendingEntity.indexerLagBlocks}
					{#if indexerLagBlocks !== undefined && indexerLagBlocks !== null}
						<div>
							<dt>indexer lag blocks</dt>
							<dd>
								{String((indexerLagBlocks) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const indexerLagBlocks = resolvedEntity.indexerLagBlocks}
					{#if indexerLagBlocks !== undefined && indexerLagBlocks !== null}
						<div>
							<dt>indexer lag blocks</dt>
							<dd>
								{String((indexerLagBlocks) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
