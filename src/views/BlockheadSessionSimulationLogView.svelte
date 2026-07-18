<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { RegisteredEntityProxyData, RegisteredEntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { EvmAddress, ZeroExHex } from '$/schema/ZeroExHex.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		prefetched = {},
		title,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyResource<EntityType.BlockheadSessionSimulationLog>
			prefetched?: Partial<RegisteredEntityProxyData<EntityType.BlockheadSessionSimulationLog>>
			title?: string
			href?: string
			layout?: EntityLayout
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'collapsible'
			| 'showTypeAnnotation'
		>
	> = $props()

	const pendingEntity = $derived(({ ...prefetched[EntityMetaKey.Selector], ...selection.entitySelector, ...prefetched }))
	const blockheadSessionSimulationLog = $derived(selection({
		sources: selection.sources,
		fields: {
			address: true,
			callPath: true,
		},
	}))
	const titleFallback = $derived([String((pendingEntity.logIndex) ?? '')].filter(Boolean).join(' ') || 'blockhead session simulation log')
	const viewDomId = $derived('blockhead-session-simulation-log-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import BlockheadSessionSimulationView from '$/views/BlockheadSessionSimulationView.svelte'
</script>


<EntityView
	entityType={EntityType.BlockheadSessionSimulationLog}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{#if prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails}
					{@const logIndex0 = pendingEntity.logIndex}
					{#if logIndex0 !== undefined && logIndex0 !== null}
						<NumberValue
							value={logIndex0}
						/>
					{/if}
		{:else}
			<ResourceBoundary resource={blockheadSessionSimulationLog}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const logIndex0 = resolvedEntity.logIndex}
					{#if logIndex0 !== undefined && logIndex0 !== null}
						<NumberValue
							value={logIndex0}
						/>
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Value()}
		{#if prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails}
			{[String((pendingEntity.address) ?? '')].filter(Boolean).join(' ') || [String((pendingEntity.logIndex) ?? '')].filter(Boolean).join(' ') || titleFallback}
		{:else}
			<ResourceBoundary resource={blockheadSessionSimulationLog}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{[String((resolvedEntity.address) ?? '')].filter(Boolean).join(' ') || [String((resolvedEntity.logIndex) ?? '')].filter(Boolean).join(' ') || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet HeadingAfter()}
		{#if prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails}
			{@const callPath0 = pendingEntity.callPath}
			{#if callPath0 !== undefined && callPath0 !== null}
				<span data-text="muted">
					{String((callPath0) ?? '')}
				</span>
			{/if}
		{:else}
			<ResourceBoundary resource={blockheadSessionSimulationLog}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const callPath0 = resolvedEntity.callPath}
					{#if callPath0 !== undefined && callPath0 !== null}
						<span data-text="muted">
							{String((callPath0) ?? '')}
						</span>
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>simulation</dt>
				<dd>
					<ResourceBoundary
						resource={selection.$simulation}
					>
						{#snippet children(blockheadSessionSimulation)}
							{#if blockheadSessionSimulation != null && blockheadSessionSimulation[EntityMetaKey.Selector] != null}
								<BlockheadSessionSimulationView
									selection={select(EntityType.BlockheadSessionSimulation, blockheadSessionSimulation[EntityMetaKey.Selector])}
									prefetched={blockheadSessionSimulation}
									layout={EntityLayout.Value}
									open={false}
								/>
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>log index</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									logIndex: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const logIndex = resolvedEntity.logIndex}
							{#if logIndex !== undefined && logIndex !== null}
								<NumberValue
									value={logIndex}
								/>
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						sources: selection.sources,
						fields: {
							callPath: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const callPath = resolvedEntity.callPath}
					{#if callPath !== undefined && callPath !== null}
						<div>
							<dt>call path</dt>
							<dd>
								{String((callPath) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						sources: selection.sources,
						fields: {
							address: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const address = resolvedEntity.address}
					{#if address !== undefined && address !== null}
						<div>
							<dt>Address</dt>
							<dd>
								<TruncatedValue value={String((address) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						sources: selection.sources,
						fields: {
							topic0: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const topic0 = resolvedEntity.topic0}
					{#if topic0 !== undefined && topic0 !== null}
						<div>
							<dt>topic0</dt>
							<dd>
								{String((topic0) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<div>
				<dt>topics</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									topics: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const topics = resolvedEntity.topics}
							{#if topics !== undefined && topics !== null}
								{topics.values.map((value) => String(value ?? '')).filter(Boolean).join(', ')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						sources: selection.sources,
						fields: {
							dataHash: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const dataHash = resolvedEntity.dataHash}
					{#if dataHash !== undefined && dataHash !== null}
						<div>
							<dt>data hash</dt>
							<dd>
								<TruncatedValue value={String((dataHash) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						sources: selection.sources,
						fields: {
							decodedEventName: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const decodedEventName = resolvedEntity.decodedEventName}
					{#if decodedEventName !== undefined && decodedEventName !== null}
						<div>
							<dt>decoded event name</dt>
							<dd>
								{String((decodedEventName) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						sources: selection.sources,
						fields: {
							removed: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const removed = resolvedEntity.removed}
					{#if removed !== undefined && removed !== null}
						<div>
							<dt>removed</dt>
							<dd>
								{removed ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
