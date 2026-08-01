<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
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
	}: EntitySelectionViewProps<EntityType.NearExecutionOutcome> = $props()

	const nearExecutionOutcome = $derived(selection({
		sources: selection.sources ?? [
			Source.NearRpc_JsonRpc,
		],
	})({
		fields: {
			status: true,
			gasBurnt: true,
		},
	}))
	const titleFallback = $derived(selection.entitySelector.outcomeId || 'near execution outcome')


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import NearReceiptsView from '$/views/NearReceiptsView.svelte'
	import NearTransactionView from '$/views/NearTransactionView.svelte'
</script>


<EntityView
	entityType={EntityType.NearExecutionOutcome}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<TruncatedValue value={selection.entitySelector.outcomeId} />
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={nearExecutionOutcome}>
			{#snippet children(entity)}
				{(entity.status ?? '') || selection.entitySelector.outcomeId || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={nearExecutionOutcome}>
			{#snippet children(entity)}
				{@const gasBurnt = entity.gasBurnt}
				{#if gasBurnt != null}
					<span data-text="muted">
						<NumberValue
							value={gasBurnt}
						/>
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>Transaction</dt>
				<dd>
					<NearTransactionView
						selection={select(EntityType.NearTransaction, selection.entitySelector.$transaction)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<div>
				<dt>Outcome ID</dt>
				<dd>
					<TruncatedValue value={selection.entitySelector.outcomeId} />
				</dd>
			</div>

			<ResourceBoundary
				resource={nearExecutionOutcome}
			>
				{#snippet children(entity)}
					{@const status = entity.status}
					{#if status != null}
						<div>
							<dt>Status</dt>
							<dd>
								{status}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={nearExecutionOutcome}
			>
				{#snippet children(entity)}
					{@const gasBurnt = entity.gasBurnt}
					{#if gasBurnt != null}
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

	{#snippet Details()}
		{@const receiptsResource = selection.$$receipts}
		<ResourceBoundary
			resource={receiptsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<NearReceiptsView
						selection={receiptsResource}
						countResource={receiptsResource.count}
						title='Receipts'
						id='receipts'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
