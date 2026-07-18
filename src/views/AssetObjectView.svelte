<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { RegisteredEntityProxyData, RegisteredEntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
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
			selection: RegisteredEntityProxyResource<EntityType.AssetObject>
			prefetched?: Partial<RegisteredEntityProxyData<EntityType.AssetObject>>
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
	const assetObject = $derived(selection({
		sources: selection.sources,
		fields: {
			objectKind: true,
			tokenId: true,
		},
	}))
	const titleFallback = $derived([String((pendingEntity.objectKey) ?? '')].filter(Boolean).join(' ') || 'asset object')
	const viewDomId = $derived('asset-object-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import UsageRight_TimestampsView from '$/views/UsageRight_TimestampsView.svelte'
	import AssetInstanceView from '$/views/AssetInstanceView.svelte'
	import AssetClassView from '$/views/AssetClassView.svelte'
</script>


<EntityView
	entityType={EntityType.AssetObject}
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
			{[String((pendingEntity.objectKey) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
		{:else}
			<ResourceBoundary resource={assetObject}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{[String((resolvedEntity.objectKey) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Value()}
		{#if prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails}
			{[String((pendingEntity.objectKind) ?? ''), String((pendingEntity.tokenId) ?? '')].filter(Boolean).join(' ') || [String((pendingEntity.objectKey) ?? '')].filter(Boolean).join(' ') || titleFallback}
		{:else}
			<ResourceBoundary resource={assetObject}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{[String((resolvedEntity.objectKind) ?? ''), String((resolvedEntity.tokenId) ?? '')].filter(Boolean).join(' ') || [String((resolvedEntity.objectKey) ?? '')].filter(Boolean).join(' ') || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet HeadingAfter()}
		{#if prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails}
			<span data-text="muted">
				<AssetInstanceView
					selection={select(EntityType.AssetInstance, selection.entitySelector.$assetInstance)}
					href={
						(selection.entitySelector.$assetInstance.kind !== undefined && selection.entitySelector.$assetInstance.assetKey !== undefined && selection.entitySelector.$assetInstance.$network !== undefined && selection.entitySelector.$assetInstance.$network.caip2 !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/asset/[kind=stringSegment]/[assetKey=stringSegment]', {
							kind: String(selection.entitySelector.$assetInstance.kind ?? ''),
							assetKey: String(selection.entitySelector.$assetInstance.assetKey ?? ''),
							network: String(caip2StringFromValue(selection.entitySelector.$assetInstance.$network.caip2) ?? ''),
						}) : selection.entitySelector.$assetInstance.kind !== undefined && selection.entitySelector.$assetInstance.assetKey !== undefined && selection.entitySelector.$assetInstance.$network !== undefined && selection.entitySelector.$assetInstance.$network.slug !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/asset/[kind=stringSegment]/[assetKey=stringSegment]', {
							kind: String(selection.entitySelector.$assetInstance.kind ?? ''),
							assetKey: String(selection.entitySelector.$assetInstance.assetKey ?? ''),
							network: String(selection.entitySelector.$assetInstance.$network.slug ?? ''),
						}) : undefined)
					}
					layout={EntityLayout.Title}
					open={false}
				/>
			</span>
		{:else}
			<ResourceBoundary resource={assetObject}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					<span data-text="muted">
						<AssetInstanceView
							selection={select(EntityType.AssetInstance, selection.entitySelector.$assetInstance)}
							href={
								(selection.entitySelector.$assetInstance.kind !== undefined && selection.entitySelector.$assetInstance.assetKey !== undefined && selection.entitySelector.$assetInstance.$network !== undefined && selection.entitySelector.$assetInstance.$network.caip2 !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/asset/[kind=stringSegment]/[assetKey=stringSegment]', {
									kind: String(selection.entitySelector.$assetInstance.kind ?? ''),
									assetKey: String(selection.entitySelector.$assetInstance.assetKey ?? ''),
									network: String(caip2StringFromValue(selection.entitySelector.$assetInstance.$network.caip2) ?? ''),
								}) : selection.entitySelector.$assetInstance.kind !== undefined && selection.entitySelector.$assetInstance.assetKey !== undefined && selection.entitySelector.$assetInstance.$network !== undefined && selection.entitySelector.$assetInstance.$network.slug !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/asset/[kind=stringSegment]/[assetKey=stringSegment]', {
									kind: String(selection.entitySelector.$assetInstance.kind ?? ''),
									assetKey: String(selection.entitySelector.$assetInstance.assetKey ?? ''),
									network: String(selection.entitySelector.$assetInstance.$network.slug ?? ''),
								}) : undefined)
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
			A distinct asset object or item within an asset instance, such as an NFT or uniquely addressable collectible.
		</p>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>asset instance</dt>
				<dd>
					<AssetInstanceView
						selection={select(EntityType.AssetInstance, selection.entitySelector.$assetInstance, {})}
						href={
							(selection.entitySelector.$assetInstance.kind !== undefined && selection.entitySelector.$assetInstance.assetKey !== undefined && selection.entitySelector.$assetInstance.$network !== undefined && selection.entitySelector.$assetInstance.$network.caip2 !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/asset/[kind=stringSegment]/[assetKey=stringSegment]', {
								kind: String(selection.entitySelector.$assetInstance.kind ?? ''),
								assetKey: String(selection.entitySelector.$assetInstance.assetKey ?? ''),
								network: String(caip2StringFromValue(selection.entitySelector.$assetInstance.$network.caip2) ?? ''),
							}) : selection.entitySelector.$assetInstance.kind !== undefined && selection.entitySelector.$assetInstance.assetKey !== undefined && selection.entitySelector.$assetInstance.$network !== undefined && selection.entitySelector.$assetInstance.$network.slug !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/asset/[kind=stringSegment]/[assetKey=stringSegment]', {
								kind: String(selection.entitySelector.$assetInstance.kind ?? ''),
								assetKey: String(selection.entitySelector.$assetInstance.assetKey ?? ''),
								network: String(selection.entitySelector.$assetInstance.$network.slug ?? ''),
							}) : undefined)
						}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>object key</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									objectKey: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const objectKey = resolvedEntity.objectKey}
							{#if objectKey !== undefined && objectKey !== null}
								{String((objectKey) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>object kind</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									objectKind: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const objectKind = resolvedEntity.objectKind}
							{#if objectKind !== undefined && objectKind !== null}
								{String((objectKind) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={selection.$class}
			>
				{#snippet children(assetClass)}
					{#if assetClass != null && assetClass[EntityMetaKey.Selector] != null}
						<div>
							<dt>class</dt>
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
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					selection({
						sources: selection.sources,
						fields: {
							tokenId: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const tokenId = resolvedEntity.tokenId}
					{#if tokenId !== undefined && tokenId !== null}
						<div>
							<dt>Token ID</dt>
							<dd>
								{String((tokenId) ?? '')}
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
							<dt>slot</dt>
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
							metadataUri: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const metadataUri = resolvedEntity.metadataUri}
					{#if metadataUri !== undefined && metadataUri !== null}
						<div>
							<dt>metadata URI</dt>
							<dd>
								<svelte:element
									this={'a'}
									href={String(metadataUri)}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={String(metadataUri)} />
								</svelte:element>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{#if detailsOpen}
			<UsageRight_TimestampsView
				selection={
						selection.$$usageRights({
							count: true,
						})
					}
				title='usage rights'
				emptyText='No usage right observations.'
				id='UsageRight_TimestampsView-usage-rights'
			/>
		{/if}
	{/snippet}
</EntityView>
