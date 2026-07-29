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
	}: EntitySelectionViewProps<EntityType.ZeroGKvEntry> = $props()

	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.ZeroGStorageNode_JsonRpc,
			Source.ZeroGStorageScan_Rest,
		],
	}))
	const titleFallback = $derived(selection.entitySelector.key || 'zero g kv entry')


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
	import EvmAccountView from '$/views/EvmAccountView.svelte'
	import ZeroGStorageLogEntryView from '$/views/ZeroGStorageLogEntryView.svelte'
</script>


<EntityView
	entityType={EntityType.ZeroGKvEntry}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{selection.entitySelector.key || 'zero g kv entry'}
	{/snippet}

	{#snippet Value()}
		{selection.entitySelector.namespace || selection.entitySelector.key || titleFallback}
	{/snippet}

	{#snippet HeadingAfter()}
		<span data-text="muted">
			<NetworkView
				selection={select(EntityType.Network, selection.entitySelector.$network)}
				layout={EntityLayout.Title}
				open={false}
			/>
		</span>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>network</dt>
				<dd>
					<NetworkView
						selection={select(EntityType.Network, selection.entitySelector.$network)}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>Namespace</dt>
				<dd>
					{selection.entitySelector.namespace}
				</dd>
			</div>

			<div>
				<dt>key</dt>
				<dd>
					{selection.entitySelector.key}
				</dd>
			</div>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							valueHash: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const valueHash = entity.valueHash}
					{#if valueHash != null}
						<div>
							<dt>value hash</dt>
							<dd>
								<TruncatedValue value={valueHash} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$owner}
			>
				{#snippet children(evmAccount)}
					{#if evmAccount != null}
						<div>
							<dt>owner</dt>
							<dd>
								<EvmAccountView
									selection={select(EntityType.EvmAccount, evmAccount[EntityMetaKey.Selector])}
									prefetched={evmAccount}
									layout={EntityLayout.Value}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$logEntry}
			>
				{#snippet children(zeroGStorageLogEntry)}
					{#if zeroGStorageLogEntry != null}
						<div>
							<dt>log entry</dt>
							<dd>
								<ZeroGStorageLogEntryView
									selection={select(EntityType.ZeroGStorageLogEntry, zeroGStorageLogEntry[EntityMetaKey.Selector])}
									prefetched={zeroGStorageLogEntry}
									layout={EntityLayout.Value}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
