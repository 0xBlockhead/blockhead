<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { RegisteredEntityProxyPrefetchedData, RegisteredEntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
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
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyResource<EntityType.NearExecutionOutcome>
			prefetched?: RegisteredEntityProxyPrefetchedData<EntityType.NearExecutionOutcome>
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
	const nearExecutionOutcome = $derived(selection(prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails ? {
		sources: selection.sources,
		fields: {
			status: true,
			gasBurnt: true,
		},
	} : {
		sources: selection.sources,
		fields: {
			status: true,
			gasBurnt: true,
		},
	}))
	const titleFallback = $derived([String((pendingEntity.outcomeId) ?? '')].filter(Boolean).join(' ') || 'near execution outcome')
	const viewDomId = $derived('near-execution-outcome-' + encodeURIComponent(stringify(selection.entitySelector ?? prefetched[EntityMetaKey.Selector])))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import NearReceiptsView from '$/views/NearReceiptsView.svelte'
	import NearTransactionView from '$/views/NearTransactionView.svelte'
</script>


<EntityView
	entityType={EntityType.NearExecutionOutcome}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{#if layout !== EntityLayout.SummaryDetails && Object.hasOwn(prefetched, 'status') && Object.hasOwn(prefetched, 'gasBurnt')}
			{@const outcomeId0 = pendingEntity.outcomeId}
			{#if outcomeId0 !== undefined && outcomeId0 !== null}
				<TruncatedValue value={String((outcomeId0) ?? '')} />
			{/if}
		{:else}
			<ResourceBoundary resource={nearExecutionOutcome}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const outcomeId0 = resolvedEntity.outcomeId}
					{#if outcomeId0 !== undefined && outcomeId0 !== null}
						<TruncatedValue value={String((outcomeId0) ?? '')} />
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Value()}
		{#if layout !== EntityLayout.SummaryDetails && Object.hasOwn(prefetched, 'status') && Object.hasOwn(prefetched, 'gasBurnt')}
			{[String((pendingEntity.status) ?? '')].filter(Boolean).join(' ') || [String((pendingEntity.outcomeId) ?? '')].filter(Boolean).join(' ') || titleFallback}
		{:else}
			<ResourceBoundary resource={nearExecutionOutcome}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{[String((resolvedEntity.status) ?? '')].filter(Boolean).join(' ') || [String((resolvedEntity.outcomeId) ?? '')].filter(Boolean).join(' ') || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet HeadingAfter()}
		{#if layout !== EntityLayout.SummaryDetails && Object.hasOwn(prefetched, 'status') && Object.hasOwn(prefetched, 'gasBurnt')}
			{@const gasBurnt0 = pendingEntity.gasBurnt}
			{#if gasBurnt0 !== undefined && gasBurnt0 !== null}
				<span data-text="muted">
					<NumberValue
						value={gasBurnt0}
					/>
				</span>
			{/if}
		{:else}
			<ResourceBoundary resource={nearExecutionOutcome}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const gasBurnt0 = resolvedEntity.gasBurnt}
					{#if gasBurnt0 !== undefined && gasBurnt0 !== null}
						<span data-text="muted">
							<NumberValue
								value={gasBurnt0}
							/>
						</span>
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Transaction</dt>
				<dd>
					<NearTransactionView
						selection={select(EntityType.NearTransaction, selection.entitySelector.$transaction)}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>Outcome ID</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									outcomeId: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const outcomeId = resolvedEntity.outcomeId}
							{#if outcomeId !== undefined && outcomeId !== null}
								<TruncatedValue value={String((outcomeId) ?? '')} />
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
							status: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const status = resolvedEntity.status}
					{#if status !== undefined && status !== null}
						<div>
							<dt>Status</dt>
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
						sources: selection.sources,
						fields: {
							gasBurnt: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const gasBurnt = resolvedEntity.gasBurnt}
					{#if gasBurnt !== undefined && gasBurnt !== null}
						<div>
							<dt>Gas burnt</dt>
							<dd>
								<NumberValue
									value={gasBurnt}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
				{@const nearExecutionOutcomeNearReceiptsViewReceiptsResource = selection
		.$$receipts({
			sources: [
				Source.NearRpc_JsonRpc,
			],
		})}
				<ResourceBoundary
					resource={nearExecutionOutcomeNearReceiptsViewReceiptsResource}
				>
					{#snippet children(entities)}
						{#if entities.values.length > 0}
						<NearReceiptsView
							selection={nearExecutionOutcomeNearReceiptsViewReceiptsResource}
							countResource={nearExecutionOutcomeNearReceiptsViewReceiptsResource.count}
							title='Receipts'
							id='NearReceiptsView-receipts'
						/>
						{/if}
					{/snippet}
				</ResourceBoundary>
	{/snippet}
</EntityView>
