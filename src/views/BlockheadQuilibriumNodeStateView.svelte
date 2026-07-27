<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'
	import { stringify } from 'devalue'
	import { UrlString } from '$/schema/UrlString.ts'
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
	}: EntitySelectionViewProps<EntityType.BlockheadQuilibriumNodeState> = $props()

	const pendingEntity = $derived({ ...selection.entitySelector, ...prefetched })
	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.Local_Internal,
			Source.QuilibriumNodeMetrics_Prometheus,
			Source.QuilibriumNode_Grpc,
		],
	}))
	const blockheadQuilibriumNodeState = $derived(viewSelection({
		fields: {
			endpoint: true,
		},
	}))
	const titleFallback = $derived((pendingEntity.connectionId ?? '') || 'blockhead quilibrium node state')
	const viewDomId = $derived('blockhead-quilibrium-node-state-' + encodeURIComponent(stringify(selection.entitySelector)))


	// Components
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
	import QuilibriumFramesView from '$/views/QuilibriumFramesView.svelte'
	import QuilibriumProversView from '$/views/QuilibriumProversView.svelte'
	import BlockheadQuilibriumNodeState_TimestampsView from '$/views/BlockheadQuilibriumNodeState_TimestampsView.svelte'
</script>


<EntityView
	entityType={EntityType.BlockheadQuilibriumNodeState}
	entitySelector={selection.entitySelector}
	id={viewDomId}
	title={title ?? titleFallback}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{(pendingEntity.connectionId ?? '') || 'blockhead quilibrium node state'}
	{/snippet}

	{#snippet Value()}
		<NetworkView
			selection={select(EntityType.Network, selection.entitySelector.$network)}
			href=""
			layout={EntityLayout.Value}
			open={false}
		/>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={blockheadQuilibriumNodeState}>
			{#snippet children(entity)}
				{@const endpoint0 = entity.endpoint}
				{#if endpoint0 != null}
					<span data-text="muted">
						<a
							href={String(endpoint0)}
							target="_blank"
							rel="noreferrer noopener"
						>
							<TruncatedValue value={String(endpoint0)} />
						</a>
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>connection ID</dt>
				<dd>
					{pendingEntity.connectionId}
				</dd>
			</div>

			<div>
				<dt>network</dt>
				<dd>
					<NetworkView
						selection={select(EntityType.Network, selection.entitySelector.$network)}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<ResourceBoundary
				resource={blockheadQuilibriumNodeState}
			>
				{#snippet children(entity)}
					{@const endpoint = entity.endpoint}
					{#if endpoint != null}
						<div>
							<dt>endpoint</dt>
							<dd>
								<a
									href={String(endpoint)}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={String(endpoint)} />
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
							grpcPort: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const grpcPort = entity.grpcPort}
					{#if grpcPort != null}
						<div>
							<dt>grpc port</dt>
							<dd>
								<NumberValue
									value={grpcPort}
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
							restPort: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const restPort = entity.restPort}
					{#if restPort != null}
						<div>
							<dt>REST port</dt>
							<dd>
								<NumberValue
									value={restPort}
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
							peerId: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const peerId = entity.peerId}
					{#if peerId != null}
						<div>
							<dt>peer ID</dt>
							<dd>
								{peerId}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		<CollapsibleTabs
			id={viewDomId + '-carousel-quilibrium-node-network'}
			sectionIdPrefix={viewDomId}
			sections={
				[
					{
						id: 'quilibrium-frames',
						label: 'Frames',
					},
					{
						id: 'quilibrium-provers',
						label: 'Provers',
					},
				]
			}
			data-card
			class='network-view-collapsible-network'
		>
			{#snippet Summary()}
				<header data-row-item="flexible" data-row="wrap gap-4">
					<HeadingComponent>Network</HeadingComponent>
				</header>
			{/snippet}

			{#snippet SectionQuilibriumFrames({ id, label, open })}
				<QuilibriumFramesView
					selection={selection.$$frames}
					CollapsibleProps={{ canToggle: false }}
					collapsible={false}
					data-column-item="flexible"
					data-card
					data-scroll-container
					open={open}
					title={label}
					emptyText='No Quilibrium frames.'
					id={`${id}-list`}
				/>
			{/snippet}

			{#snippet SectionQuilibriumProvers({ id, label, open })}
				<QuilibriumProversView
					selection={selection.$$provers}
					CollapsibleProps={{ canToggle: false }}
					collapsible={false}
					data-column-item="flexible"
					data-card
					data-scroll-container
					open={open}
					title={label}
					emptyText='No Quilibrium provers.'
					id={`${id}-list`}
				/>
			{/snippet}

		</CollapsibleTabs>

		<CollapsibleTabs
			id={viewDomId + '-carousel-quilibrium-node-observations'}
			sectionIdPrefix={viewDomId}
			sections={
				[
					{
						id: 'quilibrium-node-timestamps',
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

			{#snippet SectionQuilibriumNodeTimestamps({ id, label, open })}
				<BlockheadQuilibriumNodeState_TimestampsView
					selection={selection.$$timestamps}
					CollapsibleProps={{ canToggle: false }}
					collapsible={false}
					data-column-item="flexible"
					data-card
					data-scroll-container
					open={open}
					title={label}
					emptyText='No Quilibrium node observations.'
					id={`${id}-list`}
				/>
			{/snippet}

		</CollapsibleTabs>
	{/snippet}
</EntityView>
