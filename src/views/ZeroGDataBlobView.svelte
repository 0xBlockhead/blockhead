<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2StringFromValue } from '$/lib/caip2.ts'
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
	}: Omit<EntitySelectionViewProps<EntityType.ZeroGDataBlob>, 'prefetched'> = $props()

	const network = $derived(selection.entitySelector.$network)
	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.ZeroGStorageScan_Rest,
			Source.ZeroGStorageNode_JsonRpc,
		],
	}))
	const zeroGDataBlob = $derived(viewSelection({
		fields: {
			sizeBytes: true,
		},
	}))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import ZeroGDataChunksView from '$/views/ZeroGDataChunksView.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
	import ZeroGConsensusNetworkView from '$/views/ZeroGConsensusNetworkView.svelte'
	import ZeroGDaQuorumView from '$/views/ZeroGDaQuorumView.svelte'
	import ZeroGStorageLogEntryView from '$/views/ZeroGStorageLogEntryView.svelte'
</script>


<EntityView
	entityType={EntityType.ZeroGDataBlob}
	entitySelector={selection.entitySelector}
	title={title ?? (selection.entitySelector.dataRoot || 'zero g data blob')}
	href={
		href === undefined ?
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/data-blob/[dataRoot=stringSegment]',
				{
					network: (
						'caip2' in network ?
							caip2StringFromValue(network.caip2)
						:
							network.slug
					),
					dataRoot: selection.entitySelector.dataRoot,
				}
			)
		:
			href ?? undefined
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Value()}
		<NetworkView
			selection={select(EntityType.Network, selection.entitySelector.$network)}
			href={null}
			layout={EntityLayout.Value}
		/>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={zeroGDataBlob}>
			{#snippet children(entity)}
				{@const sizeBytes = entity.sizeBytes}
				{#if sizeBytes != null}
					<span data-text="muted">
						<NumberValue
							value={sizeBytes}
						/>
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>network</dt>
				<dd>
					<NetworkView
						selection={select(EntityType.Network, selection.entitySelector.$network)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<div>
				<dt>data root</dt>
				<dd>
					{selection.entitySelector.dataRoot}
				</dd>
			</div>

			<ResourceBoundary
				resource={zeroGDataBlob}
			>
				{#snippet children(entity)}
					{@const sizeBytes = entity.sizeBytes}
					{#if sizeBytes != null}
						<div>
							<dt>size bytes</dt>
							<dd>
								<NumberValue
									value={sizeBytes}
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
							erasureCodingScheme: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const erasureCodingScheme = entity.erasureCodingScheme}
					{#if erasureCodingScheme != null}
						<div>
							<dt>erasure coding scheme</dt>
							<dd>
								{erasureCodingScheme}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							aggregatedSignature: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const aggregatedSignature = entity.aggregatedSignature}
					{#if aggregatedSignature != null}
						<div>
							<dt>aggregated signature</dt>
							<dd>
								<TruncatedValue value={aggregatedSignature} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={selection.$consensusNetwork}
			>
				{#snippet children(zeroGConsensusNetwork)}
					{#if zeroGConsensusNetwork != null}
						<div>
							<dt>consensus network</dt>
							<dd>
								<ZeroGConsensusNetworkView
									selection={select(EntityType.ZeroGConsensusNetwork, zeroGConsensusNetwork[EntityMetaKey.Selector])}
									layout={EntityLayout.Value}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$daQuorum}
			>
				{#snippet children(zeroGDaQuorum)}
					{#if zeroGDaQuorum != null}
						<div>
							<dt>DA quorum</dt>
							<dd>
								<ZeroGDaQuorumView
									selection={select(EntityType.ZeroGDaQuorum, zeroGDaQuorum[EntityMetaKey.Selector])}
									layout={EntityLayout.Value}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$storageLogEntry}
			>
				{#snippet children(zeroGStorageLogEntry)}
					{#if zeroGStorageLogEntry != null}
						<div>
							<dt>storage log entry</dt>
							<dd>
								<ZeroGStorageLogEntryView
									selection={select(EntityType.ZeroGStorageLogEntry, zeroGStorageLogEntry[EntityMetaKey.Selector])}
									layout={EntityLayout.Value}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details()}
		{@const chunksResource = selection.$$chunks}
		<ResourceBoundary
			resource={chunksResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<ZeroGDataChunksView
						selection={chunksResource}
						countResource={chunksResource.count}
						title='chunks'
						id='chunks'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
