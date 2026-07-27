<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


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
	}: EntitySelectionViewProps<EntityType.KaspaNetwork_Timestamp> = $props()

	const pendingEntity = $derived({ ...selection.entitySelector, ...prefetched })
	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.KaspaExplorer_Rest,
			Source.KaspaNode_Grpc,
			Source.KaspaNode_Rest,
			Source.KaspaNode_Wrpc,
		],
	}))
	const titleFallback = 'kaspa network timestamp'


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import KaspaNetworkView from '$/views/KaspaNetworkView.svelte'
</script>


<EntityView
	entityType={EntityType.KaspaNetwork_Timestamp}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		kaspa network timestamp
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>network</dt>
				<dd>
					<KaspaNetworkView
						selection={select(EntityType.KaspaNetwork, selection.entitySelector.$network)}
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
					viewSelection({
						fields: {
							virtualDaaScore: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const virtualDaaScore = entity.virtualDaaScore}
					{#if virtualDaaScore != null}
						<div>
							<dt>virtual daa score</dt>
							<dd>
								<NumberValue
									value={virtualDaaScore}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							virtualBlueScore: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const virtualBlueScore = entity.virtualBlueScore}
					{#if virtualBlueScore != null}
						<div>
							<dt>virtual blue score</dt>
							<dd>
								<NumberValue
									value={virtualBlueScore}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							virtualSelectedParentHash: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const virtualSelectedParentHash = entity.virtualSelectedParentHash}
					{#if virtualSelectedParentHash != null}
						<div>
							<dt>virtual selected parent hash</dt>
							<dd>
								<TruncatedValue value={virtualSelectedParentHash} />
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
							pruningPointHash: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const pruningPointHash = entity.pruningPointHash}
					{#if pruningPointHash != null}
						<div>
							<dt>pruning point hash</dt>
							<dd>
								<TruncatedValue value={pruningPointHash} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							sinkCount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const sinkCount = entity.sinkCount}
					{#if sinkCount != null}
						<div>
							<dt>sink count</dt>
							<dd>
								<NumberValue
									value={sinkCount}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							blockCount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const blockCount = entity.blockCount}
					{#if blockCount != null}
						<div>
							<dt>block count</dt>
							<dd>
								<NumberValue
									value={blockCount}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							transactionCount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const transactionCount = entity.transactionCount}
					{#if transactionCount != null}
						<div>
							<dt>transaction count</dt>
							<dd>
								<NumberValue
									value={transactionCount}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							difficulty: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const difficulty = entity.difficulty}
					{#if difficulty != null}
						<div>
							<dt>difficulty</dt>
							<dd>
								<NumberValue
									value={difficulty}
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
							hasUtxoIndex: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const hasUtxoIndex = entity.hasUtxoIndex}
					{#if hasUtxoIndex != null}
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
					viewSelection({
						fields: {
							serverVersion: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const serverVersion = entity.serverVersion}
					{#if serverVersion != null}
						<div>
							<dt>server version</dt>
							<dd>
								{serverVersion}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
