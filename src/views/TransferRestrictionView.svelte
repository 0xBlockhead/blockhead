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
			selection: RegisteredEntityProxyResource<EntityType.TransferRestriction>
			prefetched?: RegisteredEntityProxyPrefetchedData<EntityType.TransferRestriction>
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
	const transferRestriction = $derived(selection(prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails ? {
		sources: selection.sources,
		fields: {},
	} : {
		sources: selection.sources,
	}))
	const titleFallback = 'transfer restriction'
	const viewDomId = $derived('transfer-restriction-' + encodeURIComponent(stringify(selection.entitySelector ?? prefetched[EntityMetaKey.Selector])))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TransferRestrictionCheck_TimestampsView from '$/views/TransferRestrictionCheck_TimestampsView.svelte'
	import AssetInstanceView from '$/views/AssetInstanceView.svelte'
	import RegulatedAssetProfileView from '$/views/RegulatedAssetProfileView.svelte'
</script>


<EntityView
	entityType={EntityType.TransferRestriction}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{#if layout !== EntityLayout.SummaryDetails}
			{title || titleFallback}
		{:else}
			<ResourceBoundary resource={transferRestriction}>
				{#snippet children(entity)}
					{title || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>asset instance</dt>
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

			<div>
				<dt>restriction key</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									restrictionKey: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const restrictionKey = resolvedEntity.restrictionKey}
							{#if restrictionKey !== undefined && restrictionKey !== null}
								{String((restrictionKey) ?? '')}
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

			<div>
				<dt>restriction kind</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									restrictionKind: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const restrictionKind = resolvedEntity.restrictionKind}
							{#if restrictionKind !== undefined && restrictionKind !== null}
								{String((restrictionKind) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={selection.$profile}
			>
				{#snippet children(regulatedAssetProfile)}
					{#if regulatedAssetProfile != null && regulatedAssetProfile[EntityMetaKey.Selector] != null}
						<div>
							<dt>profile</dt>
							<dd>
								<RegulatedAssetProfileView
									selection={select(EntityType.RegulatedAssetProfile, regulatedAssetProfile[EntityMetaKey.Selector])}
									prefetched={regulatedAssetProfile}
									layout={EntityLayout.Value}
									open={false}
								/>
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
							message: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const message = resolvedEntity.message}
					{#if message !== undefined && message !== null}
						<div>
							<dt>message</dt>
							<dd>
								{String((message) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{@const transferRestrictionTransferRestrictionCheckTimestampsViewChecksResource = selection.$$checks}
		<ResourceBoundary
			resource={transferRestrictionTransferRestrictionCheckTimestampsViewChecksResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
				<TransferRestrictionCheck_TimestampsView
					selection={transferRestrictionTransferRestrictionCheckTimestampsViewChecksResource}
					countResource={transferRestrictionTransferRestrictionCheckTimestampsViewChecksResource.count}
					title='checks'
					id='TransferRestrictionCheck_TimestampsView-checks'
				/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
