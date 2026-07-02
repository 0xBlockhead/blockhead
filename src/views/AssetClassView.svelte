<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { EntityProxyData, EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityLayout } from '$/components/EntityView.svelte'
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

	const assetClass = $derived(selection({
		fields: {
			label: true,
			slot: true,
			partition: true,
			series: true,
			maturityMs: true,
			valueDecimals: true,
		},
	}))
	const titleFallback = $derived([String((({ ...selection.entitySelector, ...prefetched }).label) ?? ''), String((({ ...selection.entitySelector, ...prefetched }).classKey) ?? '')].filter(Boolean).join(' ') || 'asset class')
	const viewDomId = $derived('asset-class-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))
	// Components
	import EntityView from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import AssetInstanceView from '$/views/AssetInstanceView.svelte'
</script>


<EntityView
	entityType={EntityType.AssetClass}
	entitySelector={selection.entitySelector}
	id={viewDomId}
	title={title ?? titleFallback}
	href={
		href ?? resolve('/(explore)/(networks)/network/[caip2=networkCaip2]/asset/[kind]/[assetKey]/class/[classKind]/[classKey]', {
			caip2: `${String(({ ...selection.entitySelector, ...prefetched }).$assetInstance.$network.caip2.namespace)}:${String(({ ...selection.entitySelector, ...prefetched }).$assetInstance.$network.caip2.reference)}`,
			kind: String(({ ...selection.entitySelector, ...prefetched }).$assetInstance.kind),
			assetKey: String(({ ...selection.entitySelector, ...prefetched }).$assetInstance.assetKey),
			classKind: String(({ ...selection.entitySelector, ...prefetched }).classKind),
			classKey: String(({ ...selection.entitySelector, ...prefetched }).classKey),
		})
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{#if layout === EntityLayout.Summary || layout === EntityLayout.SummaryInline}
			{[String((({ ...selection.entitySelector, ...prefetched }).label) ?? ''), String((({ ...selection.entitySelector, ...prefetched }).classKey) ?? '')].filter(Boolean).join(' ') || title || 'asset class'}
		{:else}
			<ResourceBoundary resource={assetClass}>
				{#snippet Pending()}
					{[String((({ ...selection.entitySelector, ...prefetched }).label) ?? ''), String((({ ...selection.entitySelector, ...prefetched }).classKey) ?? '')].filter(Boolean).join(' ') || title || 'asset class'}
				{/snippet}

				{#snippet children(entity)}
					{[String((entity.label) ?? ''), String((entity.classKey) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Value()}
		{#if layout === EntityLayout.Summary || layout === EntityLayout.SummaryInline}
			{[String((({ ...selection.entitySelector, ...prefetched }).classKind) ?? ''), String((({ ...selection.entitySelector, ...prefetched }).classKey) ?? '')].filter(Boolean).join(' ') || [String((({ ...selection.entitySelector, ...prefetched }).label) ?? ''), String((({ ...selection.entitySelector, ...prefetched }).classKey) ?? '')].filter(Boolean).join(' ') || title || 'asset class'}
		{:else}
			<ResourceBoundary resource={assetClass}>
				{#snippet Pending()}
					{[String((({ ...selection.entitySelector, ...prefetched }).classKind) ?? ''), String((({ ...selection.entitySelector, ...prefetched }).classKey) ?? '')].filter(Boolean).join(' ') || [String((({ ...selection.entitySelector, ...prefetched }).label) ?? ''), String((({ ...selection.entitySelector, ...prefetched }).classKey) ?? '')].filter(Boolean).join(' ') || title || 'asset class'}
				{/snippet}

				{#snippet children(entity)}
					{[String((entity.classKind) ?? ''), String((entity.classKey) ?? '')].filter(Boolean).join(' ') || [String((entity.label) ?? ''), String((entity.classKey) ?? '')].filter(Boolean).join(' ') || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet HeadingAfter()}
		{#if layout === EntityLayout.Summary || layout === EntityLayout.SummaryInline}
			<span data-text="muted">
				<AssetInstanceView
					selection={select(EntityType.AssetInstance, selection.entitySelector.$assetInstance)}
					href={
						resolve('/(explore)/(networks)/network/[caip2=networkCaip2]/asset/[kind]/[assetKey]', {
							caip2: `${String(selection.entitySelector.$assetInstance.$network.caip2.namespace)}:${String(selection.entitySelector.$assetInstance.$network.caip2.reference)}`,
							kind: String(selection.entitySelector.$assetInstance.kind),
							assetKey: String(selection.entitySelector.$assetInstance.assetKey),
						})
					}
					layout={EntityLayout.Title}
					open={false}
				/>
			</span>
		{:else}
			<ResourceBoundary resource={assetClass}>
				{#snippet Pending()}
					<span data-text="muted">
						<AssetInstanceView
							selection={select(EntityType.AssetInstance, selection.entitySelector.$assetInstance)}
							href={
								resolve('/(explore)/(networks)/network/[caip2=networkCaip2]/asset/[kind]/[assetKey]', {
									caip2: `${String(selection.entitySelector.$assetInstance.$network.caip2.namespace)}:${String(selection.entitySelector.$assetInstance.$network.caip2.reference)}`,
									kind: String(selection.entitySelector.$assetInstance.kind),
									assetKey: String(selection.entitySelector.$assetInstance.assetKey),
								})
							}
							layout={EntityLayout.Title}
							open={false}
						/>
					</span>
				{/snippet}

				{#snippet children(entity)}
					<span data-text="muted">
						<AssetInstanceView
							selection={select(EntityType.AssetInstance, selection.entitySelector.$assetInstance)}
							href={
								resolve('/(explore)/(networks)/network/[caip2=networkCaip2]/asset/[kind]/[assetKey]', {
									caip2: `${String(selection.entitySelector.$assetInstance.$network.caip2.namespace)}:${String(selection.entitySelector.$assetInstance.$network.caip2.reference)}`,
									kind: String(selection.entitySelector.$assetInstance.kind),
									assetKey: String(selection.entitySelector.$assetInstance.assetKey),
								})
							}
							layout={EntityLayout.Title}
							open={false}
						/>
					</span>
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet TypeAnnotationTooltip()}
		<p>
			A reusable asset classification used to group related asset instances and objects.
		</p>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<ResourceBoundary resource={assetClass}>
				{#snippet Pending()}
					{@const slot = prefetched.slot ?? selection.entitySelector.slot}
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
					{@const slot = entity.slot ?? selection.entitySelector.slot ?? prefetched.slot}
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

			<ResourceBoundary resource={assetClass}>
				{#snippet Pending()}
					{@const partition = prefetched.partition ?? selection.entitySelector.partition}
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
					{@const partition = entity.partition ?? selection.entitySelector.partition ?? prefetched.partition}
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

			<ResourceBoundary resource={assetClass}>
				{#snippet Pending()}
					{@const series = prefetched.series ?? selection.entitySelector.series}
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
					{@const series = entity.series ?? selection.entitySelector.series ?? prefetched.series}
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
			<ResourceBoundary resource={assetClass}>
				{#snippet Pending()}
					{@const maturityMs = prefetched.maturityMs ?? selection.entitySelector.maturityMs}
					{#if maturityMs !== undefined && maturityMs !== null}
						<div>
							<dt>Maturity</dt>
							<dd>
								{String((maturityMs) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const maturityMs = entity.maturityMs ?? selection.entitySelector.maturityMs ?? prefetched.maturityMs}
					{#if maturityMs !== undefined && maturityMs !== null}
						<div>
							<dt>Maturity</dt>
							<dd>
								{String((maturityMs) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary resource={assetClass}>
				{#snippet Pending()}
					{@const valueDecimals = prefetched.valueDecimals ?? selection.entitySelector.valueDecimals}
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
					{@const valueDecimals = entity.valueDecimals ?? selection.entitySelector.valueDecimals ?? prefetched.valueDecimals}
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
		</dl>
	{/snippet}
</EntityView>
