<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'
	import { stringify } from 'devalue'
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
	}: Omit<EntitySelectionViewProps<EntityType.BlockheadQuilibriumNodeState>, 'prefetched'> = $props()

	const network = $derived(selection.entitySelector.$network)
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
	title={title ?? (selection.entitySelector.connectionId || 'blockhead quilibrium node state')}
	href={
		href === undefined ?
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/~/quilibrium/connection/[connectionId=stringSegment]/node-state',
				{
					network: (
						'caip2' in network ?
							caip2StringFromValue(network.caip2)
						:
							network.slug
					),
					connectionId: selection.entitySelector.connectionId,
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
		<ResourceBoundary resource={blockheadQuilibriumNodeState}>
			{#snippet children(entity)}
				{@const endpoint = entity.endpoint}
				{#if endpoint != null}
					<span data-text="muted">
						<a
							href={endpoint}
							target="_blank"
							rel="noreferrer noopener"
						>
							<TruncatedValue value={endpoint} />
						</a>
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content()}
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
					<NetworkView
						selection={select(EntityType.Network, selection.entitySelector.$network)}
						layout={EntityLayout.Value}
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

	{#snippet Details()}
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

			{#snippet SectionQuilibriumFrames({ id, label })}
				<QuilibriumFramesView
					selection={selection.$$frames}
					collapsible={false}
					title={label}
					emptyText='No Quilibrium frames.'
					id={`${id}-list`}
				/>
			{/snippet}

			{#snippet SectionQuilibriumProvers({ id, label })}
				<QuilibriumProversView
					selection={selection.$$provers}
					collapsible={false}
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

			{#snippet SectionQuilibriumNodeTimestamps({ id, label })}
				<BlockheadQuilibriumNodeState_TimestampsView
					selection={selection.$$timestamps}
					collapsible={false}
					title={label}
					emptyText='No Quilibrium node observations.'
					id={`${id}-list`}
				/>
			{/snippet}

		</CollapsibleTabs>
	{/snippet}
</EntityView>
