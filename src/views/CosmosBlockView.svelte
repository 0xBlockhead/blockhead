<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'


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
	}: EntitySelectionViewProps<EntityType.CosmosBlock> = $props()

	const pendingEntity = $derived({ ...selection.entitySelector, ...prefetched })
	const cosmosBlock = $derived(selection({
		fields: {
			height: true,
			hash: true,
			transactionCount: true,
		},
	}))
	const titleFallback = $derived((String(pendingEntity.height ?? '') ? 'Block #' + String(pendingEntity.height ?? '') : '') || (pendingEntity.hash ?? '') || 'Cosmos block')


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
</script>


<EntityView
	entityType={EntityType.CosmosBlock}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	idDragPlainText={String(pendingEntity.height ?? '')}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<span data-row="inline align-center gap-2 wrap">
			<span>Block </span>
			<span data-badge="small">
				#{String(pendingEntity.height)}
			</span>
		</span>
	{/snippet}

	{#snippet Value()}
		<span data-badge="small">
			#{String(pendingEntity.height)}
		</span>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={cosmosBlock}>
			{#snippet children(entity)}
				{@const transactionCount0 = entity.transactionCount}
				{#if transactionCount0 != null}
					<span data-text="muted">
						{String(transactionCount0)}
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Height</dt>
				<dd>
					<ResourceBoundary
						resource={cosmosBlock}
					>
						{#snippet children(entity)}
							{String(entity.height)}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Hash</dt>
				<dd>
					<ResourceBoundary
						resource={cosmosBlock}
					>
						{#snippet children(entity)}
							<TruncatedValue value={entity.hash} />
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							proposerConsensusAddress: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const proposerConsensusAddress = entity.proposerConsensusAddress}
					{#if proposerConsensusAddress != null}
						<div>
							<dt>Proposer consensus address</dt>
							<dd>
								<TruncatedValue value={proposerConsensusAddress} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							timestampMs: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const timestampMs = entity.timestampMs}
					{#if timestampMs != null}
						<div>
							<dt>Timestamp</dt>
							<dd>
								<Timestamp timestamp={Number(timestampMs)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={cosmosBlock}
			>
				{#snippet children(entity)}
					{@const transactionCount = entity.transactionCount}
					{#if transactionCount != null}
						<div>
							<dt>Transaction count</dt>
							<dd>
								{String(transactionCount)}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<div>
				<dt>Network</dt>
				<dd>
					<NetworkView
						selection={select(EntityType.Network, selection.entitySelector.$network)}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>
		</dl>
	{/snippet}
</EntityView>
