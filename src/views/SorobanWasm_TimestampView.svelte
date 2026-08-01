<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		prefetched = {},
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: EntitySelectionViewProps<EntityType.SorobanWasm_Timestamp> = $props()


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import SorobanWasmView from '$/views/SorobanWasmView.svelte'
</script>


<EntityView
	entityType={EntityType.SorobanWasm_Timestamp}
	entitySelector={selection.entitySelector}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Wasm</dt>
				<dd>
					<SorobanWasmView
						selection={select(EntityType.SorobanWasm, selection.entitySelector.$wasm)}
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
							wasmBytes: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const wasmBytes = entity.wasmBytes}
					{#if wasmBytes != null}
						<div>
							<dt>Wasm bytes</dt>
							<dd>
								{wasmBytes}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							byteLength: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const byteLength = entity.byteLength}
					{#if byteLength != null}
						<div>
							<dt>byte length</dt>
							<dd>
								{byteLength}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							interfaceVersion: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const interfaceVersion = entity.interfaceVersion}
					{#if interfaceVersion != null}
						<div>
							<dt>interface version</dt>
							<dd>
								{interfaceVersion}
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
