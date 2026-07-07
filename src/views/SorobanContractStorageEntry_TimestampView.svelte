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
			selection: EntityProxyResource<typeof schema, EntityType.SorobanContractStorageEntry_Timestamp>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.SorobanContractStorageEntry_Timestamp>>
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
	const sorobanContractStorageEntryTimestamp = $derived(selection({}))
	const titleFallback = $derived('soroban contract storage entry timestamp')
	const viewDomId = $derived('soroban-contract-storage-entry-timestamp-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import SorobanContractStorageEntryView from '$/views/SorobanContractStorageEntryView.svelte'
</script>


<EntityView
	entityType={EntityType.SorobanContractStorageEntry_Timestamp}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={sorobanContractStorageEntryTimestamp}>
			{#snippet Pending()}
				{title || 'soroban contract storage entry timestamp'}
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
				<dt>entry</dt>
				<dd>
					<SorobanContractStorageEntryView
						selection={select(EntityType.SorobanContractStorageEntry, selection.entitySelector.$entry, {})}
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
							valueXdr: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const valueXdr = prefetched.valueXdr}
					{#if valueXdr !== undefined && valueXdr !== null}
						<div>
							<dt>value xdr</dt>
							<dd>
								{String((valueXdr) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const valueXdr = resolvedEntity.valueXdr}
					{#if valueXdr !== undefined && valueXdr !== null}
						<div>
							<dt>value xdr</dt>
							<dd>
								{String((valueXdr) ?? '')}
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
				{#snippet Pending()}
					{@const durability = prefetched.durability}
					{#if durability !== undefined && durability !== null}
						<div>
							<dt>durability</dt>
							<dd>
								{String((durability) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const durability = resolvedEntity.durability}
					{#if durability !== undefined && durability !== null}
						<div>
							<dt>durability</dt>
							<dd>
								{String((durability) ?? '')}
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
