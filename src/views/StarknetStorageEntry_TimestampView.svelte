<!-- Generated from APP.ts. Do not edit by hand. -->

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
	}: EntitySelectionViewProps<EntityType.StarknetStorageEntry_Timestamp> = $props()

	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.Juno_JsonRpc,
			Source.Pathfinder_JsonRpc,
			Source.Starknet_JsonRpc,
		],
	}))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import StarknetStorageEntryView from '$/views/StarknetStorageEntryView.svelte'
</script>


<EntityView
	entityType={EntityType.StarknetStorageEntry_Timestamp}
	entitySelector={selection.entitySelector}
	title={title ?? 'starknet storage entry timestamp'}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<StarknetStorageEntryView
			selection={select(EntityType.StarknetStorageEntry, selection.entitySelector.$entry)}
			layout={EntityLayout.Title}
			open={false}
		/>
	{/snippet}

	{#snippet Value()}
		<NumberValue
			value={selection.entitySelector.blockNumber}
		/>
	{/snippet}

	{#snippet HeadingAfter()}
		<span data-text="muted">
			{selection.entitySelector.source}
		</span>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>entry</dt>
				<dd>
					<StarknetStorageEntryView
						selection={select(EntityType.StarknetStorageEntry, selection.entitySelector.$entry)}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>Block number</dt>
				<dd>
					<NumberValue
						value={selection.entitySelector.blockNumber}
					/>
				</dd>
			</div>

			<div>
				<dt>Source</dt>
				<dd>
					{selection.entitySelector.source}
				</dd>
			</div>

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
								{value}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							blockHash: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const blockHash = entity.blockHash}
					{#if blockHash != null}
						<div>
							<dt>Block hash</dt>
							<dd>
								<TruncatedValue value={blockHash} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
