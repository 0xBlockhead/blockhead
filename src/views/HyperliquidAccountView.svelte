<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { untrack } from 'svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { stringify } from 'devalue'
	import { caip2StringFromValue } from '$/lib/caip2.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: Omit<EntitySelectionViewProps<EntityType.HyperliquidAccount>, 'prefetched'> = $props()

	const network = $derived(selection.entitySelector.$network)
	const viewDomId = $derived('hyperliquid-account-' + encodeURIComponent(stringify(selection.entitySelector)))


	// Components
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
	import HyperliquidAccountView from '$/views/HyperliquidAccountView.svelte'
	import HyperliquidOrdersView from '$/views/HyperliquidOrdersView.svelte'
	import HyperliquidFillsView from '$/views/HyperliquidFillsView.svelte'
	import HyperliquidVaultEquity_TimestampsView from '$/views/HyperliquidVaultEquity_TimestampsView.svelte'
	import HyperliquidBorrowLendPositionsView from '$/views/HyperliquidBorrowLendPositionsView.svelte'
	import HyperliquidAccount_TimestampsView from '$/views/HyperliquidAccount_TimestampsView.svelte'
</script>


<EntityView
	entityType={EntityType.HyperliquidAccount}
	entitySelector={selection.entitySelector}
	id={viewDomId}
	href={
		href === undefined ?
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(accounts)/account/[accountId=stringSegmentOrPolkadotAccountIdOrEvmAddressOrSolanaPubkey]',
				{
					network: (
						'caip2' in network ?
							caip2StringFromValue(network.caip2)
						:
							network.slug
					),
					accountId: selection.entitySelector.address,
				}
			)
		:
			href ?? undefined
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>network</dt>
				<dd>
					<NetworkView
						selection={select(EntityType.Network, selection.entitySelector.$network)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<div>
				<dt>Address</dt>
				<dd>
					<TruncatedValue value={selection.entitySelector.address} />
				</dd>
			</div>

			<div>
				<dt>account role</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									accountRole: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{entity.accountRole}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={selection.$masterAccount}
			>
				{#snippet children(hyperliquidAccount)}
					{#if hyperliquidAccount != null}
						{@const hyperliquidAccountInitial = untrack(() => hyperliquidAccount)}
						<div>
							<dt>master account</dt>
							<dd>
								<HyperliquidAccountView
									selection={select(EntityType.HyperliquidAccount, (hyperliquidAccount ?? hyperliquidAccountInitial)[EntityMetaKey.Selector])}
									layout={EntityLayout.Value}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$agentAccount}
			>
				{#snippet children(hyperliquidAccount)}
					{#if hyperliquidAccount != null}
						{@const hyperliquidAccountInitial = untrack(() => hyperliquidAccount)}
						<div>
							<dt>agent account</dt>
							<dd>
								<HyperliquidAccountView
									selection={select(EntityType.HyperliquidAccount, (hyperliquidAccount ?? hyperliquidAccountInitial)[EntityMetaKey.Selector])}
									layout={EntityLayout.Value}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details()}
		<CollapsibleTabs
			id={viewDomId + '-carousel-hyperliquid-account-activity'}
			sectionIdPrefix={viewDomId}
			sections={
				[
					{
						id: 'hyperliquid-account-orders',
						label: 'Orders',
					},
					{
						id: 'hyperliquid-account-fills',
						label: 'Fills',
					},
					{
						id: 'hyperliquid-account-vault-equities',
						label: 'Vault Equities',
					},
					{
						id: 'hyperliquid-account-borrow-lend-positions',
						label: 'Borrow/lend',
					},
				]
			}
			data-card
			class='network-view-collapsible-activity'
		>
			{#snippet Summary()}
				<header data-row-item="flexible" data-row="wrap gap-4">
					<HeadingComponent>Activity</HeadingComponent>
				</header>
			{/snippet}

			{#snippet SectionHyperliquidAccountOrders({ id, label })}
				<HyperliquidOrdersView
					selection={selection.$$orders}
					collapsible={false}
					title={label}
					emptyText='No orders.'
					id={`${id}-list`}
				/>
			{/snippet}

			{#snippet SectionHyperliquidAccountFills({ id, label })}
				<HyperliquidFillsView
					selection={selection.$$fills}
					collapsible={false}
					title={label}
					emptyText='No fills.'
					id={`${id}-list`}
				/>
			{/snippet}

			{#snippet SectionHyperliquidAccountVaultEquities({ id, label })}
				<HyperliquidVaultEquity_TimestampsView
					selection={selection.$$vaultEquities}
					collapsible={false}
					title={label}
					emptyText='No vault equities.'
					id={`${id}-list`}
				/>
			{/snippet}

			{#snippet SectionHyperliquidAccountBorrowLendPositions({ id, label })}
				<HyperliquidBorrowLendPositionsView
					selection={
						selection
						.$$borrowLendPositions({
							sources: [
								Source.Hyperliquid,
							],
							limit: 32,
						})
					}
					collapsible={false}
					title={label}
					emptyText='No borrow/lend positions.'
					id={`${id}-list`}
				/>
			{/snippet}

		</CollapsibleTabs>

		<CollapsibleTabs
			id={viewDomId + '-carousel-hyperliquid-account-observations'}
			sectionIdPrefix={viewDomId}
			sections={
				[
					{
						id: 'hyperliquid-account-timestamps',
						label: 'Timestamps',
					},
				]
			}
			data-card
			class='network-view-collapsible-observations'
		>
			{#snippet Summary()}
				<header data-row-item="flexible" data-row="wrap gap-4">
					<HeadingComponent>Observations</HeadingComponent>
				</header>
			{/snippet}

			{#snippet SectionHyperliquidAccountTimestamps({ id, label })}
				<HyperliquidAccount_TimestampsView
					selection={selection.$$timestamps}
					collapsible={false}
					title={label}
					emptyText='No timestamps.'
					id={`${id}-list`}
				/>
			{/snippet}

		</CollapsibleTabs>
	{/snippet}
</EntityView>
