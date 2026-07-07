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
			selection: EntityProxyResource<typeof schema, EntityType.LightningNetwork>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.LightningNetwork>>
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
	const lightningNetwork = $derived(selection({
		sources: [
			Source.LightningMempoolSpace_Rest,
			Source.LightningLnd_Rest,
		],
		fields: {
			name: true,
			$settlementNetwork: true,
		},
	}))
	const titleFallback = $derived([String((prefetched.name) ?? '')].filter(Boolean).join(' ') || 'Lightning network')
	const viewDomId = $derived('lightning-network-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import LightningNetwork_TimestampsView from '$/views/LightningNetwork_TimestampsView.svelte'
	import LightningNodesView from '$/views/LightningNodesView.svelte'
	import LightningChannelsView from '$/views/LightningChannelsView.svelte'
	import BlockheadLightningInvoicesView from '$/views/BlockheadLightningInvoicesView.svelte'
	import BlockheadLightningPaymentsView from '$/views/BlockheadLightningPaymentsView.svelte'
	import BlockheadLightningNodeStatesView from '$/views/BlockheadLightningNodeStatesView.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
</script>


<EntityView
	entityType={EntityType.LightningNetwork}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={lightningNetwork}>
			{#snippet Pending()}
				{[String((prefetched.name) ?? '')].filter(Boolean).join(' ') || title || 'Lightning network'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.name) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={lightningNetwork}>
			{#snippet Pending()}
				{['Lightning'].filter(Boolean).join(' ') || [String((prefetched.name) ?? '')].filter(Boolean).join(' ') || title || 'Lightning network'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{['Lightning'].filter(Boolean).join(' ') || [String((resolvedEntity.name) ?? '')].filter(Boolean).join(' ') || titleFallback}
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
							(selection.entitySelector.$network.executionModels !== undefined && selection.entitySelector.$network.executionModels.values.includes('Evm') && selection.entitySelector.$network.caip2 !== undefined && selection.entitySelector.$network.caip2.namespace !== undefined && selection.entitySelector.$network.caip2 !== undefined && selection.entitySelector.$network.caip2.reference !== undefined ? resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]', {
								caip2: `${String(selection.entitySelector.$network.caip2.namespace ?? '')}:${String(selection.entitySelector.$network.caip2.reference ?? '')}`,
							}) : selection.entitySelector.$network.executionModels !== undefined && selection.entitySelector.$network.executionModels.values.includes('CosmosSdk') && selection.entitySelector.$network.caip2 !== undefined && selection.entitySelector.$network.caip2.namespace !== undefined && selection.entitySelector.$network.caip2 !== undefined && selection.entitySelector.$network.caip2.reference !== undefined ? resolve('/(explore)/(networks)/network/[caip2=networkCaip2]/cosmos', {
								caip2: `${String(selection.entitySelector.$network.caip2.namespace ?? '')}:${String(selection.entitySelector.$network.caip2.reference ?? '')}`,
							}) : selection.entitySelector.$network.executionModels !== undefined && selection.entitySelector.$network.executionModels.values.includes('Evm') && selection.entitySelector.$network.caip2 !== undefined && selection.entitySelector.$network.caip2.namespace !== undefined && selection.entitySelector.$network.caip2 !== undefined && selection.entitySelector.$network.caip2.reference !== undefined ? resolve('/(explore)/(networks)/network/[networkSlug=eip155NetworkSlug]', {
								networkSlug: String(networkByCaip2[String(String(selection.entitySelector.$network.caip2.namespace) + ':' + String(selection.entitySelector.$network.caip2.reference))].slug ?? ''),
							}) : selection.entitySelector.$network.executionModels !== undefined && selection.entitySelector.$network.executionModels.values.includes('SolanaRuntime') && selection.entitySelector.$network.slug !== undefined ? resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]/solana', {
								networkSlug: String(selection.entitySelector.$network.slug ?? ''),
							}) : selection.entitySelector.$network.executionModels !== undefined && selection.entitySelector.$network.executionModels.values.includes('PolkadotRuntime') && selection.entitySelector.$network.slug !== undefined ? resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]/polkadot', {
								networkSlug: String(selection.entitySelector.$network.slug ?? ''),
							}) : selection.entitySelector.$network.ledgerModels !== undefined && selection.entitySelector.$network.ledgerModels.values.includes('Utxo') && selection.entitySelector.$network.slug !== undefined ? resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]/utxo', {
								networkSlug: String(selection.entitySelector.$network.slug ?? ''),
							}) : selection.entitySelector.$network.caip2 !== undefined && selection.entitySelector.$network.caip2.namespace !== undefined && selection.entitySelector.$network.caip2 !== undefined && selection.entitySelector.$network.caip2.reference !== undefined ? resolve('/(explore)/(networks)/network/[caip2=networkCaip2]', {
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
				resource={selection[EntityProxyField]<EntityType.Network, false>('$settlementNetwork')}
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
										(network[EntityMetaKey.Selector].executionModels !== undefined && network[EntityMetaKey.Selector].executionModels.values.includes('Evm') && network[EntityMetaKey.Selector].caip2 !== undefined && network[EntityMetaKey.Selector].caip2.namespace !== undefined && network[EntityMetaKey.Selector].caip2 !== undefined && network[EntityMetaKey.Selector].caip2.reference !== undefined ? resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]', {
											caip2: `${String(network[EntityMetaKey.Selector].caip2.namespace ?? '')}:${String(network[EntityMetaKey.Selector].caip2.reference ?? '')}`,
										}) : network[EntityMetaKey.Selector].executionModels !== undefined && network[EntityMetaKey.Selector].executionModels.values.includes('CosmosSdk') && network[EntityMetaKey.Selector].caip2 !== undefined && network[EntityMetaKey.Selector].caip2.namespace !== undefined && network[EntityMetaKey.Selector].caip2 !== undefined && network[EntityMetaKey.Selector].caip2.reference !== undefined ? resolve('/(explore)/(networks)/network/[caip2=networkCaip2]/cosmos', {
											caip2: `${String(network[EntityMetaKey.Selector].caip2.namespace ?? '')}:${String(network[EntityMetaKey.Selector].caip2.reference ?? '')}`,
										}) : network[EntityMetaKey.Selector].executionModels !== undefined && network[EntityMetaKey.Selector].executionModels.values.includes('Evm') && network[EntityMetaKey.Selector].caip2 !== undefined && network[EntityMetaKey.Selector].caip2.namespace !== undefined && network[EntityMetaKey.Selector].caip2 !== undefined && network[EntityMetaKey.Selector].caip2.reference !== undefined ? resolve('/(explore)/(networks)/network/[networkSlug=eip155NetworkSlug]', {
											networkSlug: String(networkByCaip2[String(String(network[EntityMetaKey.Selector].caip2.namespace) + ':' + String(network[EntityMetaKey.Selector].caip2.reference))].slug ?? ''),
										}) : network[EntityMetaKey.Selector].executionModels !== undefined && network[EntityMetaKey.Selector].executionModels.values.includes('SolanaRuntime') && network[EntityMetaKey.Selector].slug !== undefined ? resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]/solana', {
											networkSlug: String(network[EntityMetaKey.Selector].slug ?? ''),
										}) : network[EntityMetaKey.Selector].executionModels !== undefined && network[EntityMetaKey.Selector].executionModels.values.includes('PolkadotRuntime') && network[EntityMetaKey.Selector].slug !== undefined ? resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]/polkadot', {
											networkSlug: String(network[EntityMetaKey.Selector].slug ?? ''),
										}) : network[EntityMetaKey.Selector].ledgerModels !== undefined && network[EntityMetaKey.Selector].ledgerModels.values.includes('Utxo') && network[EntityMetaKey.Selector].slug !== undefined ? resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]/utxo', {
											networkSlug: String(network[EntityMetaKey.Selector].slug ?? ''),
										}) : network[EntityMetaKey.Selector].caip2 !== undefined && network[EntityMetaKey.Selector].caip2.namespace !== undefined && network[EntityMetaKey.Selector].caip2 !== undefined && network[EntityMetaKey.Selector].caip2.reference !== undefined ? resolve('/(explore)/(networks)/network/[caip2=networkCaip2]', {
											caip2: `${String(network[EntityMetaKey.Selector].caip2.namespace ?? '')}:${String(network[EntityMetaKey.Selector].caip2.reference ?? '')}`,
										}) : network[EntityMetaKey.Selector].slug !== undefined ? resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]', {
											networkSlug: String(network[EntityMetaKey.Selector].slug ?? ''),
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
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{#if detailsOpen}
			<LightningNetwork_TimestampsView
				selection={selection[EntityProxyField]<EntityType.LightningNetwork_Timestamp>('$$timestamps')}
				title='Observations'
				emptyText='No observations yet.'
				id='LightningNetwork_TimestampsView-$$timestamps'
			/>

			<LightningNodesView
				selection={selection[EntityProxyField]<EntityType.LightningNode>('$$nodes')}
				title='Nodes'
				emptyText='No nodes yet.'
				id='LightningNodesView-$$nodes'
			/>

			<LightningChannelsView
				selection={selection[EntityProxyField]<EntityType.LightningChannel>('$$channels')}
				title='Channels'
				emptyText='No channels yet.'
				id='LightningChannelsView-$$channels'
			/>

			<BlockheadLightningInvoicesView
				selection={selection[EntityProxyField]<EntityType.BlockheadLightningInvoice>('$$invoices')}
				title='Invoices'
				emptyText='No invoices yet.'
				id='BlockheadLightningInvoicesView-$$invoices'
			/>

			<BlockheadLightningPaymentsView
				selection={selection[EntityProxyField]<EntityType.BlockheadLightningPayment>('$$payments')}
				title='Payments'
				emptyText='No payments yet.'
				id='BlockheadLightningPaymentsView-$$payments'
			/>

			<BlockheadLightningNodeStatesView
				selection={selection[EntityProxyField]<EntityType.BlockheadLightningNodeState>('$$localNodeStates')}
				title='Local node states'
				emptyText='No local node states.'
				id='BlockheadLightningNodeStatesView-$$localNodeStates'
			/>
		{/if}
	{/snippet}
</EntityView>
