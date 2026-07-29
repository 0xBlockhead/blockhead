<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
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
	}: EntitySelectionViewProps<EntityType.BlockheadSessionSimulation> = $props()

	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.Local_Internal,
		],
	}))
	const blockheadSessionSimulation = $derived(viewSelection({
		fields: {
			status: true,
			createdAt: true,
			paramsHash: true,
		},
	}))
	const titleFallback = $derived((prefetched.status ?? '') || 'blockhead session simulation')


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import BlockheadSessionSimulationCallsView from '$/views/BlockheadSessionSimulationCallsView.svelte'
	import BlockheadSessionSimulationLogsView from '$/views/BlockheadSessionSimulationLogsView.svelte'
	import BlockheadSessionView from '$/views/BlockheadSessionView.svelte'
</script>


<EntityView
	entityType={EntityType.BlockheadSessionSimulation}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={blockheadSessionSimulation}>
			{#snippet children(entity)}
				{entity.status || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={blockheadSessionSimulation}>
			{#snippet children(entity)}
				<Timestamp timestamp={entity.createdAt} />
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary
			resource={selection.$session}
		>
			{#snippet children(blockheadSession)}
				<span data-text="muted">
					<BlockheadSessionView
						selection={select(EntityType.BlockheadSession, blockheadSession[EntityMetaKey.Selector])}
						prefetched={blockheadSession}
						layout={EntityLayout.Title}
						open={false}
					/>
				</span>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>session</dt>
				<dd>
					<ResourceBoundary
						resource={selection.$session}
					>
						{#snippet children(blockheadSession)}
							<BlockheadSessionView
								selection={select(EntityType.BlockheadSession, blockheadSession[EntityMetaKey.Selector])}
								prefetched={blockheadSession}
								layout={EntityLayout.Value}
								open={false}
							/>
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>status</dt>
				<dd>
					<ResourceBoundary
						resource={blockheadSessionSimulation}
					>
						{#snippet children(entity)}
							{entity.status}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Created</dt>
				<dd>
					<ResourceBoundary
						resource={blockheadSessionSimulation}
					>
						{#snippet children(entity)}
							<Timestamp timestamp={entity.createdAt} />
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							completedAt: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const completedAt = entity.completedAt}
					{#if completedAt != null}
						<div>
							<dt>completed AT</dt>
							<dd>
								<Timestamp timestamp={completedAt} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<div>
				<dt>params hash</dt>
				<dd>
					<ResourceBoundary
						resource={blockheadSessionSimulation}
					>
						{#snippet children(entity)}
							<TruncatedValue value={entity.paramsHash} />
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							forkBlockNumber: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const forkBlockNumber = entity.forkBlockNumber}
					{#if forkBlockNumber != null}
						<div>
							<dt>fork block number</dt>
							<dd>
								<NumberValue
									value={forkBlockNumber}
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
							actionCount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const actionCount = entity.actionCount}
					{#if actionCount != null}
						<div>
							<dt>action count</dt>
							<dd>
								<NumberValue
									value={actionCount}
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
							gasUsed: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const gasUsed = entity.gasUsed}
					{#if gasUsed != null}
						<div>
							<dt>gas used</dt>
							<dd>
								<NumberValue
									value={gasUsed}
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
							resultPayloadHash: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resultPayloadHash = entity.resultPayloadHash}
					{#if resultPayloadHash != null}
						<div>
							<dt>result payload hash</dt>
							<dd>
								<TruncatedValue value={resultPayloadHash} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							error: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const error = entity.error}
					{#if error != null}
						<div>
							<dt>error</dt>
							<dd>
								{error}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{@const callsResource = selection.$$calls}
		<ResourceBoundary
			resource={callsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<BlockheadSessionSimulationCallsView
						selection={callsResource}
						countResource={callsResource.count}
						title='calls'
						id='calls'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
		{@const logsResource = selection.$$logs}
		<ResourceBoundary
			resource={logsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<BlockheadSessionSimulationLogsView
						selection={logsResource}
						countResource={logsResource.count}
						title='logs'
						id='logs'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
