<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityProxyData, EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'


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
			selection: EntityProxyResource<typeof schema, EntityType.SuiTransaction_Timestamp>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.SuiTransaction_Timestamp>>
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
	const suiTransactionTimestamp = $derived(selection({}))
	const titleFallback = $derived('Sui transaction timestamp')
	const viewDomId = $derived('sui-transaction-timestamp-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import SuiTransactionView from '$/views/SuiTransactionView.svelte'
</script>


<EntityView
	entityType={EntityType.SuiTransaction_Timestamp}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={suiTransactionTimestamp}>
			{#snippet Pending()}
				{title || 'Sui transaction timestamp'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>transaction</dt>
				<dd>
					<SuiTransactionView
						selection={select(EntityType.SuiTransaction, selection.entitySelector.$transaction, {})}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>checkpoint sequence</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									checkpointSequence: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const checkpointSequence = selection.entitySelector.checkpointSequence ?? prefetched.checkpointSequence}
							{#if checkpointSequence !== undefined && checkpointSequence !== null}
								{String((checkpointSequence) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const checkpointSequence = resolvedEntity.checkpointSequence}
							{#if checkpointSequence !== undefined && checkpointSequence !== null}
								{String((checkpointSequence) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Source</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									source: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const source = selection.entitySelector.source ?? prefetched.source}
							{#if source !== undefined && source !== null}
								{String((source) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const source = resolvedEntity.source}
							{#if source !== undefined && source !== null}
								{String((source) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							timestampMs: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const timestampMs = prefetched.timestampMs}
					{#if timestampMs !== undefined && timestampMs !== null}
						<div>
							<dt>Timestamp</dt>
							<dd>
								<Timestamp timestamp={Number(timestampMs)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const timestampMs = resolvedEntity.timestampMs}
					{#if timestampMs !== undefined && timestampMs !== null}
						<div>
							<dt>Timestamp</dt>
							<dd>
								<Timestamp timestamp={Number(timestampMs)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							status: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const status = prefetched.status}
					{#if status !== undefined && status !== null}
						<div>
							<dt>status</dt>
							<dd>
								{String((status) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const status = resolvedEntity.status}
					{#if status !== undefined && status !== null}
						<div>
							<dt>status</dt>
							<dd>
								{String((status) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							gasBudget: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const gasBudget = prefetched.gasBudget}
					{#if gasBudget !== undefined && gasBudget !== null}
						<div>
							<dt>gas budget</dt>
							<dd>
								{String((gasBudget) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const gasBudget = resolvedEntity.gasBudget}
					{#if gasBudget !== undefined && gasBudget !== null}
						<div>
							<dt>gas budget</dt>
							<dd>
								{String((gasBudget) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							gasPrice: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const gasPrice = prefetched.gasPrice}
					{#if gasPrice !== undefined && gasPrice !== null}
						<div>
							<dt>gas price</dt>
							<dd>
								{String((gasPrice) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const gasPrice = resolvedEntity.gasPrice}
					{#if gasPrice !== undefined && gasPrice !== null}
						<div>
							<dt>gas price</dt>
							<dd>
								{String((gasPrice) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							effectsDigest: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const effectsDigest = prefetched.effectsDigest}
					{#if effectsDigest !== undefined && effectsDigest !== null}
						<div>
							<dt>effects digest</dt>
							<dd>
								<TruncatedValue value={String((effectsDigest) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const effectsDigest = resolvedEntity.effectsDigest}
					{#if effectsDigest !== undefined && effectsDigest !== null}
						<div>
							<dt>effects digest</dt>
							<dd>
								<TruncatedValue value={String((effectsDigest) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							confirmedLocalExecution: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const confirmedLocalExecution = prefetched.confirmedLocalExecution}
					{#if confirmedLocalExecution !== undefined && confirmedLocalExecution !== null}
						<div>
							<dt>confirmed local execution</dt>
							<dd>
								{confirmedLocalExecution ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const confirmedLocalExecution = resolvedEntity.confirmedLocalExecution}
					{#if confirmedLocalExecution !== undefined && confirmedLocalExecution !== null}
						<div>
							<dt>confirmed local execution</dt>
							<dd>
								{confirmedLocalExecution ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
