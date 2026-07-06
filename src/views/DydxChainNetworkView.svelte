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
			selection: EntityProxyResource<typeof schema, EntityType.DydxChainNetwork>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.DydxChainNetwork>>
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
	const dydxChainNetwork = $derived(selection({
		sources: [
			Source.DydxIndexer_Rest,
			Source.DydxValidator_Rest,
		],
	}))
	const titleFallback = $derived('dydx chain network')
	const viewDomId = $derived('dydx-chain-network-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import DydxChainNetwork_TimestampsView from '$/views/DydxChainNetwork_TimestampsView.svelte'
	import DydxChainMarketsView from '$/views/DydxChainMarketsView.svelte'
	import DydxChainSubaccountsView from '$/views/DydxChainSubaccountsView.svelte'
	import DydxChainOrdersView from '$/views/DydxChainOrdersView.svelte'
	import DydxChainPerpetualPosition_TimestampsView from '$/views/DydxChainPerpetualPosition_TimestampsView.svelte'
	import CosmosNetworkView from '$/views/CosmosNetworkView.svelte'
</script>


<EntityView
	entityType={EntityType.DydxChainNetwork}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={dydxChainNetwork}>
			{#snippet Pending()}
				<CosmosNetworkView
					selection={select(EntityType.CosmosNetwork, selection.entitySelector.$network)}
					href={
						(selection.entitySelector.$network.$network !== undefined && selection.entitySelector.$network.$network.caip2 !== undefined && selection.entitySelector.$network.$network.caip2.namespace !== undefined && selection.entitySelector.$network.$network !== undefined && selection.entitySelector.$network.$network.caip2 !== undefined && selection.entitySelector.$network.$network.caip2.reference !== undefined ? resolve('/(explore)/(networks)/network/[caip2=networkCaip2]/cosmos', {
							caip2: `${String(selection.entitySelector.$network.$network.caip2.namespace ?? '')}:${String(selection.entitySelector.$network.$network.caip2.reference ?? '')}`,
						}) : undefined)
					}
					layout={EntityLayout.Title}
					open={false}
				/>
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				<CosmosNetworkView
					selection={select(EntityType.CosmosNetwork, selection.entitySelector.$network)}
					href={
						(selection.entitySelector.$network.$network !== undefined && selection.entitySelector.$network.$network.caip2 !== undefined && selection.entitySelector.$network.$network.caip2.namespace !== undefined && selection.entitySelector.$network.$network !== undefined && selection.entitySelector.$network.$network.caip2 !== undefined && selection.entitySelector.$network.$network.caip2.reference !== undefined ? resolve('/(explore)/(networks)/network/[caip2=networkCaip2]/cosmos', {
							caip2: `${String(selection.entitySelector.$network.$network.caip2.namespace ?? '')}:${String(selection.entitySelector.$network.$network.caip2.reference ?? '')}`,
						}) : undefined)
					}
					layout={EntityLayout.Title}
					open={false}
				/>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>network</dt>
				<dd>
					<CosmosNetworkView
						selection={select(EntityType.CosmosNetwork, selection.entitySelector.$network)}
						href={
							(selection.entitySelector.$network.$network !== undefined && selection.entitySelector.$network.$network.caip2 !== undefined && selection.entitySelector.$network.$network.caip2.namespace !== undefined && selection.entitySelector.$network.$network !== undefined && selection.entitySelector.$network.$network.caip2 !== undefined && selection.entitySelector.$network.$network.caip2.reference !== undefined ? resolve('/(explore)/(networks)/network/[caip2=networkCaip2]/cosmos', {
								caip2: `${String(selection.entitySelector.$network.$network.caip2.namespace ?? '')}:${String(selection.entitySelector.$network.$network.caip2.reference ?? '')}`,
							}) : undefined)
						}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{#if detailsOpen}
			<DydxChainNetwork_TimestampsView
				selection={selection[EntityProxyField]<EntityType.DydxChainNetwork_Timestamp>('$$timestamps')}
				title='timestamps'
				emptyText='No dYdX network observations.'
				id='DydxChainNetwork_TimestampsView-$$timestamps'
			/>

			<DydxChainMarketsView
				selection={selection[EntityProxyField]<EntityType.DydxChainMarket>('$$markets')}
				title='markets'
				emptyText='No dYdX markets.'
				id='DydxChainMarketsView-$$markets'
			/>

			<DydxChainSubaccountsView
				selection={selection[EntityProxyField]<EntityType.DydxChainSubaccount>('$$subaccounts')}
				title='subaccounts'
				emptyText='No dYdX subaccounts.'
				id='DydxChainSubaccountsView-$$subaccounts'
			/>

			<DydxChainOrdersView
				selection={selection[EntityProxyField]<EntityType.DydxChainOrder>('$$orders')}
				title='orders'
				emptyText='No dYdX orders.'
				id='DydxChainOrdersView-$$orders'
			/>

			<DydxChainPerpetualPosition_TimestampsView
				selection={selection[EntityProxyField]<EntityType.DydxChainPerpetualPosition_Timestamp>('$$positions')}
				title='positions'
				emptyText='No dYdX position observations.'
				id='DydxChainPerpetualPosition_TimestampsView-$$positions'
			/>
		{/if}
	{/snippet}
</EntityView>
