<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { RegisteredEntityProxyData, RegisteredEntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


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
			selection: RegisteredEntityProxyResource<EntityType.AptosTableItem_Timestamp>
			prefetched?: Partial<RegisteredEntityProxyData<EntityType.AptosTableItem_Timestamp>>
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
	const aptosTableItemTimestamp = $derived(selection({
		sources: selection.sources,
		fields: {
			timestampMs: true,
		},
	}))
	const titleFallback = $derived([String((pendingEntity.ledgerVersion) ?? '')].filter(Boolean).join(' ') || 'aptos table item timestamp')
	const viewDomId = $derived('aptos-table-item-timestamp-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import AptosTableItemView from '$/views/AptosTableItemView.svelte'
</script>


<EntityView
	entityType={EntityType.AptosTableItem_Timestamp}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{#if prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails}
					{@const ledgerVersion0 = pendingEntity.ledgerVersion}
					{#if ledgerVersion0 !== undefined && ledgerVersion0 !== null}
						<NumberValue
							value={ledgerVersion0}
						/>
					{/if}
		{:else}
			<ResourceBoundary resource={aptosTableItemTimestamp}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const ledgerVersion0 = resolvedEntity.ledgerVersion}
					{#if ledgerVersion0 !== undefined && ledgerVersion0 !== null}
						<NumberValue
							value={ledgerVersion0}
						/>
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Value()}
		{#if prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails}
					{@const timestampMs0 = pendingEntity.timestampMs}
					{#if timestampMs0 !== undefined && timestampMs0 !== null}
						<Timestamp timestamp={Number(timestampMs0)} />
					{/if}
		{:else}
			<ResourceBoundary resource={aptosTableItemTimestamp}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const timestampMs0 = resolvedEntity.timestampMs}
					{#if timestampMs0 !== undefined && timestampMs0 !== null}
						<Timestamp timestamp={Number(timestampMs0)} />
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet HeadingAfter()}
		{#if prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails}
			{@const source0 = pendingEntity.source}
			{#if source0 !== undefined && source0 !== null}
				<span data-text="muted">
					{String((source0) ?? '')}
				</span>
			{/if}
		{:else}
			<ResourceBoundary resource={aptosTableItemTimestamp}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const source0 = resolvedEntity.source}
					{#if source0 !== undefined && source0 !== null}
						<span data-text="muted">
							{String((source0) ?? '')}
						</span>
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>table item</dt>
				<dd>
					<AptosTableItemView
						selection={select(EntityType.AptosTableItem, selection.entitySelector.$tableItem, {})}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>ledger version</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									ledgerVersion: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const ledgerVersion = resolvedEntity.ledgerVersion}
							{#if ledgerVersion !== undefined && ledgerVersion !== null}
								<NumberValue
									value={ledgerVersion}
								/>
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
								sources: selection.sources,
								fields: {
									source: true,
								},
							})
						}
					>
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
						sources: selection.sources,
						fields: {
							timestampMs: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const timestampMs = resolvedEntity.timestampMs}
					{#if timestampMs !== undefined && timestampMs !== null}
						<div>
							<dt>Timestamp</dt>
							<dd>
								<Timestamp timestamp={Number(timestampMs)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					selection({
						sources: selection.sources,
						fields: {
							valueHash: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const valueHash = resolvedEntity.valueHash}
					{#if valueHash !== undefined && valueHash !== null}
						<div>
							<dt>value hash</dt>
							<dd>
								<TruncatedValue value={String((valueHash) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						sources: selection.sources,
						fields: {
							pruned: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const pruned = resolvedEntity.pruned}
					{#if pruned !== undefined && pruned !== null}
						<div>
							<dt>pruned</dt>
							<dd>
								{pruned ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
