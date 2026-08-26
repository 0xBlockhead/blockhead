<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { untrack } from 'svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2StringFromValue } from '$/lib/caip2.ts'


	// Context
	import { getAppClient } from '$/routes/applicationClient.ts'


	const select = getAppClient().select

	// State
	let {
		selection,
		title,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: Omit<EntitySelectionViewProps<EntityType.AssetObject>, 'prefetched'> = $props()

	const assetInstance = $derived(selection.entitySelector.$assetInstance)
	const assetObject = $derived(selection({
		fields: {
			objectKind: true,
			tokenId: true,
		},
	}))
	const titleFallback = $derived(selection.entitySelector.objectKey || 'asset object')


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import UsageRight_TimestampsView from '$/views/UsageRight_TimestampsView.svelte'
	import AssetInstanceView from '$/views/AssetInstanceView.svelte'
	import AssetClassView from '$/views/AssetClassView.svelte'
</script>


<EntityView
	entityType={EntityType.AssetObject}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	href={
		href === undefined ?
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/asset/[kind=stringSegment]/[assetKey=stringSegment]/(assetInstance)/object/[objectKey=stringSegment]',
				{
					network: (
						'caip2' in assetInstance.$network ?
							caip2StringFromValue(assetInstance.$network.caip2)
						:
							assetInstance.$network.slug
					),
					kind: assetInstance.kind,
					assetKey: assetInstance.assetKey,
					objectKey: selection.entitySelector.objectKey,
				}
			)
		:
			href ?? undefined
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Value()}
		<ResourceBoundary resource={assetObject}>
			{#snippet children(entity)}
				{[entity.objectKind, (entity.tokenId ?? '')].filter(Boolean).join(' ') || selection.entitySelector.objectKey || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<span data-text="muted">
			<AssetInstanceView
				selection={select(EntityType.AssetInstance, selection.entitySelector.$assetInstance)}
				layout={EntityLayout.Title}
			/>
		</span>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>asset instance</dt>
				<dd>
					<AssetInstanceView
						selection={select(EntityType.AssetInstance, selection.entitySelector.$assetInstance)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<div>
				<dt>object key</dt>
				<dd>
					{selection.entitySelector.objectKey}
				</dd>
			</div>

			<div>
				<dt>object kind</dt>
				<dd>
					<ResourceBoundary
						resource={assetObject}
					>
						{#snippet children(entity)}
							{entity.objectKind}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={selection.$class}
			>
				{#snippet children(assetClass)}
					{#if assetClass != null}
						{@const assetClassInitial = untrack(() => assetClass)}
						<div>
							<dt>class</dt>
							<dd>
								<AssetClassView
									selection={select(EntityType.AssetClass, (assetClass ?? assetClassInitial)[EntityMetaKey.Selector])}
									prefetched={assetClass ?? assetClassInitial}
									layout={EntityLayout.Value}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={assetObject}
			>
				{#snippet children(entity)}
					{@const tokenId = entity.tokenId}
					{#if tokenId != null}
						<div>
							<dt>Token ID</dt>
							<dd>
								{tokenId}
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
				{#snippet children(entity)}
					{@const slot = entity.slot}
					{#if slot != null}
						<div>
							<dt>slot</dt>
							<dd>
								{slot}
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
				{#snippet children(entity)}
					{@const metadataUri = entity.metadataUri}
					{#if metadataUri != null}
						<div>
							<dt>metadata URI</dt>
							<dd>
								<a
									href={metadataUri}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={metadataUri} />
								</a>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details()}
		{@const usageRightsResource = selection.$$usageRights}
		<ResourceBoundary
			resource={usageRightsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<UsageRight_TimestampsView
						selection={usageRightsResource}
						countResource={usageRightsResource.count}
						title='usage rights'
						id='usage-rights'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
