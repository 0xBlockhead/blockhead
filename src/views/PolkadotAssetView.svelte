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
			selection: EntityProxyResource<typeof schema, EntityType.PolkadotAsset>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.PolkadotAsset>>
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
	const polkadotAsset = $derived(selection({}))
	const titleFallback = $derived([String((pendingEntity.assetId) ?? '')].filter(Boolean).join(' ') || 'Polkadot asset')
	const viewDomId = $derived('polkadot-asset-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import PolkadotAsset_TimestampsView from '$/views/PolkadotAsset_TimestampsView.svelte'
	import PolkadotAssetBalance_TimestampsView from '$/views/PolkadotAssetBalance_TimestampsView.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
</script>


<EntityView
	entityType={EntityType.PolkadotAsset}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={polkadotAsset}>
			{#snippet Pending()}
				{[String((pendingEntity.assetId) ?? '')].filter(Boolean).join(' ') || title || 'Polkadot asset'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.assetId) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={polkadotAsset}>
			{#snippet Pending()}
				{[String((pendingEntity.assetKind) ?? '')].filter(Boolean).join(' ') || [String((pendingEntity.assetId) ?? '')].filter(Boolean).join(' ') || title || 'Polkadot asset'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.assetKind) ?? '')].filter(Boolean).join(' ') || [String((resolvedEntity.assetId) ?? '')].filter(Boolean).join(' ') || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={polkadotAsset}>
			{#snippet Pending()}
				<span data-text="muted">
					<NetworkView
						selection={select(EntityType.Network, selection.entitySelector.$network)}
						href={
							(selection.entitySelector.$network.caip2 !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]', {
								network: String(caip2StringFromValue(selection.entitySelector.$network.caip2) ?? ''),
							}) : selection.entitySelector.$network.slug !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]', {
								network: String(selection.entitySelector.$network.slug ?? ''),
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
					<NetworkView
						selection={select(EntityType.Network, selection.entitySelector.$network)}
						href={
							(selection.entitySelector.$network.caip2 !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]', {
								network: String(caip2StringFromValue(selection.entitySelector.$network.caip2) ?? ''),
							}) : selection.entitySelector.$network.slug !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]', {
								network: String(selection.entitySelector.$network.slug ?? ''),
							}) : undefined)
						}
						layout={EntityLayout.Title}
						open={false}
					/>
				</span>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Network</dt>
				<dd>
					<NetworkView
						selection={select(EntityType.Network, selection.entitySelector.$network, {})}
						href={
							(selection.entitySelector.$network.caip2 !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]', {
								network: String(caip2StringFromValue(selection.entitySelector.$network.caip2) ?? ''),
							}) : selection.entitySelector.$network.slug !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]', {
								network: String(selection.entitySelector.$network.slug ?? ''),
							}) : undefined)
						}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>Asset kind</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									assetKind: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const assetKind = pendingEntity.assetKind}
							{#if assetKind !== undefined && assetKind !== null}
								{String((assetKind) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const assetKind = resolvedEntity.assetKind}
							{#if assetKind !== undefined && assetKind !== null}
								{String((assetKind) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Asset ID</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									assetId: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const assetId = pendingEntity.assetId}
							{#if assetId !== undefined && assetId !== null}
								{String((assetId) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const assetId = resolvedEntity.assetId}
							{#if assetId !== undefined && assetId !== null}
								{String((assetId) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{#if detailsOpen}
			<PolkadotAsset_TimestampsView
				selection={selection.$$timestamps}
				title='Asset observations'
				emptyText='No Polkadot asset observations.'
				id='PolkadotAsset_TimestampsView-timestamps'
			/>

			<PolkadotAssetBalance_TimestampsView
				selection={selection.$$balanceTimestamps}
				title='Balances'
				emptyText='No Polkadot asset balance observations.'
				id='PolkadotAssetBalance_TimestampsView-balance-timestamps'
			/>
		{/if}
	{/snippet}
</EntityView>
