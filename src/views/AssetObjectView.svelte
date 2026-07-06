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
			selection: EntityProxyResource<typeof schema, EntityType.AssetObject>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.AssetObject>>
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
		fields: {
			objectKind: true,
			tokenId: true,
		},
	}))
	const titleFallback = $derived([String((selection.entitySelector.objectKey ?? prefetched.objectKey) ?? '')].filter(Boolean).join(' ') || 'asset object')
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
		<ResourceBoundary resource={assetObject}>
			{#snippet Pending()}
				{[String((selection.entitySelector.objectKey ?? prefetched.objectKey) ?? '')].filter(Boolean).join(' ') || title || 'asset object'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.objectKey) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={assetObject}>
			{#snippet Pending()}
				{[String((prefetched.objectKind) ?? ''), String((prefetched.tokenId) ?? '')].filter(Boolean).join(' ') || [String((selection.entitySelector.objectKey ?? prefetched.objectKey) ?? '')].filter(Boolean).join(' ') || title || 'asset object'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.objectKind) ?? ''), String((resolvedEntity.tokenId) ?? '')].filter(Boolean).join(' ') || [String((resolvedEntity.objectKey) ?? '')].filter(Boolean).join(' ') || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={assetObject}>
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
			A distinct asset object or item within an asset instance, such as an NFT or uniquely addressable collectible.
		</p>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>asset instance</dt>
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
								fields: {
									objectKey: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const objectKey = selection.entitySelector.objectKey ?? prefetched.objectKey}
							{#if objectKey !== undefined && objectKey !== null}
								{String((objectKey) ?? '')}
							{/if}
						{/snippet}

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
								fields: {
									objectKind: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const objectKind = prefetched.objectKind}
							{#if objectKind !== undefined && objectKind !== null}
								{String((objectKind) ?? '')}
							{/if}
						{/snippet}

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
				resource={selection[EntityProxyField]<EntityType.AssetClass, false>('$class')}
			>
				{#snippet children(assetClass)}
					{#if assetClass != null && assetClass[EntityMetaKey.Selector] != null}
						<div>
							<dt>class</dt>
							<dd>
								<AssetClassView
									selection={select(EntityType.AssetClass, assetClass[EntityMetaKey.Selector])}
									prefetched={assetClass}
									href={
										(assetClass[EntityMetaKey.Selector].$assetInstance !== undefined && assetClass[EntityMetaKey.Selector].$assetInstance.$network !== undefined && assetClass[EntityMetaKey.Selector].$assetInstance.$network.caip2 !== undefined && assetClass[EntityMetaKey.Selector].$assetInstance.$network.caip2.namespace !== undefined && assetClass[EntityMetaKey.Selector].$assetInstance !== undefined && assetClass[EntityMetaKey.Selector].$assetInstance.$network !== undefined && assetClass[EntityMetaKey.Selector].$assetInstance.$network.caip2 !== undefined && assetClass[EntityMetaKey.Selector].$assetInstance.$network.caip2.reference !== undefined && assetClass[EntityMetaKey.Selector].$assetInstance !== undefined && assetClass[EntityMetaKey.Selector].$assetInstance.kind !== undefined && assetClass[EntityMetaKey.Selector].$assetInstance !== undefined && assetClass[EntityMetaKey.Selector].$assetInstance.assetKey !== undefined && assetClass[EntityMetaKey.Selector].classKind !== undefined && assetClass[EntityMetaKey.Selector].classKey !== undefined ? resolve('/(explore)/(networks)/network/[caip2=networkCaip2]/asset/[kind]/[assetKey]/class/[classKind]/[classKey]', {
											caip2: `${String(assetClass[EntityMetaKey.Selector].$assetInstance.$network.caip2.namespace ?? '')}:${String(assetClass[EntityMetaKey.Selector].$assetInstance.$network.caip2.reference ?? '')}`,
											kind: String(assetClass[EntityMetaKey.Selector].$assetInstance.kind ?? ''),
											assetKey: String(assetClass[EntityMetaKey.Selector].$assetInstance.assetKey ?? ''),
											classKind: String(assetClass[EntityMetaKey.Selector].classKind ?? ''),
											classKey: String(assetClass[EntityMetaKey.Selector].classKey ?? ''),
										}) : undefined)
									}
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
						fields: {
							tokenId: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const tokenId = prefetched.tokenId}
					{#if tokenId !== undefined && tokenId !== null}
						<div>
							<dt>Token ID</dt>
							<dd>
								{String((tokenId) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

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
							<dt>slot</dt>
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
						fields: {
							metadataUri: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const metadataUri = prefetched.metadataUri}
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
				selection={selection[EntityProxyField]<EntityType.UsageRight_Timestamp>('$$usageRights')}
				title='usage rights'
				emptyText='No usage right observations.'
				id='UsageRight_TimestampsView-$$usageRights'
			/>
		{/if}
	{/snippet}
</EntityView>
