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
			selection: EntityProxyResource<typeof schema, EntityType.BlockheadSessionSimulationCall>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.BlockheadSessionSimulationCall>>
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
	const blockheadSessionSimulationCall = $derived(selection({
		sources: [
			Source.Local_Internal,
		],
		fields: {
			callType: true,
			depth: true,
		},
	}))
	const titleFallback = $derived([String((selection.entitySelector.callPath ?? prefetched.callPath) ?? '')].filter(Boolean).join(' ') || 'blockhead session simulation call')
	const viewDomId = $derived('blockhead-session-simulation-call-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import BlockheadSessionSimulationView from '$/views/BlockheadSessionSimulationView.svelte'
</script>


<EntityView
	entityType={EntityType.BlockheadSessionSimulationCall}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={blockheadSessionSimulationCall}>
			{#snippet Pending()}
				{[String((selection.entitySelector.callPath ?? prefetched.callPath) ?? '')].filter(Boolean).join(' ') || title || 'blockhead session simulation call'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.callPath) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={blockheadSessionSimulationCall}>
			{#snippet Pending()}
				{[String((prefetched.callType) ?? '')].filter(Boolean).join(' ') || [String((selection.entitySelector.callPath ?? prefetched.callPath) ?? '')].filter(Boolean).join(' ') || title || 'blockhead session simulation call'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.callType) ?? '')].filter(Boolean).join(' ') || [String((resolvedEntity.callPath) ?? '')].filter(Boolean).join(' ') || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={blockheadSessionSimulationCall}>
			{#snippet Pending()}
				{@const depth0 = prefetched.depth}
				{#if depth0 !== undefined && depth0 !== null}
					<span data-text="muted">
						<NumberValue value={Number(depth0)} />
					</span>
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const depth0 = resolvedEntity.depth}
				{#if depth0 !== undefined && depth0 !== null}
					<span data-text="muted">
						<NumberValue value={Number(depth0)} />
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
									layout={EntityLayout.Value}
									open={false}
								/>
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>call path</dt>
				<dd>
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
							{@const callPath = selection.entitySelector.callPath ?? prefetched.callPath}
							{#if callPath !== undefined && callPath !== null}
								{String((callPath) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const callPath = resolvedEntity.callPath}
							{#if callPath !== undefined && callPath !== null}
								{String((callPath) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							parentCallPath: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const parentCallPath = prefetched.parentCallPath}
					{#if parentCallPath !== undefined && parentCallPath !== null}
						<div>
							<dt>parent call path</dt>
							<dd>
								{String((parentCallPath) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const parentCallPath = resolvedEntity.parentCallPath}
					{#if parentCallPath !== undefined && parentCallPath !== null}
						<div>
							<dt>parent call path</dt>
							<dd>
								{String((parentCallPath) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<div>
				<dt>depth</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									depth: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const depth = prefetched.depth}
							{#if depth !== undefined && depth !== null}
								<NumberValue value={Number(depth)} />
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const depth = resolvedEntity.depth}
							{#if depth !== undefined && depth !== null}
								<NumberValue value={Number(depth)} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>call index</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									callIndex: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const callIndex = prefetched.callIndex}
							{#if callIndex !== undefined && callIndex !== null}
								<NumberValue value={Number(callIndex)} />
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const callIndex = resolvedEntity.callIndex}
							{#if callIndex !== undefined && callIndex !== null}
								<NumberValue value={Number(callIndex)} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					selection({
						fields: {
							callType: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const callType = prefetched.callType}
					{#if callType !== undefined && callType !== null}
						<div>
							<dt>call type</dt>
							<dd>
								{String((callType) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const callType = resolvedEntity.callType}
					{#if callType !== undefined && callType !== null}
						<div>
							<dt>call type</dt>
							<dd>
								{String((callType) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							fromAddress: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const fromAddress = prefetched.fromAddress}
					{#if fromAddress !== undefined && fromAddress !== null}
						<div>
							<dt>from address</dt>
							<dd>
								<TruncatedValue value={String((fromAddress) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const fromAddress = resolvedEntity.fromAddress}
					{#if fromAddress !== undefined && fromAddress !== null}
						<div>
							<dt>from address</dt>
							<dd>
								<TruncatedValue value={String((fromAddress) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							toAddress: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const toAddress = prefetched.toAddress}
					{#if toAddress !== undefined && toAddress !== null}
						<div>
							<dt>to address</dt>
							<dd>
								<TruncatedValue value={String((toAddress) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const toAddress = resolvedEntity.toAddress}
					{#if toAddress !== undefined && toAddress !== null}
						<div>
							<dt>to address</dt>
							<dd>
								<TruncatedValue value={String((toAddress) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							value: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const value = prefetched.value}
					{#if value !== undefined && value !== null}
						<div>
							<dt>Value</dt>
							<dd>
								<NumberValue value={Number(value)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const value = resolvedEntity.value}
					{#if value !== undefined && value !== null}
						<div>
							<dt>Value</dt>
							<dd>
								<NumberValue value={Number(value)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							gasUsed: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const gasUsed = prefetched.gasUsed}
					{#if gasUsed !== undefined && gasUsed !== null}
						<div>
							<dt>gas used</dt>
							<dd>
								<NumberValue value={Number(gasUsed)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const gasUsed = resolvedEntity.gasUsed}
					{#if gasUsed !== undefined && gasUsed !== null}
						<div>
							<dt>gas used</dt>
							<dd>
								<NumberValue value={Number(gasUsed)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							reverted: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const reverted = prefetched.reverted}
					{#if reverted !== undefined && reverted !== null}
						<div>
							<dt>reverted</dt>
							<dd>
								{reverted ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const reverted = resolvedEntity.reverted}
					{#if reverted !== undefined && reverted !== null}
						<div>
							<dt>reverted</dt>
							<dd>
								{reverted ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							error: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const error = prefetched.error}
					{#if error !== undefined && error !== null}
						<div>
							<dt>error</dt>
							<dd>
								{String((error) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const error = resolvedEntity.error}
					{#if error !== undefined && error !== null}
						<div>
							<dt>error</dt>
							<dd>
								{String((error) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					selection({
						fields: {
							inputSelector: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const inputSelector = prefetched.inputSelector}
					{#if inputSelector !== undefined && inputSelector !== null}
						<div>
							<dt>input selector</dt>
							<dd>
								{String((inputSelector) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const inputSelector = resolvedEntity.inputSelector}
					{#if inputSelector !== undefined && inputSelector !== null}
						<div>
							<dt>input selector</dt>
							<dd>
								{String((inputSelector) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							inputDataHash: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const inputDataHash = prefetched.inputDataHash}
					{#if inputDataHash !== undefined && inputDataHash !== null}
						<div>
							<dt>input data hash</dt>
							<dd>
								<TruncatedValue value={String((inputDataHash) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const inputDataHash = resolvedEntity.inputDataHash}
					{#if inputDataHash !== undefined && inputDataHash !== null}
						<div>
							<dt>input data hash</dt>
							<dd>
								<TruncatedValue value={String((inputDataHash) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							outputDataHash: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const outputDataHash = prefetched.outputDataHash}
					{#if outputDataHash !== undefined && outputDataHash !== null}
						<div>
							<dt>output data hash</dt>
							<dd>
								<TruncatedValue value={String((outputDataHash) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const outputDataHash = resolvedEntity.outputDataHash}
					{#if outputDataHash !== undefined && outputDataHash !== null}
						<div>
							<dt>output data hash</dt>
							<dd>
								<TruncatedValue value={String((outputDataHash) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
