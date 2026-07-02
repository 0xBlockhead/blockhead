<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { EntityProxyData, EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityProxyField } from '$/client/$proxy.svelte.ts'
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
			selection: EntityProxyResource<typeof schema, EntityType.AssetSupply_Timestamp>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.AssetSupply_Timestamp>>
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

	const assetSupplyTimestamp = $derived(selection({
		fields: {
			totalSupply: true,
			circulatingSupply: true,
			classKey: true,
			burnedSupply: true,
			methodology: true,
			$class: true,
		},
	}))
	const titleFallback = $derived([String((({ ...selection.entitySelector, ...prefetched }).supplyScopeKey) ?? '')].filter(Boolean).join(' ') || 'asset supply timestamp')
	const viewDomId = $derived('asset-supply-timestamp-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))
	// Components
	import EntityView from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import AssetClassView from '$/views/AssetClassView.svelte'
	import AssetInstanceView from '$/views/AssetInstanceView.svelte'
</script>


<EntityView
	entityType={EntityType.AssetSupply_Timestamp}
	entitySelector={selection.entitySelector}
	id={viewDomId}
	title={title ?? titleFallback}
	href={
		href ?? resolve('/(explore)/(networks)/network/[caip2=networkCaip2]/asset/[kind]/[assetKey]/supply/[supplyScopeKey]/[timestampMs=nonNegativeInteger]/[source]', {
			caip2: `${String(({ ...selection.entitySelector, ...prefetched }).$assetInstance.$network.caip2.namespace)}:${String(({ ...selection.entitySelector, ...prefetched }).$assetInstance.$network.caip2.reference)}`,
			kind: String(({ ...selection.entitySelector, ...prefetched }).$assetInstance.kind),
			assetKey: String(({ ...selection.entitySelector, ...prefetched }).$assetInstance.assetKey),
			supplyScopeKey: String(({ ...selection.entitySelector, ...prefetched }).supplyScopeKey),
			timestampMs: String(({ ...selection.entitySelector, ...prefetched }).timestampMs),
			source: String(({ ...selection.entitySelector, ...prefetched }).source),
		})
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{#if layout === EntityLayout.Summary || layout === EntityLayout.SummaryInline}
			{[String((({ ...selection.entitySelector, ...prefetched }).supplyScopeKey) ?? '')].filter(Boolean).join(' ') || title || 'asset supply timestamp'}
		{:else}
			<ResourceBoundary resource={assetSupplyTimestamp}>
				{#snippet Pending()}
					{[String((({ ...selection.entitySelector, ...prefetched }).supplyScopeKey) ?? '')].filter(Boolean).join(' ') || title || 'asset supply timestamp'}
				{/snippet}

				{#snippet children(entity)}
					{[String((entity.supplyScopeKey) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Value()}
		{#if layout === EntityLayout.Summary || layout === EntityLayout.SummaryInline}
			{[String((({ ...selection.entitySelector, ...prefetched }).totalSupply) ?? ''), String((({ ...selection.entitySelector, ...prefetched }).circulatingSupply) ?? '')].filter(Boolean).join(' ') || [String((({ ...selection.entitySelector, ...prefetched }).supplyScopeKey) ?? '')].filter(Boolean).join(' ') || title || 'asset supply timestamp'}
		{:else}
			<ResourceBoundary resource={assetSupplyTimestamp}>
				{#snippet Pending()}
					{[String((({ ...selection.entitySelector, ...prefetched }).totalSupply) ?? ''), String((({ ...selection.entitySelector, ...prefetched }).circulatingSupply) ?? '')].filter(Boolean).join(' ') || [String((({ ...selection.entitySelector, ...prefetched }).supplyScopeKey) ?? '')].filter(Boolean).join(' ') || title || 'asset supply timestamp'}
				{/snippet}

				{#snippet children(entity)}
					{[String((entity.totalSupply) ?? ''), String((entity.circulatingSupply) ?? '')].filter(Boolean).join(' ') || [String((entity.supplyScopeKey) ?? '')].filter(Boolean).join(' ') || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet HeadingAfter()}
		{#if layout === EntityLayout.Summary || layout === EntityLayout.SummaryInline}
			{@const source0 = prefetched.source}
			{#if source0 !== undefined && source0 !== null}
				<span data-text="muted">
					{String((source0) ?? '')}
				</span>
			{/if}
		{:else}
			<ResourceBoundary resource={assetSupplyTimestamp}>
				{#snippet Pending()}
					{@const source0 = prefetched.source}
					{#if source0 !== undefined && source0 !== null}
						<span data-text="muted">
							{String((source0) ?? '')}
						</span>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const source0 = entity.source}
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
			<ResourceBoundary resource={assetSupplyTimestamp}>
				{#snippet Pending()}
					{@const classKey = prefetched.classKey ?? selection.entitySelector.classKey}
					{#if classKey !== undefined && classKey !== null}
						<div>
							<dt>Class key</dt>
							<dd>
								{String((classKey) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const classKey = entity.classKey ?? selection.entitySelector.classKey ?? prefetched.classKey}
					{#if classKey !== undefined && classKey !== null}
						<div>
							<dt>Class key</dt>
							<dd>
								{String((classKey) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<div>
				<dt>Timestamp</dt>
				<dd>
					<ResourceBoundary resource={assetSupplyTimestamp}>
						{#snippet Pending()}
							{@const timestampMs = prefetched.timestampMs ?? selection.entitySelector.timestampMs}
							{#if timestampMs !== undefined && timestampMs !== null}
								{String((timestampMs) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const timestampMs = entity.timestampMs ?? selection.entitySelector.timestampMs ?? prefetched.timestampMs}
							{#if timestampMs !== undefined && timestampMs !== null}
								{String((timestampMs) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary resource={assetSupplyTimestamp}>
				{#snippet Pending()}
					{@const burnedSupply = prefetched.burnedSupply ?? selection.entitySelector.burnedSupply}
					{#if burnedSupply !== undefined && burnedSupply !== null}
						<div>
							<dt>Burned supply</dt>
							<dd>
								{String((burnedSupply) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const burnedSupply = entity.burnedSupply ?? selection.entitySelector.burnedSupply ?? prefetched.burnedSupply}
					{#if burnedSupply !== undefined && burnedSupply !== null}
						<div>
							<dt>Burned supply</dt>
							<dd>
								{String((burnedSupply) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary resource={assetSupplyTimestamp}>
				{#snippet Pending()}
					{@const methodology = prefetched.methodology ?? selection.entitySelector.methodology}
					{#if methodology !== undefined && methodology !== null}
						<div>
							<dt>Methodology</dt>
							<dd>
								{String((methodology) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const methodology = entity.methodology ?? selection.entitySelector.methodology ?? prefetched.methodology}
					{#if methodology !== undefined && methodology !== null}
						<div>
							<dt>Methodology</dt>
							<dd>
								{String((methodology) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection[EntityProxyField]<EntityType.AssetClass, false>('$class')}
			>
				{#snippet children(assetClass)}
					{#if assetClass != null}
						<div>
							<dt>Class</dt>
							<dd>
								<AssetClassView
									selection={select(EntityType.AssetClass, assetClass.entitySelector)}
									prefetched={assetClass}
									href={
										resolve('/(explore)/(networks)/network/[caip2=networkCaip2]/asset/[kind]/[assetKey]/class/[classKind]/[classKey]', {
											caip2: `${String(assetClass.entitySelector.$assetInstance.$network.caip2.namespace)}:${String(assetClass.entitySelector.$assetInstance.$network.caip2.reference)}`,
											kind: String(assetClass.entitySelector.$assetInstance.kind),
											assetKey: String(assetClass.entitySelector.$assetInstance.assetKey),
											classKind: String(assetClass.entitySelector.classKind),
											classKey: String(assetClass.entitySelector.classKey),
										})
									}
									layout={EntityLayout.Title}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<div>
				<dt>Asset instance</dt>
				<dd>
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
				</dd>
			</div>
		</dl>
	{/snippet}
</EntityView>
