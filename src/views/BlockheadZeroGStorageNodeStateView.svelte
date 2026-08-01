<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'
	import { stringify } from 'devalue'
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
	}: EntitySelectionViewProps<EntityType.BlockheadZeroGStorageNodeState> = $props()

	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.Local_Internal,
			Source.ZeroGStorageNode_JsonRpc,
		],
	}))
	const viewDomId = $derived('blockhead-zero-gstorage-node-state-' + encodeURIComponent(stringify(selection.entitySelector)))


	// Components
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import ZeroGNetworkView from '$/views/ZeroGNetworkView.svelte'
	import BlockheadZeroGStoredChunksView from '$/views/BlockheadZeroGStoredChunksView.svelte'
	import BlockheadZeroGStorageProofsView from '$/views/BlockheadZeroGStorageProofsView.svelte'
	import BlockheadZeroGStorageNodeState_TimestampsView from '$/views/BlockheadZeroGStorageNodeState_TimestampsView.svelte'
</script>


<EntityView
	entityType={EntityType.BlockheadZeroGStorageNodeState}
	entitySelector={selection.entitySelector}
	id={viewDomId}
	title={title ?? (selection.entitySelector.nodeId || 'blockhead zero g storage node state')}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Value()}
		<ZeroGNetworkView
			selection={select(EntityType.ZeroGNetwork, selection.entitySelector.$network)}
			layout={EntityLayout.Value}
		/>
	{/snippet}

	{#snippet HeadingAfter()}
		<span data-text="muted">
			{selection.entitySelector.connectionId}
		</span>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>connection ID</dt>
				<dd>
					{selection.entitySelector.connectionId}
				</dd>
			</div>

			<div>
				<dt>network</dt>
				<dd>
					<ZeroGNetworkView
						selection={select(EntityType.ZeroGNetwork, selection.entitySelector.$network)}
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
				resource={
					viewSelection({
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
								<a
									href={endpoint}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={endpoint} />
								</a>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							storagePath: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const storagePath = entity.storagePath}
					{#if storagePath != null}
						<div>
							<dt>storage path</dt>
							<dd>
								{storagePath}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		<CollapsibleTabs
			id={viewDomId + '-carousel-zerog-storage-local'}
			sectionIdPrefix={viewDomId}
			sections={
				[
					{
						id: 'zerog-local-chunks',
						label: 'Local chunks',
					},
					{
						id: 'zerog-local-proofs',
						label: 'Local proofs',
					},
				]
			}
			data-card
			class='network-view-collapsible-local-storage'
		>
			{#snippet Summary()}
				<header data-row-item="flexible" data-row="wrap gap-4">
					<HeadingComponent>Local storage</HeadingComponent>
				</header>
			{/snippet}

			{#snippet SectionZerogLocalChunks({ id, label, open })}
				<BlockheadZeroGStoredChunksView
					selection={selection.$$localChunks}
					collapsible={false}
					title={label}
					emptyText='No local chunks.'
					id={`${id}-list`}
				/>
			{/snippet}

			{#snippet SectionZerogLocalProofs({ id, label, open })}
				<BlockheadZeroGStorageProofsView
					selection={selection.$$localProofs}
					collapsible={false}
					title={label}
					emptyText='No local proofs.'
					id={`${id}-list`}
				/>
			{/snippet}

		</CollapsibleTabs>

		<CollapsibleTabs
			id={viewDomId + '-carousel-zerog-storage-observations'}
			sectionIdPrefix={viewDomId}
			sections={
				[
					{
						id: 'zerog-storage-timestamps',
						label: 'Observations',
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

			{#snippet SectionZerogStorageTimestamps({ id, label, open })}
				<BlockheadZeroGStorageNodeState_TimestampsView
					selection={selection.$$timestamps}
					collapsible={false}
					title={label}
					emptyText='No 0G storage-node observations.'
					id={`${id}-list`}
				/>
			{/snippet}

		</CollapsibleTabs>
	{/snippet}
</EntityView>
