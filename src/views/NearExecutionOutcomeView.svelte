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
			selection: EntityProxyResource<typeof schema, EntityType.NearExecutionOutcome>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.NearExecutionOutcome>>
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
	const nearExecutionOutcome = $derived(selection({
		sources: [
			Source.NearRpc_JsonRpc,
		],
		fields: {
			status: true,
			gasBurnt: true,
		},
	}))
	const titleFallback = $derived([String((selection.entitySelector.outcomeId ?? prefetched.outcomeId) ?? '')].filter(Boolean).join(' ') || 'near execution outcome')
	const viewDomId = $derived('near-execution-outcome-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


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
		<ResourceBoundary resource={nearExecutionOutcome}>
			{#snippet Pending()}
				{@const outcomeId0 = selection.entitySelector.outcomeId ?? prefetched.outcomeId}
				{#if outcomeId0 !== undefined && outcomeId0 !== null}
					<TruncatedValue value={String((outcomeId0) ?? '')} />
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const outcomeId0 = resolvedEntity.outcomeId}
				{#if outcomeId0 !== undefined && outcomeId0 !== null}
					<TruncatedValue value={String((outcomeId0) ?? '')} />
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={nearExecutionOutcome}>
			{#snippet Pending()}
				{[String((prefetched.status) ?? '')].filter(Boolean).join(' ') || [String((selection.entitySelector.outcomeId ?? prefetched.outcomeId) ?? '')].filter(Boolean).join(' ') || title || 'near execution outcome'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.status) ?? '')].filter(Boolean).join(' ') || [String((resolvedEntity.outcomeId) ?? '')].filter(Boolean).join(' ') || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={nearExecutionOutcome}>
			{#snippet Pending()}
				{@const gasBurnt0 = prefetched.gasBurnt}
				{#if gasBurnt0 !== undefined && gasBurnt0 !== null}
					<span data-text="muted">
						<NumberValue value={Number(gasBurnt0)} />
					</span>
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const gasBurnt0 = resolvedEntity.gasBurnt}
				{#if gasBurnt0 !== undefined && gasBurnt0 !== null}
					<span data-text="muted">
						<NumberValue value={Number(gasBurnt0)} />
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Transaction</dt>
				<dd>
					<NearTransactionView
						selection={select(EntityType.NearTransaction, selection.entitySelector.$transaction, {})}
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
								fields: {
									outcomeId: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const outcomeId = selection.entitySelector.outcomeId ?? prefetched.outcomeId}
							{#if outcomeId !== undefined && outcomeId !== null}
								<TruncatedValue value={String((outcomeId) ?? '')} />
							{/if}
						{/snippet}

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
						sources: [
							Source.NearRpc_JsonRpc,
						],
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
							<dt>Status</dt>
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
						sources: [
							Source.NearRpc_JsonRpc,
						],
						fields: {
							gasBurnt: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const gasBurnt = prefetched.gasBurnt}
					{#if gasBurnt !== undefined && gasBurnt !== null}
						<div>
							<dt>Gas burnt</dt>
							<dd>
								<NumberValue value={Number(gasBurnt)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const gasBurnt = resolvedEntity.gasBurnt}
					{#if gasBurnt !== undefined && gasBurnt !== null}
						<div>
							<dt>Gas burnt</dt>
							<dd>
								<NumberValue value={Number(gasBurnt)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{#if detailsOpen}
			<NearReceiptsView
				selection={
						selection.$$receipts({
							sources: [
								Source.NearRpc_JsonRpc,
							],
						})
					}
				title='Receipts'
				id='NearReceiptsView-receipts'
			/>
		{/if}
	{/snippet}
</EntityView>
