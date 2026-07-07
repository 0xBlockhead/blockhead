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
			selection: EntityProxyResource<typeof schema, EntityType.EvmNetworkAccount>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.EvmNetworkAccount>>
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
	const evmNetworkAccount = $derived(selection({}))
	const titleFallback = $derived('EVM network account')
	const viewDomId = $derived('evm-network-account-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import EvmNetworkAccount_TimestampsView from '$/views/EvmNetworkAccount_TimestampsView.svelte'
	import EvmNetworkActorCoinBalancesView from '$/views/EvmNetworkActorCoinBalancesView.svelte'
	import EvmActorCoinAllowancesView from '$/views/EvmActorCoinAllowancesView.svelte'
	import EvmNetworkView from '$/views/EvmNetworkView.svelte'
	import EvmAccountView from '$/views/EvmAccountView.svelte'
</script>


<EntityView
	entityType={EntityType.EvmNetworkAccount}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={evmNetworkAccount}>
			{#snippet Pending()}
				<EvmAccountView
					selection={select(EntityType.EvmAccount, selection.entitySelector.$actor)}
					href={
						(selection.entitySelector.$actor.address !== undefined ? resolve('/(explore)/account/[address=evmAddress]', {
							address: String(selection.entitySelector.$actor.address ?? ''),
						}) : undefined)
					}
					layout={EntityLayout.Title}
					open={false}
				/>
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				<EvmAccountView
					selection={select(EntityType.EvmAccount, selection.entitySelector.$actor)}
					href={
						(selection.entitySelector.$actor.address !== undefined ? resolve('/(explore)/account/[address=evmAddress]', {
							address: String(selection.entitySelector.$actor.address ?? ''),
						}) : undefined)
					}
					layout={EntityLayout.Title}
					open={false}
				/>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={evmNetworkAccount}>
			{#snippet Pending()}
				<EvmNetworkView
					selection={select(EntityType.EvmNetwork, selection.entitySelector.$network)}
					layout={EntityLayout.Value}
					open={false}
				/>
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				<EvmNetworkView
					selection={select(EntityType.EvmNetwork, selection.entitySelector.$network)}
					layout={EntityLayout.Value}
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
					<EvmNetworkView
						selection={select(EntityType.EvmNetwork, selection.entitySelector.$network, {})}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>actor</dt>
				<dd>
					<EvmAccountView
						selection={select(EntityType.EvmAccount, selection.entitySelector.$actor, {})}
						href={
							(selection.entitySelector.$actor.address !== undefined ? resolve('/(explore)/account/[address=evmAddress]', {
								address: String(selection.entitySelector.$actor.address ?? ''),
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
			<EvmNetworkAccount_TimestampsView
				selection={selection[EntityProxyField]<EntityType.EvmNetworkAccount_Timestamp>('$$timestamps')}
				title='timestamps'
				emptyText='No account observations yet.'
				id='EvmNetworkAccount_TimestampsView-$$timestamps'
			/>

			<EvmNetworkActorCoinBalancesView
				selection={selection[EntityProxyField]<EntityType.EvmNetworkActorCoinBalance>('$$ownedCoins')}
				title='owned coins'
				href={resolve('/~/accounts/balances')}
				emptyText='No owned coins yet.'
				id='EvmNetworkActorCoinBalancesView-$$ownedCoins'
			/>

			<EvmActorCoinAllowancesView
				selection={selection[EntityProxyField]<EntityType.EvmActorCoinAllowance>('$$erc20TokenAllowances')}
				title='erc20 token allowances'
				emptyText='No allowances yet.'
				id='EvmActorCoinAllowancesView-$$erc20TokenAllowances'
			/>
		{/if}
	{/snippet}
</EntityView>
