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
	}: EntitySelectionViewProps<EntityType.KaspaVirtualChain_Timestamp> = $props()

	const pendingEntity = $derived({ ...selection.entitySelector, ...prefetched })
	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.KaspaNode_Grpc,
			Source.KaspaNode_Wrpc,
		],
	}))
	const titleFallback = 'kaspa virtual chain timestamp'


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import KaspaNetworkView from '$/views/KaspaNetworkView.svelte'
</script>


<EntityView
	entityType={EntityType.KaspaVirtualChain_Timestamp}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		kaspa virtual chain timestamp
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
				<dt>start hash</dt>
				<dd>
					<TruncatedValue value={pendingEntity.startHash} />
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
							minConfirmationCount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const minConfirmationCount = entity.minConfirmationCount}
					{#if minConfirmationCount != null}
						<div>
							<dt>min confirmation count</dt>
							<dd>
								<NumberValue
									value={minConfirmationCount}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<div>
				<dt>added chain block hashes</dt>
				<dd>
					<ResourceBoundary
						resource={
							viewSelection({
								fields: {
									addedChainBlockHashes: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							<TruncatedValue value={entity.addedChainBlockHashes.values.join(', ')} />
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<div>
				<dt>removed chain block hashes</dt>
				<dd>
					<ResourceBoundary
						resource={
							viewSelection({
								fields: {
									removedChainBlockHashes: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							<TruncatedValue value={entity.removedChainBlockHashes.values.join(', ')} />
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							acceptedTransactionCount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const acceptedTransactionCount = entity.acceptedTransactionCount}
					{#if acceptedTransactionCount != null}
						<div>
							<dt>accepted transaction count</dt>
							<dd>
								<NumberValue
									value={acceptedTransactionCount}
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
							nextCheckpointHash: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const nextCheckpointHash = entity.nextCheckpointHash}
					{#if nextCheckpointHash != null}
						<div>
							<dt>next checkpoint hash</dt>
							<dd>
								<TruncatedValue value={nextCheckpointHash} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
