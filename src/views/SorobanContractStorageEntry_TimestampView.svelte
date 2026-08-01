<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: Omit<EntitySelectionViewProps<EntityType.SorobanContractStorageEntry_Timestamp>, 'prefetched'> = $props()


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import SorobanContractStorageEntryView from '$/views/SorobanContractStorageEntryView.svelte'
</script>


<EntityView
	entityType={EntityType.SorobanContractStorageEntry_Timestamp}
	entitySelector={selection.entitySelector}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>entry</dt>
				<dd>
					<SorobanContractStorageEntryView
						selection={select(EntityType.SorobanContractStorageEntry, selection.entitySelector.$entry)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<div>
				<dt>ledger sequence</dt>
				<dd>
					{selection.entitySelector.ledgerSequence}
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
					selection({
						fields: {
							observedAtMs: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const observedAtMs = entity.observedAtMs}
					{#if observedAtMs != null}
						<div>
							<dt>observed AT ms</dt>
							<dd>
								{observedAtMs}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							valueXdr: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const valueXdr = entity.valueXdr}
					{#if valueXdr != null}
						<div>
							<dt>value xdr</dt>
							<dd>
								{valueXdr}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							durability: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const durability = entity.durability}
					{#if durability != null}
						<div>
							<dt>durability</dt>
							<dd>
								{durability}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							lastModifiedLedger: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const lastModifiedLedger = entity.lastModifiedLedger}
					{#if lastModifiedLedger != null}
						<div>
							<dt>last modified ledger</dt>
							<dd>
								{lastModifiedLedger}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							liveUntilLedger: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const liveUntilLedger = entity.liveUntilLedger}
					{#if liveUntilLedger != null}
						<div>
							<dt>live until ledger</dt>
							<dd>
								{liveUntilLedger}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							found: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const found = entity.found}
					{#if found != null}
						<div>
							<dt>found</dt>
							<dd>
								{found ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
