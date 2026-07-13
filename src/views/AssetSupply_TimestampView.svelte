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
	const titleFallback = $derived([String((pendingEntity.supplyScopeKey) ?? '')].filter(Boolean).join(' ') || 'asset supply timestamp')
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
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={assetSupplyTimestamp}>
			{#snippet Pending()}
				{[String((pendingEntity.supplyScopeKey) ?? '')].filter(Boolean).join(' ') || title || 'asset supply timestamp'}
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
				{[String((pendingEntity.totalSupply) ?? ''), String((pendingEntity.circulatingSupply) ?? '')].filter(Boolean).join(' ') || [String((pendingEntity.supplyScopeKey) ?? '')].filter(Boolean).join(' ') || title || 'asset supply timestamp'}
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
				{@const source0 = pendingEntity.source}
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
							{@const supplyScopeKey = pendingEntity.supplyScopeKey}
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
					{@const classKey = pendingEntity.classKey}
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
							{@const timestampMs = pendingEntity.timestampMs}
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
					{@const totalSupply = pendingEntity.totalSupply}
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
					{@const circulatingSupply = pendingEntity.circulatingSupply}
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
					{@const burnedSupply = pendingEntity.burnedSupply}
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
					{@const methodology = pendingEntity.methodology}
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
				resource={selection.$class}
			>
				{#snippet Pending()}{/snippet}

				{#snippet children(assetClass)}
					{#if assetClass != null && assetClass[EntityMetaKey.Selector] != null}
						<div>
							<dt>Class</dt>
							<dd>
								<AssetClassView
									selection={select(EntityType.AssetClass, assetClass[EntityMetaKey.Selector])}
									prefetched={assetClass}
									layout={EntityLayout.Value}
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
						selection={select(EntityType.AssetInstance, selection.entitySelector.$assetInstance, {})}
						href={
							(selection.entitySelector.$assetInstance.$network !== undefined && selection.entitySelector.$assetInstance.$network.slug !== undefined && selection.entitySelector.$assetInstance.kind !== undefined && selection.entitySelector.$assetInstance.assetKey !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/asset/[kind=stringSegment]/[assetKey=stringSegment]', {
								network: String(selection.entitySelector.$assetInstance.$network.slug ?? ''),
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
