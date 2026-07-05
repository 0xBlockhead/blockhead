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
			selection: EntityProxyResource<typeof schema, EntityType.DydxChainSubaccount>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.DydxChainSubaccount>>
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
	const dydxChainSubaccount = $derived(selection({
		sources: [
			Source.DydxIndexer_Rest,
			Source.DydxValidator_Rest,
		],
	}))
	const titleFallback = $derived('dydx chain subaccount')
	const viewDomId = $derived('dydx-chain-subaccount-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))
	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import DydxChainPerpetualPosition_TimestampsView from '$/views/DydxChainPerpetualPosition_TimestampsView.svelte'
	import DydxChainOrdersView from '$/views/DydxChainOrdersView.svelte'
	import DydxChainSubaccount_TimestampsView from '$/views/DydxChainSubaccount_TimestampsView.svelte'
	import DydxChainNetworkView from '$/views/DydxChainNetworkView.svelte'
	import CosmosAccountView from '$/views/CosmosAccountView.svelte'
</script>


<EntityView
	entityType={EntityType.DydxChainSubaccount}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={dydxChainSubaccount}>
			{#snippet Pending()}
				<CosmosAccountView
					selection={select(EntityType.CosmosAccount, selection.entitySelector.$account)}
					href={
						(selection.entitySelector.$account.$network !== undefined && selection.entitySelector.$account.$network.caip2 !== undefined && selection.entitySelector.$account.$network.caip2.namespace !== undefined && selection.entitySelector.$account.$network !== undefined && selection.entitySelector.$account.$network.caip2 !== undefined && selection.entitySelector.$account.$network.caip2.reference !== undefined && selection.entitySelector.$account.address !== undefined ? resolve('/(explore)/(networks)/network/[caip2=networkCaip2]/cosmos/account/[address]', {
							caip2: `${String(selection.entitySelector.$account.$network.caip2.namespace ?? '')}:${String(selection.entitySelector.$account.$network.caip2.reference ?? '')}`,
							address: String(selection.entitySelector.$account.address ?? ''),
						}) : undefined)
					}
					layout={EntityLayout.Title}
					open={false}
				/>
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				<CosmosAccountView
					selection={select(EntityType.CosmosAccount, selection.entitySelector.$account)}
					href={
						(selection.entitySelector.$account.$network !== undefined && selection.entitySelector.$account.$network.caip2 !== undefined && selection.entitySelector.$account.$network.caip2.namespace !== undefined && selection.entitySelector.$account.$network !== undefined && selection.entitySelector.$account.$network.caip2 !== undefined && selection.entitySelector.$account.$network.caip2.reference !== undefined && selection.entitySelector.$account.address !== undefined ? resolve('/(explore)/(networks)/network/[caip2=networkCaip2]/cosmos/account/[address]', {
							caip2: `${String(selection.entitySelector.$account.$network.caip2.namespace ?? '')}:${String(selection.entitySelector.$account.$network.caip2.reference ?? '')}`,
							address: String(selection.entitySelector.$account.address ?? ''),
						}) : undefined)
					}
					layout={EntityLayout.Title}
					open={false}
				/>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={dydxChainSubaccount}>
			{#snippet Pending()}
				{@const subaccountNumber0 = selection.entitySelector.subaccountNumber ?? prefetched.subaccountNumber}
				{#if subaccountNumber0 !== undefined && subaccountNumber0 !== null}
					<NumberValue value={Number(subaccountNumber0)} />
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const subaccountNumber0 = resolvedEntity.subaccountNumber}
				{#if subaccountNumber0 !== undefined && subaccountNumber0 !== null}
					<NumberValue value={Number(subaccountNumber0)} />
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>network</dt>
				<dd>
					<DydxChainNetworkView
						selection={select(EntityType.DydxChainNetwork, selection.entitySelector.$network)}
						layout={EntityLayout.Title}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>account</dt>
				<dd>
					<CosmosAccountView
						selection={select(EntityType.CosmosAccount, selection.entitySelector.$account)}
						href={
							(selection.entitySelector.$account.$network !== undefined && selection.entitySelector.$account.$network.caip2 !== undefined && selection.entitySelector.$account.$network.caip2.namespace !== undefined && selection.entitySelector.$account.$network !== undefined && selection.entitySelector.$account.$network.caip2 !== undefined && selection.entitySelector.$account.$network.caip2.reference !== undefined && selection.entitySelector.$account.address !== undefined ? resolve('/(explore)/(networks)/network/[caip2=networkCaip2]/cosmos/account/[address]', {
								caip2: `${String(selection.entitySelector.$account.$network.caip2.namespace ?? '')}:${String(selection.entitySelector.$account.$network.caip2.reference ?? '')}`,
								address: String(selection.entitySelector.$account.address ?? ''),
							}) : undefined)
						}
						layout={EntityLayout.Title}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>subaccount number</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									subaccountNumber: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const subaccountNumber = selection.entitySelector.subaccountNumber ?? prefetched.subaccountNumber}
							{#if subaccountNumber !== undefined && subaccountNumber !== null}
								<NumberValue value={Number(subaccountNumber)} />
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const subaccountNumber = resolvedEntity.subaccountNumber}
							{#if subaccountNumber !== undefined && subaccountNumber !== null}
								<NumberValue value={Number(subaccountNumber)} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{#if detailsOpen}
			<DydxChainPerpetualPosition_TimestampsView
				selection={selection[EntityProxyField]<EntityType.DydxChainPerpetualPosition_Timestamp>('$$positions')}
				title='positions'
				emptyText='No dYdX position observations.'
				id='DydxChainPerpetualPosition_TimestampsView-$$positions'
			/>

			<DydxChainOrdersView
				selection={selection[EntityProxyField]<EntityType.DydxChainOrder>('$$orders')}
				title='orders'
				emptyText='No dYdX orders.'
				id='DydxChainOrdersView-$$orders'
			/>

			<DydxChainSubaccount_TimestampsView
				selection={selection[EntityProxyField]<EntityType.DydxChainSubaccount_Timestamp>('$$timestamps')}
				title='timestamps'
				emptyText='No dYdX subaccount observations.'
				id='DydxChainSubaccount_TimestampsView-$$timestamps'
			/>
		{/if}
	{/snippet}
</EntityView>
