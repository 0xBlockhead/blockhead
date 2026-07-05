<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { EntityProxyField, type EntityProxyData, type EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { EvmAddress, ZeroExHex } from '$/schema/ZeroExHex.ts'
	import { Source } from '$/sources/Source.ts'


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
			selection: EntityProxyResource<typeof schema, EntityType.BlockheadSessionSimulationLog>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.BlockheadSessionSimulationLog>>
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
		sources: [
			Source.Local_Internal,
		],
		fields: {
			address: true,
			callPath: true,
		},
	}))
	const titleFallback = $derived([String((selection.entitySelector.logIndex ?? prefetched.logIndex) ?? '')].filter(Boolean).join(' ') || 'blockhead session simulation log')
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
		<ResourceBoundary resource={blockheadSessionSimulationLog}>
			{#snippet Pending()}
				{@const logIndex0 = selection.entitySelector.logIndex ?? prefetched.logIndex}
				{#if logIndex0 !== undefined && logIndex0 !== null}
					<NumberValue value={Number(logIndex0)} />
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const logIndex0 = resolvedEntity.logIndex}
				{#if logIndex0 !== undefined && logIndex0 !== null}
					<NumberValue value={Number(logIndex0)} />
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={blockheadSessionSimulationLog}>
			{#snippet Pending()}
				{[String((prefetched.address) ?? '')].filter(Boolean).join(' ') || [String((selection.entitySelector.logIndex ?? prefetched.logIndex) ?? '')].filter(Boolean).join(' ') || title || 'blockhead session simulation log'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.address) ?? '')].filter(Boolean).join(' ') || [String((resolvedEntity.logIndex) ?? '')].filter(Boolean).join(' ') || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={blockheadSessionSimulationLog}>
			{#snippet Pending()}
				{@const callPath0 = prefetched.callPath}
				{#if callPath0 !== undefined && callPath0 !== null}
					<span data-text="muted">
						{String((callPath0) ?? '')}
					</span>
				{/if}
			{/snippet}

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
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>simulation</dt>
				<dd>
					<ResourceBoundary
						resource={selection[EntityProxyField]<EntityType.BlockheadSessionSimulation, false>('$simulation')}
					>
						{#snippet children(blockheadSessionSimulation)}
							{#if blockheadSessionSimulation[EntityMetaKey.Selector] != null}
								<BlockheadSessionSimulationView
									selection={select(EntityType.BlockheadSessionSimulation, blockheadSessionSimulation[EntityMetaKey.Selector])}
									prefetched={blockheadSessionSimulation}
									layout={EntityLayout.Title}
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
								fields: {
									logIndex: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const logIndex = selection.entitySelector.logIndex ?? prefetched.logIndex}
							{#if logIndex !== undefined && logIndex !== null}
								<NumberValue value={Number(logIndex)} />
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const logIndex = resolvedEntity.logIndex}
							{#if logIndex !== undefined && logIndex !== null}
								<NumberValue value={Number(logIndex)} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							callPath: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const callPath = prefetched.callPath}
					{#if callPath !== undefined && callPath !== null}
						<div>
							<dt>call path</dt>
							<dd>
								{String((callPath) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

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
						fields: {
							address: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const address = prefetched.address}
					{#if address !== undefined && address !== null}
						<div>
							<dt>Address</dt>
							<dd>
								<TruncatedValue value={String((address) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}

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
						fields: {
							topic0: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const topic0 = prefetched.topic0}
					{#if topic0 !== undefined && topic0 !== null}
						<div>
							<dt>topic0</dt>
							<dd>
								{String((topic0) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

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
								fields: {
									topics: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const topics = prefetched.topics}
							{#if topics !== undefined && topics !== null}
								{(topics?.values ?? []).map((value) => String(value ?? '')).filter(Boolean).join(', ')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const topics = resolvedEntity.topics}
							{#if topics !== undefined && topics !== null}
								{(topics?.values ?? []).map((value) => String(value ?? '')).filter(Boolean).join(', ')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							dataHash: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const dataHash = prefetched.dataHash}
					{#if dataHash !== undefined && dataHash !== null}
						<div>
							<dt>data hash</dt>
							<dd>
								<TruncatedValue value={String((dataHash) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}

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
						fields: {
							decodedEventName: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const decodedEventName = prefetched.decodedEventName}
					{#if decodedEventName !== undefined && decodedEventName !== null}
						<div>
							<dt>decoded event name</dt>
							<dd>
								{String((decodedEventName) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

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
						fields: {
							removed: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const removed = prefetched.removed}
					{#if removed !== undefined && removed !== null}
						<div>
							<dt>removed</dt>
							<dd>
								{removed ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}

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
