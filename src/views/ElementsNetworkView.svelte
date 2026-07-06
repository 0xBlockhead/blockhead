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
	import { networkByCaip2 } from '$/constants/Network.ts'
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
			selection: EntityProxyResource<typeof schema, EntityType.ElementsNetwork>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.ElementsNetwork>>
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
		sources: [
			Source.Constants_Internal,
			Source.Esplora_Rest,
		],
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
	import UtxoNetworkView from '$/views/UtxoNetworkView.svelte'
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
		<ResourceBoundary resource={elementsNetwork}>
			{#snippet Pending()}
				<NetworkView
					selection={select(EntityType.Network, selection.entitySelector.$network)}
					href={
						(selection.entitySelector.$network.caip2 !== undefined && selection.entitySelector.$network.caip2.namespace !== undefined && selection.entitySelector.$network.caip2 !== undefined && selection.entitySelector.$network.caip2.reference !== undefined ? resolve('/(explore)/(networks)/network/[caip2=networkCaip2]', {
							caip2: `${String(selection.entitySelector.$network.caip2.namespace ?? '')}:${String(selection.entitySelector.$network.caip2.reference ?? '')}`,
						}) : selection.entitySelector.$network.slug !== undefined ? resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]', {
							networkSlug: String(selection.entitySelector.$network.slug ?? ''),
						}) : undefined)
					}
					layout={EntityLayout.Title}
					open={false}
				/>
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				<NetworkView
					selection={select(EntityType.Network, selection.entitySelector.$network)}
					href={
						(selection.entitySelector.$network.caip2 !== undefined && selection.entitySelector.$network.caip2.namespace !== undefined && selection.entitySelector.$network.caip2 !== undefined && selection.entitySelector.$network.caip2.reference !== undefined ? resolve('/(explore)/(networks)/network/[caip2=networkCaip2]', {
							caip2: `${String(selection.entitySelector.$network.caip2.namespace ?? '')}:${String(selection.entitySelector.$network.caip2.reference ?? '')}`,
						}) : selection.entitySelector.$network.slug !== undefined ? resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]', {
							networkSlug: String(selection.entitySelector.$network.slug ?? ''),
						}) : undefined)
					}
					layout={EntityLayout.Title}
					open={false}
				/>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={elementsNetwork}>
			{#snippet Pending()}
				{[String((prefetched.federationName) ?? '')].filter(Boolean).join(' ') || title || 'Elements network'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.federationName) ?? '')].filter(Boolean).join(' ') || titleFallback}
			{/snippet}
		</ResourceBoundary>
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
						selection={select(EntityType.Network, selection.entitySelector.$network)}
						href={
							(selection.entitySelector.$network.caip2 !== undefined && selection.entitySelector.$network.caip2.namespace !== undefined && selection.entitySelector.$network.caip2 !== undefined && selection.entitySelector.$network.caip2.reference !== undefined ? resolve('/(explore)/(networks)/network/[caip2=networkCaip2]', {
								caip2: `${String(selection.entitySelector.$network.caip2.namespace ?? '')}:${String(selection.entitySelector.$network.caip2.reference ?? '')}`,
							}) : selection.entitySelector.$network.slug !== undefined ? resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]', {
								networkSlug: String(selection.entitySelector.$network.slug ?? ''),
							}) : undefined)
						}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection[EntityProxyField]<EntityType.UtxoNetwork, false>('$settlementNetwork', {
						sources: [
							Source.Constants_Internal,
						],
					})
				}
			>
				{#snippet children(utxoNetwork)}
					{#if utxoNetwork != null && utxoNetwork[EntityMetaKey.Selector] != null}
						<div>
							<dt>Settlement network</dt>
							<dd>
								<UtxoNetworkView
									selection={select(EntityType.UtxoNetwork, utxoNetwork[EntityMetaKey.Selector])}
									prefetched={utxoNetwork}
									href={
										(utxoNetwork[EntityMetaKey.Selector].$network !== undefined && utxoNetwork[EntityMetaKey.Selector].$network.caip2 !== undefined && utxoNetwork[EntityMetaKey.Selector].$network.caip2.namespace !== undefined && utxoNetwork[EntityMetaKey.Selector].$network !== undefined && utxoNetwork[EntityMetaKey.Selector].$network.caip2 !== undefined && utxoNetwork[EntityMetaKey.Selector].$network.caip2.reference !== undefined ? resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]/utxo', {
											networkSlug: String(networkByCaip2[String(String(utxoNetwork[EntityMetaKey.Selector].$network.caip2.namespace) + ':' + String(utxoNetwork[EntityMetaKey.Selector].$network.caip2.reference))].slug ?? ''),
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
						sources: [
							Source.Constants_Internal,
						],
						fields: {
							federationName: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const federationName = prefetched.federationName}
					{#if federationName !== undefined && federationName !== null}
						<div>
							<dt>Federation</dt>
							<dd>
								{String((federationName) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

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
						sources: [
							Source.Constants_Internal,
						],
						fields: {
							blockTimeSeconds: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const blockTimeSeconds = prefetched.blockTimeSeconds}
					{#if blockTimeSeconds !== undefined && blockTimeSeconds !== null}
						<div>
							<dt>Block time seconds</dt>
							<dd>
								<NumberValue value={Number(blockTimeSeconds)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const blockTimeSeconds = resolvedEntity.blockTimeSeconds}
					{#if blockTimeSeconds !== undefined && blockTimeSeconds !== null}
						<div>
							<dt>Block time seconds</dt>
							<dd>
								<NumberValue value={Number(blockTimeSeconds)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						sources: [
							Source.Constants_Internal,
						],
						fields: {
							confidentialTransactionsDefault: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const confidentialTransactionsDefault = prefetched.confidentialTransactionsDefault}
					{#if confidentialTransactionsDefault !== undefined && confidentialTransactionsDefault !== null}
						<div>
							<dt>Confidential transactions by default</dt>
							<dd>
								{confidentialTransactionsDefault ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}

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
					selection[EntityProxyField]<EntityType.ElementsAsset, false>('$nativeAsset', {
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
						selection[EntityProxyField]<EntityType.ElementsAsset>('$$assets', {
							sources: [
								Source.Esplora_Rest,
							],
						})
					}
				title='Assets'
				id='ElementsAssetsView-$$assets'
			/>
		{/if}
	{/snippet}
</EntityView>
