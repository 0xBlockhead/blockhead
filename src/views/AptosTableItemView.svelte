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
			selection: RegisteredEntityProxyResource<EntityType.AptosTableItem>
			prefetched?: Partial<RegisteredEntityProxyData<EntityType.AptosTableItem>>
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
	const aptosTableItem = $derived(selection({
		sources: selection.sources,
		fields: {
			keyType: true,
			valueType: true,
		},
	}))
	const titleFallback = $derived([String((pendingEntity.keyHash) ?? '')].filter(Boolean).join(' ') || 'aptos table item')
	const viewDomId = $derived('aptos-table-item-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import AptosTableItem_TimestampsView from '$/views/AptosTableItem_TimestampsView.svelte'
	import AptosNetworkView from '$/views/AptosNetworkView.svelte'
</script>


<EntityView
	entityType={EntityType.AptosTableItem}
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
					{@const keyHash0 = pendingEntity.keyHash}
					{#if keyHash0 !== undefined && keyHash0 !== null}
						<TruncatedValue value={String((keyHash0) ?? '')} />
					{/if}
		{:else}
			<ResourceBoundary resource={aptosTableItem}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const keyHash0 = resolvedEntity.keyHash}
					{#if keyHash0 !== undefined && keyHash0 !== null}
						<TruncatedValue value={String((keyHash0) ?? '')} />
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Value()}
		{#if prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails}
			{[String((pendingEntity.keyType) ?? ''), String((pendingEntity.valueType) ?? '')].filter(Boolean).join(' ') || [String((pendingEntity.keyHash) ?? '')].filter(Boolean).join(' ') || titleFallback}
		{:else}
			<ResourceBoundary resource={aptosTableItem}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{[String((resolvedEntity.keyType) ?? ''), String((resolvedEntity.valueType) ?? '')].filter(Boolean).join(' ') || [String((resolvedEntity.keyHash) ?? '')].filter(Boolean).join(' ') || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>network</dt>
				<dd>
					<AptosNetworkView
						selection={select(EntityType.AptosNetwork, selection.entitySelector.$network, {})}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>table handle</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									tableHandle: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const tableHandle = resolvedEntity.tableHandle}
							{#if tableHandle !== undefined && tableHandle !== null}
								{String((tableHandle) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>key hash</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									keyHash: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const keyHash = resolvedEntity.keyHash}
							{#if keyHash !== undefined && keyHash !== null}
								<TruncatedValue value={String((keyHash) ?? '')} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					selection({
						sources: selection.sources,
						fields: {
							keyType: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const keyType = resolvedEntity.keyType}
					{#if keyType !== undefined && keyType !== null}
						<div>
							<dt>key type</dt>
							<dd>
								{String((keyType) ?? '')}
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
							valueType: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const valueType = resolvedEntity.valueType}
					{#if valueType !== undefined && valueType !== null}
						<div>
							<dt>value type</dt>
							<dd>
								{String((valueType) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{#if detailsOpen}
			<AptosTableItem_TimestampsView
				selection={
						selection.$$timestamps({
							count: true,
						})
					}
				title='timestamps'
				emptyText='No observations yet.'
				id='AptosTableItem_TimestampsView-timestamps'
			/>
		{/if}
	{/snippet}
</EntityView>
