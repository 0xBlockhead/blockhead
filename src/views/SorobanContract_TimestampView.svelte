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
			selection: EntityProxyResource<typeof schema, EntityType.SorobanContract_Timestamp>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.SorobanContract_Timestamp>>
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
	const sorobanContractTimestamp = $derived(selection({}))
	const titleFallback = $derived('soroban contract timestamp')
	const viewDomId = $derived('soroban-contract-timestamp-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import SorobanContractView from '$/views/SorobanContractView.svelte'
	import SorobanWasmView from '$/views/SorobanWasmView.svelte'
</script>


<EntityView
	entityType={EntityType.SorobanContract_Timestamp}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={sorobanContractTimestamp}>
			{#snippet Pending()}
				{title || 'soroban contract timestamp'}
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
				<dt>contract</dt>
				<dd>
					<SorobanContractView
						selection={select(EntityType.SorobanContract, selection.entitySelector.$contract, {})}
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
							{@const ledgerSequence = selection.entitySelector.ledgerSequence ?? prefetched.ledgerSequence}
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
							{@const source = selection.entitySelector.source ?? prefetched.source}
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
					{@const observedAtMs = prefetched.observedAtMs}
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
							wasmHash: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const wasmHash = prefetched.wasmHash}
					{#if wasmHash !== undefined && wasmHash !== null}
						<div>
							<dt>Wasm hash</dt>
							<dd>
								<TruncatedValue value={String((wasmHash) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const wasmHash = resolvedEntity.wasmHash}
					{#if wasmHash !== undefined && wasmHash !== null}
						<div>
							<dt>Wasm hash</dt>
							<dd>
								<TruncatedValue value={String((wasmHash) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$wasm}
			>
				{#snippet children(sorobanWasm)}
					{#if sorobanWasm != null && sorobanWasm[EntityMetaKey.Selector] != null}
						<div>
							<dt>Wasm</dt>
							<dd>
								<SorobanWasmView
									selection={select(EntityType.SorobanWasm, sorobanWasm[EntityMetaKey.Selector])}
									prefetched={sorobanWasm}
									layout={EntityLayout.Value}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							executableKind: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const executableKind = prefetched.executableKind}
					{#if executableKind !== undefined && executableKind !== null}
						<div>
							<dt>executable kind</dt>
							<dd>
								{String((executableKind) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const executableKind = resolvedEntity.executableKind}
					{#if executableKind !== undefined && executableKind !== null}
						<div>
							<dt>executable kind</dt>
							<dd>
								{String((executableKind) ?? '')}
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
				{#snippet Pending()}
					{@const lastModifiedLedger = prefetched.lastModifiedLedger}
					{#if lastModifiedLedger !== undefined && lastModifiedLedger !== null}
						<div>
							<dt>last modified ledger</dt>
							<dd>
								{String((lastModifiedLedger) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const lastModifiedLedger = resolvedEntity.lastModifiedLedger}
					{#if lastModifiedLedger !== undefined && lastModifiedLedger !== null}
						<div>
							<dt>last modified ledger</dt>
							<dd>
								{String((lastModifiedLedger) ?? '')}
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
				{#snippet Pending()}
					{@const liveUntilLedger = prefetched.liveUntilLedger}
					{#if liveUntilLedger !== undefined && liveUntilLedger !== null}
						<div>
							<dt>live until ledger</dt>
							<dd>
								{String((liveUntilLedger) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const liveUntilLedger = resolvedEntity.liveUntilLedger}
					{#if liveUntilLedger !== undefined && liveUntilLedger !== null}
						<div>
							<dt>live until ledger</dt>
							<dd>
								{String((liveUntilLedger) ?? '')}
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
					{@const found = prefetched.found}
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
