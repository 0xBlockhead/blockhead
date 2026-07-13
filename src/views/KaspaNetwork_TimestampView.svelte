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
			selection: EntityProxyResource<typeof schema, EntityType.KaspaNetwork_Timestamp>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.KaspaNetwork_Timestamp>>
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
	const kaspaNetworkTimestamp = $derived(selection({
		sources: [
			Source.KaspaExplorer_Rest,
			Source.KaspaNode_Grpc,
			Source.KaspaNode_Rest,
			Source.KaspaNode_Wrpc,
		],
	}))
	const titleFallback = $derived('kaspa network timestamp')
	const viewDomId = $derived('kaspa-network-timestamp-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import KaspaNetworkView from '$/views/KaspaNetworkView.svelte'
</script>


<EntityView
	entityType={EntityType.KaspaNetwork_Timestamp}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={kaspaNetworkTimestamp}>
			{#snippet Pending()}
				{title || 'kaspa network timestamp'}
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
					<KaspaNetworkView
						selection={select(EntityType.KaspaNetwork, selection.entitySelector.$network, {})}
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
							virtualDaaScore: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const virtualDaaScore = pendingEntity.virtualDaaScore}
					{#if virtualDaaScore !== undefined && virtualDaaScore !== null}
						<div>
							<dt>virtual daa score</dt>
							<dd>
								<NumberValue value={Number(virtualDaaScore)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const virtualDaaScore = resolvedEntity.virtualDaaScore}
					{#if virtualDaaScore !== undefined && virtualDaaScore !== null}
						<div>
							<dt>virtual daa score</dt>
							<dd>
								<NumberValue value={Number(virtualDaaScore)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							virtualBlueScore: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const virtualBlueScore = pendingEntity.virtualBlueScore}
					{#if virtualBlueScore !== undefined && virtualBlueScore !== null}
						<div>
							<dt>virtual blue score</dt>
							<dd>
								<NumberValue value={Number(virtualBlueScore)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const virtualBlueScore = resolvedEntity.virtualBlueScore}
					{#if virtualBlueScore !== undefined && virtualBlueScore !== null}
						<div>
							<dt>virtual blue score</dt>
							<dd>
								<NumberValue value={Number(virtualBlueScore)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							virtualSelectedParentHash: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const virtualSelectedParentHash = pendingEntity.virtualSelectedParentHash}
					{#if virtualSelectedParentHash !== undefined && virtualSelectedParentHash !== null}
						<div>
							<dt>virtual selected parent hash</dt>
							<dd>
								<TruncatedValue value={String((virtualSelectedParentHash) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const virtualSelectedParentHash = resolvedEntity.virtualSelectedParentHash}
					{#if virtualSelectedParentHash !== undefined && virtualSelectedParentHash !== null}
						<div>
							<dt>virtual selected parent hash</dt>
							<dd>
								<TruncatedValue value={String((virtualSelectedParentHash) ?? '')} />
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
							pruningPointHash: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const pruningPointHash = pendingEntity.pruningPointHash}
					{#if pruningPointHash !== undefined && pruningPointHash !== null}
						<div>
							<dt>pruning point hash</dt>
							<dd>
								<TruncatedValue value={String((pruningPointHash) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const pruningPointHash = resolvedEntity.pruningPointHash}
					{#if pruningPointHash !== undefined && pruningPointHash !== null}
						<div>
							<dt>pruning point hash</dt>
							<dd>
								<TruncatedValue value={String((pruningPointHash) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							sinkCount: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const sinkCount = pendingEntity.sinkCount}
					{#if sinkCount !== undefined && sinkCount !== null}
						<div>
							<dt>sink count</dt>
							<dd>
								<NumberValue value={Number(sinkCount)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const sinkCount = resolvedEntity.sinkCount}
					{#if sinkCount !== undefined && sinkCount !== null}
						<div>
							<dt>sink count</dt>
							<dd>
								<NumberValue value={Number(sinkCount)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							blockCount: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const blockCount = pendingEntity.blockCount}
					{#if blockCount !== undefined && blockCount !== null}
						<div>
							<dt>block count</dt>
							<dd>
								<NumberValue value={Number(blockCount)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const blockCount = resolvedEntity.blockCount}
					{#if blockCount !== undefined && blockCount !== null}
						<div>
							<dt>block count</dt>
							<dd>
								<NumberValue value={Number(blockCount)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							transactionCount: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const transactionCount = pendingEntity.transactionCount}
					{#if transactionCount !== undefined && transactionCount !== null}
						<div>
							<dt>transaction count</dt>
							<dd>
								<NumberValue value={Number(transactionCount)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const transactionCount = resolvedEntity.transactionCount}
					{#if transactionCount !== undefined && transactionCount !== null}
						<div>
							<dt>transaction count</dt>
							<dd>
								<NumberValue value={Number(transactionCount)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							difficulty: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const difficulty = pendingEntity.difficulty}
					{#if difficulty !== undefined && difficulty !== null}
						<div>
							<dt>difficulty</dt>
							<dd>
								<NumberValue value={Number(difficulty)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const difficulty = resolvedEntity.difficulty}
					{#if difficulty !== undefined && difficulty !== null}
						<div>
							<dt>difficulty</dt>
							<dd>
								<NumberValue value={Number(difficulty)} />
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
							hasUtxoIndex: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const hasUtxoIndex = pendingEntity.hasUtxoIndex}
					{#if hasUtxoIndex !== undefined && hasUtxoIndex !== null}
						<div>
							<dt>has UTXO index</dt>
							<dd>
								{hasUtxoIndex ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const hasUtxoIndex = resolvedEntity.hasUtxoIndex}
					{#if hasUtxoIndex !== undefined && hasUtxoIndex !== null}
						<div>
							<dt>has UTXO index</dt>
							<dd>
								{hasUtxoIndex ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							serverVersion: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const serverVersion = pendingEntity.serverVersion}
					{#if serverVersion !== undefined && serverVersion !== null}
						<div>
							<dt>server version</dt>
							<dd>
								{String((serverVersion) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const serverVersion = resolvedEntity.serverVersion}
					{#if serverVersion !== undefined && serverVersion !== null}
						<div>
							<dt>server version</dt>
							<dd>
								{String((serverVersion) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
