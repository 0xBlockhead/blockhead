<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { EntityProxyData, EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityProxyField } from '$/client/$proxy.svelte.ts'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
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

	const lightningNetwork = $derived(selection({
		sources: [
			Source.LightningMempoolSpace_Rest,
			Source.LightningLnd_Rest,
		],
		fields: {
			name: true,
			$settlementNetwork: true,
			...(open && {
				$$timestamps: true,
				$$nodes: true,
				$$channels: true,
				$$invoices: true,
				$$payments: true,
			}),
		},
	}))
	const titleFallback = $derived([String((({ ...selection.entitySelector, ...prefetched }).name) ?? '')].filter(Boolean).join(' ') || 'Lightning network')
	const viewDomId = $derived('lightning-network-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))
	// Components
	import EntityView from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import LightningNodesView from '$/views/LightningNodesView.svelte'
	import LightningChannelsView from '$/views/LightningChannelsView.svelte'
	import BlockheadLightningInvoicesView from '$/views/BlockheadLightningInvoicesView.svelte'
	import BlockheadLightningPaymentsView from '$/views/BlockheadLightningPaymentsView.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
</script>


<EntityView
	entityType={EntityType.LightningNetwork}
	entitySelector={selection.entitySelector}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{#if layout === EntityLayout.Summary || layout === EntityLayout.SummaryInline}
			{[String((({ ...selection.entitySelector, ...prefetched }).name) ?? '')].filter(Boolean).join(' ') || title || 'Lightning network'}
		{:else}
			<ResourceBoundary resource={lightningNetwork}>
				{#snippet Pending()}
					{[String((({ ...selection.entitySelector, ...prefetched }).name) ?? '')].filter(Boolean).join(' ') || title || 'Lightning network'}
				{/snippet}

				{#snippet children(entity)}
					{[String((entity.name) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Value()}
		{#if layout === EntityLayout.Summary || layout === EntityLayout.SummaryInline}
			{['Lightning'].filter(Boolean).join(' ') || [String((({ ...selection.entitySelector, ...prefetched }).name) ?? '')].filter(Boolean).join(' ') || title || 'Lightning network'}
		{:else}
			<ResourceBoundary resource={lightningNetwork}>
				{#snippet Pending()}
					{['Lightning'].filter(Boolean).join(' ') || [String((({ ...selection.entitySelector, ...prefetched }).name) ?? '')].filter(Boolean).join(' ') || title || 'Lightning network'}
				{/snippet}

				{#snippet children(entity)}
					{['Lightning'].filter(Boolean).join(' ') || [String((entity.name) ?? '')].filter(Boolean).join(' ') || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<ResourceBoundary
				resource={selection[EntityProxyField]<EntityType.Network, false>('$settlementNetwork')}
			>
				{#snippet children(network)}
					{#if network != null}
						<div>
							<dt>Settlement network</dt>
							<dd>
								<NetworkView
									selection={select(EntityType.Network, network.entitySelector)}
									prefetched={network}
									href={
										(network.entitySelector?.caip2 != null && network.entitySelector?.caip2?.namespace != null && network.entitySelector?.caip2?.reference != null ? resolve('/(explore)/(networks)/network/[caip2=networkCaip2]', {
											caip2: `${String(network.entitySelector.caip2.namespace)}:${String(network.entitySelector.caip2.reference)}`,
										}) : network.entitySelector?.slug != null ? resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]', {
											networkSlug: String(network.entitySelector.slug),
										}) : undefined)
									}
									layout={EntityLayout.Title}
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
		{/if}
	{/snippet}
</EntityView>
