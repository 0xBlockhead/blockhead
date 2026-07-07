<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { EntityProxyField, type EntityProxyData, type EntityProxyResource } from '$/client/$proxy.svelte.ts'
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
			selection: EntityProxyResource<typeof schema, EntityType.AptosTableItem>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.AptosTableItem>>
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
		fields: {
			keyType: true,
			valueType: true,
		},
	}))
	const titleFallback = $derived([String((selection.entitySelector.keyHash ?? prefetched.keyHash) ?? '')].filter(Boolean).join(' ') || 'aptos table item')
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
		<ResourceBoundary resource={aptosTableItem}>
			{#snippet Pending()}
				{@const keyHash0 = selection.entitySelector.keyHash ?? prefetched.keyHash}
				{#if keyHash0 !== undefined && keyHash0 !== null}
					<TruncatedValue value={String((keyHash0) ?? '')} />
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const keyHash0 = resolvedEntity.keyHash}
				{#if keyHash0 !== undefined && keyHash0 !== null}
					<TruncatedValue value={String((keyHash0) ?? '')} />
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={aptosTableItem}>
			{#snippet Pending()}
				{[String((prefetched.keyType) ?? ''), String((prefetched.valueType) ?? '')].filter(Boolean).join(' ') || [String((selection.entitySelector.keyHash ?? prefetched.keyHash) ?? '')].filter(Boolean).join(' ') || title || 'aptos table item'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.keyType) ?? ''), String((resolvedEntity.valueType) ?? '')].filter(Boolean).join(' ') || [String((resolvedEntity.keyHash) ?? '')].filter(Boolean).join(' ') || titleFallback}
			{/snippet}
		</ResourceBoundary>
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
								fields: {
									tableHandle: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const tableHandle = selection.entitySelector.tableHandle ?? prefetched.tableHandle}
							{#if tableHandle !== undefined && tableHandle !== null}
								{String((tableHandle) ?? '')}
							{/if}
						{/snippet}

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
								fields: {
									keyHash: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const keyHash = selection.entitySelector.keyHash ?? prefetched.keyHash}
							{#if keyHash !== undefined && keyHash !== null}
								<TruncatedValue value={String((keyHash) ?? '')} />
							{/if}
						{/snippet}

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
						fields: {
							keyType: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const keyType = prefetched.keyType}
					{#if keyType !== undefined && keyType !== null}
						<div>
							<dt>key type</dt>
							<dd>
								{String((keyType) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

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
						fields: {
							valueType: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const valueType = prefetched.valueType}
					{#if valueType !== undefined && valueType !== null}
						<div>
							<dt>value type</dt>
							<dd>
								{String((valueType) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

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
				selection={selection[EntityProxyField]<EntityType.AptosTableItem_Timestamp>('$$timestamps')}
				title='timestamps'
				emptyText='No observations yet.'
				id='AptosTableItem_TimestampsView-$$timestamps'
			/>
		{/if}
	{/snippet}
</EntityView>
