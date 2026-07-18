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
	import { Source } from '$/sources/Source.ts'


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
			selection: RegisteredEntityProxyResource<EntityType.ElementsNetwork>
			prefetched?: Partial<RegisteredEntityProxyData<EntityType.ElementsNetwork>>
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
	const elementsNetwork = $derived(selection({
		sources: selection.sources,
		fields: {
			federationName: true,
		},
	}))
	const titleFallback = $derived('Elements network')
	const viewDomId = $derived('elements-network-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import ElementsAssetsView from '$/views/ElementsAssetsView.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
	import ElementsAssetView from '$/views/ElementsAssetView.svelte'
</script>


<EntityView
	entityType={EntityType.ElementsNetwork}
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
		{:else}
			<ResourceBoundary resource={elementsNetwork}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
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
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Value()}
		{#if prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails}
			{[String((pendingEntity.federationName) ?? '')].filter(Boolean).join(' ') || titleFallback}
		{:else}
			<ResourceBoundary resource={elementsNetwork}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{[String((resolvedEntity.federationName) ?? '')].filter(Boolean).join(' ') || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet TypeAnnotationTooltip()}
		<p>
			Elements/Liquid-specific view over a canonical Network row, including federation metadata, settlement network, native asset, and registry assets.
		</p>
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

			<ResourceBoundary
				resource={
					selection.$settlementNetwork({
						sources: [
							Source.Constants_Internal,
						],
					})
				}
			>
				{#snippet children(network)}
					{#if network != null && network[EntityMetaKey.Selector] != null}
						<div>
							<dt>Settlement network</dt>
							<dd>
								<NetworkView
									selection={select(EntityType.Network, network[EntityMetaKey.Selector])}
									prefetched={network}
									href={
										(network[EntityMetaKey.Selector].caip2 !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]', {
											network: String(caip2StringFromValue(network[EntityMetaKey.Selector].caip2) ?? ''),
										}) : network[EntityMetaKey.Selector].slug !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]', {
											network: String(network[EntityMetaKey.Selector].slug ?? ''),
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

			<ResourceBoundary
				resource={
					selection({
						sources: selection.sources,
						fields: {
							federationName: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const federationName = resolvedEntity.federationName}
					{#if federationName !== undefined && federationName !== null}
						<div>
							<dt>Federation</dt>
							<dd>
								{String((federationName) ?? '')}
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
							blockTimeSeconds: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const blockTimeSeconds = resolvedEntity.blockTimeSeconds}
					{#if blockTimeSeconds !== undefined && blockTimeSeconds !== null}
						<div>
							<dt>Block time seconds</dt>
							<dd>
								<NumberValue
									value={blockTimeSeconds}
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
							confidentialTransactionsDefault: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const confidentialTransactionsDefault = resolvedEntity.confidentialTransactionsDefault}
					{#if confidentialTransactionsDefault !== undefined && confidentialTransactionsDefault !== null}
						<div>
							<dt>Confidential transactions by default</dt>
							<dd>
								{confidentialTransactionsDefault ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection.$nativeAsset({
						sources: [
							Source.Esplora_Rest,
						],
					})
				}
			>
				{#snippet children(elementsAsset)}
					{#if elementsAsset != null && elementsAsset[EntityMetaKey.Selector] != null}
						<div>
							<dt>Native asset</dt>
							<dd>
								<ElementsAssetView
									selection={select(EntityType.ElementsAsset, elementsAsset[EntityMetaKey.Selector])}
									prefetched={elementsAsset}
									layout={EntityLayout.Value}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{#if detailsOpen}
			<ElementsAssetsView
				selection={
						selection.$$assets({
							sources: [
								Source.Esplora_Rest,
							],
							count: true,
						})
					}
				title='Assets'
				id='ElementsAssetsView-assets'
			/>
		{/if}
	{/snippet}
</EntityView>
