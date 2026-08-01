<!-- Generated from APP.ts. -->

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
		title,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: Omit<EntitySelectionViewProps<EntityType.StarknetEvent>, 'prefetched'> = $props()

	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.Starkscan,
			Source.Voyager,
		],
	}))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import StarknetTransactionView from '$/views/StarknetTransactionView.svelte'
	import StarknetContractView from '$/views/StarknetContractView.svelte'
</script>


<EntityView
	entityType={EntityType.StarknetEvent}
	entitySelector={selection.entitySelector}
	title={title ?? String(selection.entitySelector.eventIndex)}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<NumberValue
			value={selection.entitySelector.eventIndex}
		/>
	{/snippet}

	{#snippet Value()}
		<StarknetTransactionView
			selection={select(EntityType.StarknetTransaction, selection.entitySelector.$transaction)}
			layout={EntityLayout.Value}
		/>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary
			resource={selection.$fromContract}
		>
			{#snippet children(starknetContract)}
				{#if starknetContract != null}
					<span data-text="muted">
						<StarknetContractView
							selection={select(EntityType.StarknetContract, starknetContract[EntityMetaKey.Selector])}
							layout={EntityLayout.Title}
						/>
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>transaction</dt>
				<dd>
					<StarknetTransactionView
						selection={select(EntityType.StarknetTransaction, selection.entitySelector.$transaction)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<div>
				<dt>event index</dt>
				<dd>
					<NumberValue
						value={selection.entitySelector.eventIndex}
					/>
				</dd>
			</div>

			<ResourceBoundary
				resource={selection.$fromContract}
			>
				{#snippet children(starknetContract)}
					{#if starknetContract != null}
						<div>
							<dt>from contract</dt>
							<dd>
								<StarknetContractView
									selection={select(EntityType.StarknetContract, starknetContract[EntityMetaKey.Selector])}
									layout={EntityLayout.Value}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<div>
				<dt>keys</dt>
				<dd>
					<ResourceBoundary
						resource={
							viewSelection({
								fields: {
									keys: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{entity.keys.values.join(', ')}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>data</dt>
				<dd>
					<ResourceBoundary
						resource={
							viewSelection({
								fields: {
									data: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{entity.data.values.join(', ')}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>
	{/snippet}
</EntityView>
