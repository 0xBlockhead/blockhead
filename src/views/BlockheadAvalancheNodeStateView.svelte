<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { ZeroExHex } from '$/schema/ZeroExHex.ts'
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
	}: EntitySelectionViewProps<EntityType.BlockheadAvalancheNodeState> = $props()

	const pendingEntity = $derived({ ...selection.entitySelector, ...prefetched })
	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.Local_Internal,
		],
	}))
	const blockheadAvalancheNodeState = $derived(viewSelection({
		fields: {
			nodeIp: true,
		},
	}))
	const titleFallback = $derived((pendingEntity.nodeId ?? '') || 'blockhead avalanche node state')


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import BlockheadAvalancheNodeState_TimestampsView from '$/views/BlockheadAvalancheNodeState_TimestampsView.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
</script>


<EntityView
	entityType={EntityType.BlockheadAvalancheNodeState}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{(pendingEntity.nodeId ?? '') || 'blockhead avalanche node state'}
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary
			resource={selection.$network}
		>
			{#snippet children(network)}
				{#if network != null}
					<NetworkView
						selection={select(EntityType.Network, network[EntityMetaKey.Selector])}
						prefetched={network}
						href=""
						layout={EntityLayout.Value}
						open={false}
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={blockheadAvalancheNodeState}>
			{#snippet children(entity)}
				{@const nodeIp0 = entity.nodeIp}
				{#if nodeIp0 != null}
					<span data-text="muted">
						{nodeIp0}
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>node ID</dt>
				<dd>
					{pendingEntity.nodeId}
				</dd>
			</div>

			<ResourceBoundary
				resource={selection.$network}
			>
				{#snippet children(network)}
					{#if network != null}
						<div>
							<dt>network</dt>
							<dd>
								<NetworkView
									selection={select(EntityType.Network, network[EntityMetaKey.Selector])}
									prefetched={network}
									layout={EntityLayout.Value}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={blockheadAvalancheNodeState}
			>
				{#snippet children(entity)}
					{@const nodeIp = entity.nodeIp}
					{#if nodeIp != null}
						<div>
							<dt>node IP</dt>
							<dd>
								{nodeIp}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							nodePopPublicKey: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const nodePopPublicKey = entity.nodePopPublicKey}
					{#if nodePopPublicKey != null}
						<div>
							<dt>node PoP public key</dt>
							<dd>
								{String(nodePopPublicKey)}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							nodePopProofOfPossession: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const nodePopProofOfPossession = entity.nodePopProofOfPossession}
					{#if nodePopProofOfPossession != null}
						<div>
							<dt>node PoP proof of possession</dt>
							<dd>
								{String(nodePopProofOfPossession)}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{@const blockheadAvalancheNodeStateBlockheadAvalancheNodeStateTimestampsViewTimestampsResource = selection.$$timestamps}
		<ResourceBoundary
			resource={blockheadAvalancheNodeStateBlockheadAvalancheNodeStateTimestampsViewTimestampsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<BlockheadAvalancheNodeState_TimestampsView
						selection={blockheadAvalancheNodeStateBlockheadAvalancheNodeStateTimestampsViewTimestampsResource}
						countResource={blockheadAvalancheNodeStateBlockheadAvalancheNodeStateTimestampsViewTimestampsResource.count}
						title='timestamps'
						id='timestamps'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
