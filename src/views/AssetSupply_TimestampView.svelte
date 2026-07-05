<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
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

	const pendingEntity = $derived(({ ...prefetched[EntityMetaKey.Selector], ...selection.entitySelector, ...prefetched }))
	const assetSupplyTimestamp = $derived(selection({
		fields: {
			totalSupply: true,
			circulatingSupply: true,
		},
	}))
	const titleFallback = $derived([String((selection.entitySelector.supplyScopeKey ?? prefetched.supplyScopeKey) ?? '')].filter(Boolean).join(' ') || 'asset supply timestamp')
	const viewDomId = $derived('asset-supply-timestamp-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))
	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import AssetClassView from '$/views/AssetClassView.svelte'
	import AssetInstanceView from '$/views/AssetInstanceView.svelte'
</script>


<EntityView
	entityType={EntityType.AssetSupply_Timestamp}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	href={
		href ?? (pendingEntity.$assetInstance !== undefined && pendingEntity.$assetInstance.$network !== undefined && pendingEntity.$assetInstance.$network.caip2 !== undefined && pendingEntity.$assetInstance.$network.caip2.namespace !== undefined && pendingEntity.$assetInstance !== undefined && pendingEntity.$assetInstance.$network !== undefined && pendingEntity.$assetInstance.$network.caip2 !== undefined && pendingEntity.$assetInstance.$network.caip2.reference !== undefined && pendingEntity.$assetInstance !== undefined && pendingEntity.$assetInstance.kind !== undefined && pendingEntity.$assetInstance !== undefined && pendingEntity.$assetInstance.assetKey !== undefined && pendingEntity.supplyScopeKey !== undefined && pendingEntity.timestampMs !== undefined && pendingEntity.source !== undefined ? resolve('/(explore)/(networks)/network/[caip2=networkCaip2]/asset/[kind]/[assetKey]/supply/[supplyScopeKey]/[timestampMs=nonNegativeInteger]/[source]', {
			caip2: `${String(pendingEntity.$assetInstance.$network.caip2.namespace ?? '')}:${String(pendingEntity.$assetInstance.$network.caip2.reference ?? '')}`,
			kind: String(pendingEntity.$assetInstance.kind ?? ''),
			assetKey: String(pendingEntity.$assetInstance.assetKey ?? ''),
			supplyScopeKey: String(pendingEntity.supplyScopeKey ?? ''),
			timestampMs: String(pendingEntity.timestampMs ?? ''),
			source: String(pendingEntity.source ?? ''),
		}) : undefined)
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={assetSupplyTimestamp}>
			{#snippet Pending()}
				{[String((selection.entitySelector.supplyScopeKey ?? prefetched.supplyScopeKey) ?? '')].filter(Boolean).join(' ') || title || 'asset supply timestamp'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.supplyScopeKey) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={assetSupplyTimestamp}>
			{#snippet Pending()}
				{[String((prefetched.totalSupply) ?? ''), String((prefetched.circulatingSupply) ?? '')].filter(Boolean).join(' ') || [String((selection.entitySelector.supplyScopeKey ?? prefetched.supplyScopeKey) ?? '')].filter(Boolean).join(' ') || title || 'asset supply timestamp'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.totalSupply) ?? ''), String((resolvedEntity.circulatingSupply) ?? '')].filter(Boolean).join(' ') || [String((resolvedEntity.supplyScopeKey) ?? '')].filter(Boolean).join(' ') || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={assetSupplyTimestamp}>
			{#snippet Pending()}
				{@const source0 = selection.entitySelector.source ?? prefetched.source}
				{#if source0 !== undefined && source0 !== null}
					<span data-text="muted">
						{String((source0) ?? '')}
					</span>
				{/if}
			{/snippet}

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
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Supply scope key</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									supplyScopeKey: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const supplyScopeKey = selection.entitySelector.supplyScopeKey ?? prefetched.supplyScopeKey}
							{#if supplyScopeKey !== undefined && supplyScopeKey !== null}
								{String((supplyScopeKey) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const supplyScopeKey = resolvedEntity.supplyScopeKey}
							{#if supplyScopeKey !== undefined && supplyScopeKey !== null}
								{String((supplyScopeKey) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

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
					{@const classKey = prefetched.classKey}
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
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const classKey = resolvedEntity.classKey}
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
					<ResourceBoundary
						resource={
							selection({
								fields: {
									timestampMs: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const timestampMs = selection.entitySelector.timestampMs ?? prefetched.timestampMs}
							{#if timestampMs !== undefined && timestampMs !== null}
								<Timestamp timestamp={Number(timestampMs)} />
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const timestampMs = resolvedEntity.timestampMs}
							{#if timestampMs !== undefined && timestampMs !== null}
								<Timestamp timestamp={Number(timestampMs)} />
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
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					selection({
						fields: {
							totalSupply: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const totalSupply = prefetched.totalSupply}
					{#if totalSupply !== undefined && totalSupply !== null}
						<div>
							<dt>Total supply</dt>
							<dd>
								{String((totalSupply) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const totalSupply = resolvedEntity.totalSupply}
					{#if totalSupply !== undefined && totalSupply !== null}
						<div>
							<dt>Total supply</dt>
							<dd>
								{String((totalSupply) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							circulatingSupply: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const circulatingSupply = prefetched.circulatingSupply}
					{#if circulatingSupply !== undefined && circulatingSupply !== null}
						<div>
							<dt>Circulating supply</dt>
							<dd>
								{String((circulatingSupply) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const circulatingSupply = resolvedEntity.circulatingSupply}
					{#if circulatingSupply !== undefined && circulatingSupply !== null}
						<div>
							<dt>Circulating supply</dt>
							<dd>
								{String((circulatingSupply) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							burnedSupply: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const burnedSupply = prefetched.burnedSupply}
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
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const burnedSupply = resolvedEntity.burnedSupply}
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

			<ResourceBoundary
				resource={
					selection({
						fields: {
							methodology: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const methodology = prefetched.methodology}
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
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const methodology = resolvedEntity.methodology}
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
					{#if assetClass != null && assetClass[EntityMetaKey.Selector] != null}
						<div>
							<dt>Class</dt>
							<dd>
								<AssetClassView
									selection={select(EntityType.AssetClass, assetClass[EntityMetaKey.Selector])}
									prefetched={assetClass}
									href={
										(({ ...assetClass[EntityMetaKey.Selector], ...assetClass }).$assetInstance !== undefined && ({ ...assetClass[EntityMetaKey.Selector], ...assetClass }).$assetInstance.$network !== undefined && ({ ...assetClass[EntityMetaKey.Selector], ...assetClass }).$assetInstance.$network.caip2 !== undefined && ({ ...assetClass[EntityMetaKey.Selector], ...assetClass }).$assetInstance.$network.caip2.namespace !== undefined && ({ ...assetClass[EntityMetaKey.Selector], ...assetClass }).$assetInstance !== undefined && ({ ...assetClass[EntityMetaKey.Selector], ...assetClass }).$assetInstance.$network !== undefined && ({ ...assetClass[EntityMetaKey.Selector], ...assetClass }).$assetInstance.$network.caip2 !== undefined && ({ ...assetClass[EntityMetaKey.Selector], ...assetClass }).$assetInstance.$network.caip2.reference !== undefined && ({ ...assetClass[EntityMetaKey.Selector], ...assetClass }).$assetInstance !== undefined && ({ ...assetClass[EntityMetaKey.Selector], ...assetClass }).$assetInstance.kind !== undefined && ({ ...assetClass[EntityMetaKey.Selector], ...assetClass }).$assetInstance !== undefined && ({ ...assetClass[EntityMetaKey.Selector], ...assetClass }).$assetInstance.assetKey !== undefined && ({ ...assetClass[EntityMetaKey.Selector], ...assetClass }).classKind !== undefined && ({ ...assetClass[EntityMetaKey.Selector], ...assetClass }).classKey !== undefined ? resolve('/(explore)/(networks)/network/[caip2=networkCaip2]/asset/[kind]/[assetKey]/class/[classKind]/[classKey]', {
											caip2: `${String(({ ...assetClass[EntityMetaKey.Selector], ...assetClass }).$assetInstance.$network.caip2.namespace ?? '')}:${String(({ ...assetClass[EntityMetaKey.Selector], ...assetClass }).$assetInstance.$network.caip2.reference ?? '')}`,
											kind: String(({ ...assetClass[EntityMetaKey.Selector], ...assetClass }).$assetInstance.kind ?? ''),
											assetKey: String(({ ...assetClass[EntityMetaKey.Selector], ...assetClass }).$assetInstance.assetKey ?? ''),
											classKind: String(({ ...assetClass[EntityMetaKey.Selector], ...assetClass }).classKind ?? ''),
											classKey: String(({ ...assetClass[EntityMetaKey.Selector], ...assetClass }).classKey ?? ''),
										}) : undefined)
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
							(selection.entitySelector.$assetInstance.$network !== undefined && selection.entitySelector.$assetInstance.$network.caip2 !== undefined && selection.entitySelector.$assetInstance.$network.caip2.namespace !== undefined && selection.entitySelector.$assetInstance.$network !== undefined && selection.entitySelector.$assetInstance.$network.caip2 !== undefined && selection.entitySelector.$assetInstance.$network.caip2.reference !== undefined && selection.entitySelector.$assetInstance.kind !== undefined && selection.entitySelector.$assetInstance.assetKey !== undefined ? resolve('/(explore)/(networks)/network/[caip2=networkCaip2]/asset/[kind]/[assetKey]', {
								caip2: `${String(selection.entitySelector.$assetInstance.$network.caip2.namespace ?? '')}:${String(selection.entitySelector.$assetInstance.$network.caip2.reference ?? '')}`,
								kind: String(selection.entitySelector.$assetInstance.kind ?? ''),
								assetKey: String(selection.entitySelector.$assetInstance.assetKey ?? ''),
							}) : undefined)
						}
						layout={EntityLayout.Title}
						open={false}
					/>
				</dd>
			</div>
		</dl>
	{/snippet}
</EntityView>
