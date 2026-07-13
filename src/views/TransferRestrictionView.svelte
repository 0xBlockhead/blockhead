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
			selection: EntityProxyResource<typeof schema, EntityType.TransferRestriction>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.TransferRestriction>>
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
	const transferRestriction = $derived(selection({}))
	const titleFallback = $derived('transfer restriction')
	const viewDomId = $derived('transfer-restriction-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


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
		<ResourceBoundary resource={transferRestriction}>
			{#snippet Pending()}
				{title || 'transfer restriction'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>asset instance</dt>
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

			<div>
				<dt>restriction key</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									restrictionKey: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const restrictionKey = pendingEntity.restrictionKey}
							{#if restrictionKey !== undefined && restrictionKey !== null}
								{String((restrictionKey) ?? '')}
							{/if}
						{/snippet}

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

			<div>
				<dt>restriction kind</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									restrictionKind: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const restrictionKind = pendingEntity.restrictionKind}
							{#if restrictionKind !== undefined && restrictionKind !== null}
								{String((restrictionKind) ?? '')}
							{/if}
						{/snippet}

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
				{#snippet Pending()}{/snippet}

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
						fields: {
							message: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const message = pendingEntity.message}
					{#if message !== undefined && message !== null}
						<div>
							<dt>message</dt>
							<dd>
								{String((message) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

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
		{#if detailsOpen}
			<TransferRestrictionCheck_TimestampsView
				selection={
						selection.$$checks({
							count: true,
						})
					}
				title='checks'
				emptyText='No transfer restriction checks.'
				id='TransferRestrictionCheck_TimestampsView-checks'
			/>
		{/if}
	{/snippet}
</EntityView>
