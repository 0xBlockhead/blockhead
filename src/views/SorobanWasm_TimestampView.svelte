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
			selection: EntityProxyResource<typeof schema, EntityType.SorobanWasm_Timestamp>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.SorobanWasm_Timestamp>>
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
	const sorobanWasmTimestamp = $derived(selection({}))
	const titleFallback = $derived('soroban Wasm timestamp')
	const viewDomId = $derived('soroban-wasm-timestamp-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import SorobanWasmView from '$/views/SorobanWasmView.svelte'
</script>


<EntityView
	entityType={EntityType.SorobanWasm_Timestamp}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={sorobanWasmTimestamp}>
			{#snippet Pending()}
				{title || 'soroban Wasm timestamp'}
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
				<dt>Wasm</dt>
				<dd>
					<SorobanWasmView
						selection={select(EntityType.SorobanWasm, selection.entitySelector.$wasm, {})}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>ledger sequence</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									ledgerSequence: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const ledgerSequence = pendingEntity.ledgerSequence}
							{#if ledgerSequence !== undefined && ledgerSequence !== null}
								{String((ledgerSequence) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const ledgerSequence = resolvedEntity.ledgerSequence}
							{#if ledgerSequence !== undefined && ledgerSequence !== null}
								{String((ledgerSequence) ?? '')}
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
							{@const source = pendingEntity.source}
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
							observedAtMs: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const observedAtMs = pendingEntity.observedAtMs}
					{#if observedAtMs !== undefined && observedAtMs !== null}
						<div>
							<dt>observed AT ms</dt>
							<dd>
								{String((observedAtMs) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const observedAtMs = resolvedEntity.observedAtMs}
					{#if observedAtMs !== undefined && observedAtMs !== null}
						<div>
							<dt>observed AT ms</dt>
							<dd>
								{String((observedAtMs) ?? '')}
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
				{#snippet Pending()}
					{@const wasmBytes = pendingEntity.wasmBytes}
					{#if wasmBytes !== undefined && wasmBytes !== null}
						<div>
							<dt>Wasm bytes</dt>
							<dd>
								{String((wasmBytes) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const wasmBytes = resolvedEntity.wasmBytes}
					{#if wasmBytes !== undefined && wasmBytes !== null}
						<div>
							<dt>Wasm bytes</dt>
							<dd>
								{String((wasmBytes) ?? '')}
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
				{#snippet Pending()}
					{@const byteLength = pendingEntity.byteLength}
					{#if byteLength !== undefined && byteLength !== null}
						<div>
							<dt>byte length</dt>
							<dd>
								{String((byteLength) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const byteLength = resolvedEntity.byteLength}
					{#if byteLength !== undefined && byteLength !== null}
						<div>
							<dt>byte length</dt>
							<dd>
								{String((byteLength) ?? '')}
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
				{#snippet Pending()}
					{@const interfaceVersion = pendingEntity.interfaceVersion}
					{#if interfaceVersion !== undefined && interfaceVersion !== null}
						<div>
							<dt>interface version</dt>
							<dd>
								{String((interfaceVersion) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const interfaceVersion = resolvedEntity.interfaceVersion}
					{#if interfaceVersion !== undefined && interfaceVersion !== null}
						<div>
							<dt>interface version</dt>
							<dd>
								{String((interfaceVersion) ?? '')}
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
				{#snippet Pending()}
					{@const found = pendingEntity.found}
					{#if found !== undefined && found !== null}
						<div>
							<dt>found</dt>
							<dd>
								{found ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const found = resolvedEntity.found}
					{#if found !== undefined && found !== null}
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
