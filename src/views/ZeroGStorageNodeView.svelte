<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { stringify } from 'devalue'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		prefetched = {},
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: EntitySelectionViewProps<EntityType.ZeroGStorageNode> = $props()

	const viewDomId = $derived('zero-gstorage-node-' + encodeURIComponent(stringify(selection.entitySelector)))


	// Components
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import EntitiesList from '$/components/EntitiesList.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
	import EvmAccountView from '$/views/EvmAccountView.svelte'
	import ZeroGStorageProofsView from '$/views/ZeroGStorageProofsView.svelte'
	import ZeroGStorageNode_TimestampsView from '$/views/ZeroGStorageNode_TimestampsView.svelte'
</script>


<EntityView
	entityType={EntityType.ZeroGStorageNode}
	entitySelector={selection.entitySelector}
	id={viewDomId}
	{layout}
	bind:open
	{...EntityViewProps}
>
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
				<dt>node ID</dt>
				<dd>
					{selection.entitySelector.nodeId}
				</dd>
			</div>

			<ResourceBoundary
				resource={selection.$operator}
			>
				{#snippet children(evmAccount)}
					{#if evmAccount != null}
						<div>
							<dt>operator</dt>
							<dd>
								<EvmAccountView
									selection={select(EntityType.EvmAccount, evmAccount[EntityMetaKey.Selector])}
									prefetched={evmAccount}
									layout={EntityLayout.Value}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							endpoint: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const endpoint = entity.endpoint}
					{#if endpoint != null}
						<div>
							<dt>endpoint</dt>
							<dd>
								{endpoint}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details()}
		<CollapsibleTabs
			id={viewDomId + '-carousel-zero-gstorage-node-activity'}
			sectionIdPrefix={viewDomId}
			sections={
				[
					{
						id: 'zero-gstorage-node-stored-chunks',
						label: 'Stored Chunks',
					},
					{
						id: 'zero-gstorage-node-proofs',
						label: 'Proofs',
					},
				]
			}
			data-card
			class='network-view-collapsible-activity'
		>
			{#snippet Summary()}
				<header data-row-item="flexible" data-row="wrap gap-4">
					<HeadingComponent>Activity</HeadingComponent>
				</header>
			{/snippet}

			{#snippet SectionZeroGstorageNodeStoredChunks({ id, label })}
				<EntitiesList
					entityType={EntityType.ZeroGDataChunk}
					collapsible={false}
					title={label}
					emptyText='No stored chunks.'
					open={true}
					id={`${id}-list`}
					resource={selection.$$storedChunks()}
				>
					{#snippet Item({ item: zeroGDataChunk })}
						<EntityView
							entityType={EntityType.ZeroGDataChunk}
							entitySelector={zeroGDataChunk[EntityMetaKey.Selector]}
						/>
					{/snippet}
				</EntitiesList>
			{/snippet}

			{#snippet SectionZeroGstorageNodeProofs({ id, label })}
				<ZeroGStorageProofsView
					selection={selection.$$proofs}
					collapsible={false}
					title={label}
					emptyText='No proofs.'
					id={`${id}-list`}
				/>
			{/snippet}

		</CollapsibleTabs>

		<CollapsibleTabs
			id={viewDomId + '-carousel-zero-gstorage-node-observations'}
			sectionIdPrefix={viewDomId}
			sections={
				[
					{
						id: 'zero-gstorage-node-timestamps',
						label: 'Timestamps',
					},
				]
			}
			data-card
			class='network-view-collapsible-observations'
		>
			{#snippet Summary()}
				<header data-row-item="flexible" data-row="wrap gap-4">
					<HeadingComponent>Observations</HeadingComponent>
				</header>
			{/snippet}

			{#snippet SectionZeroGstorageNodeTimestamps({ id, label })}
				<ZeroGStorageNode_TimestampsView
					selection={selection.$$timestamps}
					collapsible={false}
					title={label}
					emptyText='No timestamps.'
					id={`${id}-list`}
				/>
			{/snippet}

		</CollapsibleTabs>
	{/snippet}
</EntityView>
