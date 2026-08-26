<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { untrack } from 'svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { getAppClient } from '$/routes/applicationClient.ts'


	const select = getAppClient().select

	// State
	let {
		selection,
		title,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: Omit<EntitySelectionViewProps<EntityType.BlockheadSessionSimulationCall>, 'prefetched'> = $props()

	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.Local_Internal,
		],
	}))
	const blockheadSessionSimulationCall = $derived(viewSelection({
		fields: {
			callType: true,
			depth: true,
		},
	}))
	const titleFallback = $derived(selection.entitySelector.callPath || 'blockhead session simulation call')


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import BlockheadSessionSimulationView from '$/views/BlockheadSessionSimulationView.svelte'
</script>


<EntityView
	entityType={EntityType.BlockheadSessionSimulationCall}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	href={
		href === undefined ?
			resolve(
				'/~/session/simulation/[simulationId=stringSegment]/call/[callPath=stringSegment]',
				{
					simulationId: selection.entitySelector.simulationId,
					callPath: selection.entitySelector.callPath,
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
		<ResourceBoundary resource={blockheadSessionSimulationCall}>
			{#snippet children(entity)}
				{(entity.callType ?? '') || selection.entitySelector.callPath || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={blockheadSessionSimulationCall}>
			{#snippet children(entity)}
				<span data-text="muted">
					<NumberValue
						value={entity.depth}
					/>
				</span>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>simulation</dt>
				<dd>
					<ResourceBoundary
						resource={selection.$simulation}
					>
						{#snippet children(blockheadSessionSimulation)}
							{@const blockheadSessionSimulationInitial = untrack(() => blockheadSessionSimulation)}
							<BlockheadSessionSimulationView
								selection={select(EntityType.BlockheadSessionSimulation, (blockheadSessionSimulation ?? blockheadSessionSimulationInitial)[EntityMetaKey.Selector])}
								prefetched={blockheadSessionSimulation ?? blockheadSessionSimulationInitial}
								layout={EntityLayout.Value}
							/>
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>call path</dt>
				<dd>
					{selection.entitySelector.callPath}
				</dd>
			</div>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							parentCallPath: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const parentCallPath = entity.parentCallPath}
					{#if parentCallPath != null}
						<div>
							<dt>parent call path</dt>
							<dd>
								{parentCallPath}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<div>
				<dt>depth</dt>
				<dd>
					<ResourceBoundary
						resource={blockheadSessionSimulationCall}
					>
						{#snippet children(entity)}
							<NumberValue
								value={entity.depth}
							/>
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>call index</dt>
				<dd>
					<ResourceBoundary
						resource={
							viewSelection({
								fields: {
									callIndex: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							<NumberValue
								value={entity.callIndex}
							/>
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={blockheadSessionSimulationCall}
			>
				{#snippet children(entity)}
					{@const callType = entity.callType}
					{#if callType != null}
						<div>
							<dt>call type</dt>
							<dd>
								{callType}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							fromAddress: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const fromAddress = entity.fromAddress}
					{#if fromAddress != null}
						<div>
							<dt>from address</dt>
							<dd>
								<TruncatedValue value={fromAddress} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							toAddress: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const toAddress = entity.toAddress}
					{#if toAddress != null}
						<div>
							<dt>to address</dt>
							<dd>
								<TruncatedValue value={toAddress} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							value: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const value = entity.value}
					{#if value != null}
						<div>
							<dt>Value</dt>
							<dd>
								<NumberValue
									value={value}
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
							reverted: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const reverted = entity.reverted}
					{#if reverted != null}
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

		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							inputSelector: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const inputSelector = entity.inputSelector}
					{#if inputSelector != null}
						<div>
							<dt>input selector</dt>
							<dd>
								{inputSelector}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							inputDataHash: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const inputDataHash = entity.inputDataHash}
					{#if inputDataHash != null}
						<div>
							<dt>input data hash</dt>
							<dd>
								<TruncatedValue value={inputDataHash} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							outputDataHash: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const outputDataHash = entity.outputDataHash}
					{#if outputDataHash != null}
						<div>
							<dt>output data hash</dt>
							<dd>
								<TruncatedValue value={outputDataHash} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
