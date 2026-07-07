<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
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
			selection: EntityProxyResource<typeof schema, EntityType.AssetClass>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.AssetClass>>
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
	const assetClass = $derived(selection({
		fields: {
			label: true,
		},
	}))
	const titleFallback = $derived([String((prefetched.label) ?? ''), String((selection.entitySelector.classKey ?? prefetched.classKey) ?? '')].filter(Boolean).join(' ') || 'asset class')
	const viewDomId = $derived('asset-class-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import AssetInstanceView from '$/views/AssetInstanceView.svelte'
</script>


<EntityView
	entityType={EntityType.AssetClass}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={assetClass}>
			{#snippet Pending()}
				{[String((prefetched.label) ?? ''), String((selection.entitySelector.classKey ?? prefetched.classKey) ?? '')].filter(Boolean).join(' ') || title || 'asset class'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.label) ?? ''), String((resolvedEntity.classKey) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={assetClass}>
			{#snippet Pending()}
				{[String((selection.entitySelector.classKind ?? prefetched.classKind) ?? ''), String((selection.entitySelector.classKey ?? prefetched.classKey) ?? '')].filter(Boolean).join(' ') || [String((prefetched.label) ?? ''), String((selection.entitySelector.classKey ?? prefetched.classKey) ?? '')].filter(Boolean).join(' ') || title || 'asset class'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.classKind) ?? ''), String((resolvedEntity.classKey) ?? '')].filter(Boolean).join(' ') || [String((resolvedEntity.label) ?? ''), String((resolvedEntity.classKey) ?? '')].filter(Boolean).join(' ') || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={assetClass}>
			{#snippet Pending()}
				<span data-text="muted">
					<AssetInstanceView
						selection={select(EntityType.AssetInstance, selection.entitySelector.$assetInstance)}
						href={
							(selection.entitySelector.$assetInstance.$network !== undefined && selection.entitySelector.$assetInstance.$network.caip2 !== undefined && selection.entitySelector.$assetInstance.$network.caip2.namespace !== undefined && selection.entitySelector.$assetInstance.$network !== undefined && selection.entitySelector.$assetInstance.$network.caip2 !== undefined && selection.entitySelector.$assetInstance.$network.caip2.reference !== undefined && selection.entitySelector.$assetInstance.kind !== undefined && selection.entitySelector.$assetInstance.assetKey !== undefined ? resolve('/(explore)/(networks)/network/[caip2=networkCaip2]/asset/[kind]/[assetKey]', {
								caip2: `${String(selection.entitySelector.$assetInstance.$network.caip2.namespace ?? '')}:${String(selection.entitySelector.$assetInstance.$network.caip2.reference ?? '')}`,
								kind: String(selection.entitySelector.$assetInstance.kind ?? ''),
								assetKey: String(selection.entitySelector.$assetInstance.assetKey ?? ''),
							}) : undefined)
						}
						layout={EntityLayout.Title}
						open={false}
					/>
				</span>
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				<span data-text="muted">
					<AssetInstanceView
						selection={select(EntityType.AssetInstance, selection.entitySelector.$assetInstance)}
						href={
							(selection.entitySelector.$assetInstance.$network !== undefined && selection.entitySelector.$assetInstance.$network.caip2 !== undefined && selection.entitySelector.$assetInstance.$network.caip2.namespace !== undefined && selection.entitySelector.$assetInstance.$network !== undefined && selection.entitySelector.$assetInstance.$network.caip2 !== undefined && selection.entitySelector.$assetInstance.$network.caip2.reference !== undefined && selection.entitySelector.$assetInstance.kind !== undefined && selection.entitySelector.$assetInstance.assetKey !== undefined ? resolve('/(explore)/(networks)/network/[caip2=networkCaip2]/asset/[kind]/[assetKey]', {
								caip2: `${String(selection.entitySelector.$assetInstance.$network.caip2.namespace ?? '')}:${String(selection.entitySelector.$assetInstance.$network.caip2.reference ?? '')}`,
								kind: String(selection.entitySelector.$assetInstance.kind ?? ''),
								assetKey: String(selection.entitySelector.$assetInstance.assetKey ?? ''),
							}) : undefined)
						}
						layout={EntityLayout.Title}
						open={false}
					/>
				</span>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet TypeAnnotationTooltip()}
		<p>
			A reusable asset classification used to group related asset instances and objects.
		</p>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Class kind</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									classKind: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const classKind = selection.entitySelector.classKind ?? prefetched.classKind}
							{#if classKind !== undefined && classKind !== null}
								{String((classKind) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const classKind = resolvedEntity.classKind}
							{#if classKind !== undefined && classKind !== null}
								{String((classKind) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Class key</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									classKey: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const classKey = selection.entitySelector.classKey ?? prefetched.classKey}
							{#if classKey !== undefined && classKey !== null}
								{String((classKey) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const classKey = resolvedEntity.classKey}
							{#if classKey !== undefined && classKey !== null}
								{String((classKey) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							slot: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const slot = prefetched.slot}
					{#if slot !== undefined && slot !== null}
						<div>
							<dt>Slot</dt>
							<dd>
								{String((slot) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const slot = resolvedEntity.slot}
					{#if slot !== undefined && slot !== null}
						<div>
							<dt>Slot</dt>
							<dd>
								{String((slot) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							partition: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const partition = prefetched.partition}
					{#if partition !== undefined && partition !== null}
						<div>
							<dt>Partition</dt>
							<dd>
								{String((partition) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const partition = resolvedEntity.partition}
					{#if partition !== undefined && partition !== null}
						<div>
							<dt>Partition</dt>
							<dd>
								{String((partition) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							series: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const series = prefetched.series}
					{#if series !== undefined && series !== null}
						<div>
							<dt>Series</dt>
							<dd>
								{String((series) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const series = resolvedEntity.series}
					{#if series !== undefined && series !== null}
						<div>
							<dt>Series</dt>
							<dd>
								{String((series) ?? '')}
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
						fields: {
							maturityMs: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const maturityMs = prefetched.maturityMs}
					{#if maturityMs !== undefined && maturityMs !== null}
						<div>
							<dt>Maturity</dt>
							<dd>
								<svelte:element
									this={'a'}
									href={String(maturityMs)}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={String(maturityMs)} />
								</svelte:element>
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const maturityMs = resolvedEntity.maturityMs}
					{#if maturityMs !== undefined && maturityMs !== null}
						<div>
							<dt>Maturity</dt>
							<dd>
								<svelte:element
									this={'a'}
									href={String(maturityMs)}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={String(maturityMs)} />
								</svelte:element>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							valueDecimals: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const valueDecimals = prefetched.valueDecimals}
					{#if valueDecimals !== undefined && valueDecimals !== null}
						<div>
							<dt>Value decimals</dt>
							<dd>
								{String((valueDecimals) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const valueDecimals = resolvedEntity.valueDecimals}
					{#if valueDecimals !== undefined && valueDecimals !== null}
						<div>
							<dt>Value decimals</dt>
							<dd>
								{String((valueDecimals) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<div>
				<dt>Asset instance</dt>
				<dd>
					<AssetInstanceView
						selection={select(EntityType.AssetInstance, selection.entitySelector.$assetInstance, {})}
						href={
							(selection.entitySelector.$assetInstance.$network !== undefined && selection.entitySelector.$assetInstance.$network.caip2 !== undefined && selection.entitySelector.$assetInstance.$network.caip2.namespace !== undefined && selection.entitySelector.$assetInstance.$network !== undefined && selection.entitySelector.$assetInstance.$network.caip2 !== undefined && selection.entitySelector.$assetInstance.$network.caip2.reference !== undefined && selection.entitySelector.$assetInstance.kind !== undefined && selection.entitySelector.$assetInstance.assetKey !== undefined ? resolve('/(explore)/(networks)/network/[caip2=networkCaip2]/asset/[kind]/[assetKey]', {
								caip2: `${String(selection.entitySelector.$assetInstance.$network.caip2.namespace ?? '')}:${String(selection.entitySelector.$assetInstance.$network.caip2.reference ?? '')}`,
								kind: String(selection.entitySelector.$assetInstance.kind ?? ''),
								assetKey: String(selection.entitySelector.$assetInstance.assetKey ?? ''),
							}) : undefined)
						}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>
		</dl>
	{/snippet}
</EntityView>
