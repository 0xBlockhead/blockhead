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
	}: EntitySelectionViewProps<EntityType.StarknetEvent> = $props()

	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.Starknet_JsonRpc,
			Source.Starkscan_Rest,
			Source.Voyager_Rest,
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
			open={false}
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
							prefetched={starknetContract}
							layout={EntityLayout.Title}
							open={false}
						/>
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>transaction</dt>
				<dd>
					<StarknetTransactionView
						selection={select(EntityType.StarknetTransaction, selection.entitySelector.$transaction)}
						layout={EntityLayout.Value}
						open={false}
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
									prefetched={starknetContract}
									layout={EntityLayout.Value}
									open={false}
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
