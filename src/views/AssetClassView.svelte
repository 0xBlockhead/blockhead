<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { RegisteredEntityProxyPrefetchedData, RegisteredEntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { stringify } from 'devalue'
	import { caip2StringFromValue } from '$/lib/caip2.ts'


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
			selection: RegisteredEntityProxyResource<EntityType.AssetClass>
			prefetched?: RegisteredEntityProxyPrefetchedData<EntityType.AssetClass>
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
	const assetClass = $derived(selection(prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails ? {
		sources: selection.sources,
		fields: {
			label: true,
		},
	} : {
		sources: selection.sources,
		fields: {
			label: true,
		},
	}))
	const titleFallback = $derived([String((pendingEntity.label) ?? ''), String((pendingEntity.classKey) ?? '')].filter(Boolean).join(' ') || 'asset class')
	const viewDomId = $derived('asset-class-' + encodeURIComponent(stringify(selection.entitySelector ?? prefetched[EntityMetaKey.Selector])))


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
		{#if layout !== EntityLayout.SummaryDetails && Object.hasOwn(prefetched, 'label') && Object.hasOwn(prefetched, '$assetInstance') && prefetched.$assetInstance != null && Object.hasOwn(prefetched.$assetInstance, 'symbol') && Object.hasOwn(prefetched.$assetInstance, 'name')}
			{[String((pendingEntity.label) ?? ''), String((pendingEntity.classKey) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
		{:else}
			<ResourceBoundary resource={assetClass}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{[String((resolvedEntity.label) ?? ''), String((resolvedEntity.classKey) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Value()}
		{#if layout !== EntityLayout.SummaryDetails && Object.hasOwn(prefetched, 'label') && Object.hasOwn(prefetched, '$assetInstance') && prefetched.$assetInstance != null && Object.hasOwn(prefetched.$assetInstance, 'symbol') && Object.hasOwn(prefetched.$assetInstance, 'name')}
			{[String((pendingEntity.classKind) ?? ''), String((pendingEntity.classKey) ?? '')].filter(Boolean).join(' ') || [String((pendingEntity.label) ?? ''), String((pendingEntity.classKey) ?? '')].filter(Boolean).join(' ') || titleFallback}
		{:else}
			<ResourceBoundary resource={assetClass}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{[String((resolvedEntity.classKind) ?? ''), String((resolvedEntity.classKey) ?? '')].filter(Boolean).join(' ') || [String((resolvedEntity.label) ?? ''), String((resolvedEntity.classKey) ?? '')].filter(Boolean).join(' ') || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet HeadingAfter()}
		{#if layout !== EntityLayout.SummaryDetails && Object.hasOwn(prefetched, 'label') && Object.hasOwn(prefetched, '$assetInstance') && prefetched.$assetInstance != null && Object.hasOwn(prefetched.$assetInstance, 'symbol') && Object.hasOwn(prefetched.$assetInstance, 'name')}
			<span data-text="muted">
				<AssetInstanceView
					selection={select(EntityType.AssetInstance, selection.entitySelector.$assetInstance)}
					href={
						(
							selection.entitySelector.$assetInstance != null && 'kind' in selection.entitySelector.$assetInstance
							&& selection.entitySelector.$assetInstance.kind != null
							&& selection.entitySelector.$assetInstance != null && 'assetKey' in selection.entitySelector.$assetInstance
							&& selection.entitySelector.$assetInstance.assetKey != null
							&& selection.entitySelector.$assetInstance != null && '$network' in selection.entitySelector.$assetInstance ?
								selection.entitySelector.$assetInstance.$network != null && 'caip2' in selection.entitySelector.$assetInstance.$network
								&& selection.entitySelector.$assetInstance.$network.caip2 != null ?
									resolve('/network/[network=networkCaip2OrNetworkSlug]/asset/[kind=stringSegment]/[assetKey=stringSegment]', {
								kind: String(selection.entitySelector.$assetInstance.kind ?? ''),
								assetKey: String(selection.entitySelector.$assetInstance.assetKey ?? ''),
								network: String(caip2StringFromValue(selection.entitySelector.$assetInstance.$network.caip2) ?? ''),
							})
							:
									selection.entitySelector.$assetInstance.$network != null && 'slug' in selection.entitySelector.$assetInstance.$network
									&& selection.entitySelector.$assetInstance.$network.slug != null ?
										resolve('/network/[network=networkCaip2OrNetworkSlug]/asset/[kind=stringSegment]/[assetKey=stringSegment]', {
									kind: String(selection.entitySelector.$assetInstance.kind ?? ''),
									assetKey: String(selection.entitySelector.$assetInstance.assetKey ?? ''),
									network: String(selection.entitySelector.$assetInstance.$network.slug ?? ''),
								})
								:
									undefined
						:
								undefined
						)
					}
					layout={EntityLayout.Title}
					open={false}
				/>
			</span>
		{:else}
			<ResourceBoundary resource={assetClass}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					<span data-text="muted">
						<AssetInstanceView
							selection={select(EntityType.AssetInstance, selection.entitySelector.$assetInstance)}
							href={
								(
									selection.entitySelector.$assetInstance != null && 'kind' in selection.entitySelector.$assetInstance
									&& selection.entitySelector.$assetInstance.kind != null
									&& selection.entitySelector.$assetInstance != null && 'assetKey' in selection.entitySelector.$assetInstance
									&& selection.entitySelector.$assetInstance.assetKey != null
									&& selection.entitySelector.$assetInstance != null && '$network' in selection.entitySelector.$assetInstance ?
										selection.entitySelector.$assetInstance.$network != null && 'caip2' in selection.entitySelector.$assetInstance.$network
										&& selection.entitySelector.$assetInstance.$network.caip2 != null ?
											resolve('/network/[network=networkCaip2OrNetworkSlug]/asset/[kind=stringSegment]/[assetKey=stringSegment]', {
										kind: String(selection.entitySelector.$assetInstance.kind ?? ''),
										assetKey: String(selection.entitySelector.$assetInstance.assetKey ?? ''),
										network: String(caip2StringFromValue(selection.entitySelector.$assetInstance.$network.caip2) ?? ''),
									})
									:
											selection.entitySelector.$assetInstance.$network != null && 'slug' in selection.entitySelector.$assetInstance.$network
											&& selection.entitySelector.$assetInstance.$network.slug != null ?
												resolve('/network/[network=networkCaip2OrNetworkSlug]/asset/[kind=stringSegment]/[assetKey=stringSegment]', {
											kind: String(selection.entitySelector.$assetInstance.kind ?? ''),
											assetKey: String(selection.entitySelector.$assetInstance.assetKey ?? ''),
											network: String(selection.entitySelector.$assetInstance.$network.slug ?? ''),
										})
										:
											undefined
								:
										undefined
								)
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
			<div>
				<dt>Class kind</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									classKind: true,
								},
							})
						}
					>
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
								sources: selection.sources,
								fields: {
									classKey: true,
								},
							})
						}
					>
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
						sources: selection.sources,
						fields: {
							slot: true,
						},
					})
				}
			>
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
						sources: selection.sources,
						fields: {
							partition: true,
						},
					})
				}
			>
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
						sources: selection.sources,
						fields: {
							series: true,
						},
					})
				}
			>
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
						sources: selection.sources,
						fields: {
							maturityMs: true,
						},
					})
				}
			>
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
						sources: selection.sources,
						fields: {
							valueDecimals: true,
						},
					})
				}
			>
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
						selection={select(EntityType.AssetInstance, selection.entitySelector.$assetInstance)}
						href={
							(
								selection.entitySelector.$assetInstance != null && 'kind' in selection.entitySelector.$assetInstance
								&& selection.entitySelector.$assetInstance.kind != null
								&& selection.entitySelector.$assetInstance != null && 'assetKey' in selection.entitySelector.$assetInstance
								&& selection.entitySelector.$assetInstance.assetKey != null
								&& selection.entitySelector.$assetInstance != null && '$network' in selection.entitySelector.$assetInstance ?
									selection.entitySelector.$assetInstance.$network != null && 'caip2' in selection.entitySelector.$assetInstance.$network
									&& selection.entitySelector.$assetInstance.$network.caip2 != null ?
										resolve('/network/[network=networkCaip2OrNetworkSlug]/asset/[kind=stringSegment]/[assetKey=stringSegment]', {
									kind: String(selection.entitySelector.$assetInstance.kind ?? ''),
									assetKey: String(selection.entitySelector.$assetInstance.assetKey ?? ''),
									network: String(caip2StringFromValue(selection.entitySelector.$assetInstance.$network.caip2) ?? ''),
								})
								:
										selection.entitySelector.$assetInstance.$network != null && 'slug' in selection.entitySelector.$assetInstance.$network
										&& selection.entitySelector.$assetInstance.$network.slug != null ?
											resolve('/network/[network=networkCaip2OrNetworkSlug]/asset/[kind=stringSegment]/[assetKey=stringSegment]', {
										kind: String(selection.entitySelector.$assetInstance.kind ?? ''),
										assetKey: String(selection.entitySelector.$assetInstance.assetKey ?? ''),
										network: String(selection.entitySelector.$assetInstance.$network.slug ?? ''),
									})
									:
										undefined
							:
									undefined
							)
						}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>
		</dl>
	{/snippet}
</EntityView>
