<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { stringify } from 'devalue'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		prefetched = {},
		title,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: EntitySelectionViewProps<EntityType.HyperliquidAccount> = $props()

	const pendingEntity = $derived({ ...selection.entitySelector, ...prefetched })
	const titleFallback = 'hyperliquid account'
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
	import HyperliquidAccount_TimestampsView from '$/views/HyperliquidAccount_TimestampsView.svelte'
</script>


<EntityView
	entityType={EntityType.HyperliquidAccount}
	entitySelector={selection.entitySelector}
	id={viewDomId}
	title={title ?? titleFallback}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		hyperliquid account
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>network</dt>
				<dd>
					<NetworkView
						selection={select(EntityType.Network, selection.entitySelector.$network)}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>Address</dt>
				<dd>
					<TruncatedValue value={pendingEntity.address} />
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
							<TruncatedValue value={entity.accountRole} />
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={selection.$masterAccount}
			>
				{#snippet children(hyperliquidAccount)}
					{#if hyperliquidAccount != null}
						<div>
							<dt>master account</dt>
							<dd>
								<HyperliquidAccountView
									selection={select(EntityType.HyperliquidAccount, hyperliquidAccount[EntityMetaKey.Selector])}
									prefetched={hyperliquidAccount}
									layout={EntityLayout.Value}
									open={false}
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
						<div>
							<dt>agent account</dt>
							<dd>
								<HyperliquidAccountView
									selection={select(EntityType.HyperliquidAccount, hyperliquidAccount[EntityMetaKey.Selector])}
									prefetched={hyperliquidAccount}
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

			{#snippet SectionHyperliquidAccountOrders({ id, label, open })}
				<HyperliquidOrdersView
					selection={selection.$$orders}
					CollapsibleProps={{ canToggle: false }}
					collapsible={false}
					data-column-item="flexible"
					data-card
					data-scroll-container
					open={open}
					title={label}
					emptyText='No orders.'
					id={`${id}-list`}
				/>
			{/snippet}

			{#snippet SectionHyperliquidAccountFills({ id, label, open })}
				<HyperliquidFillsView
					selection={selection.$$fills}
					CollapsibleProps={{ canToggle: false }}
					collapsible={false}
					data-column-item="flexible"
					data-card
					data-scroll-container
					open={open}
					title={label}
					emptyText='No fills.'
					id={`${id}-list`}
				/>
			{/snippet}

			{#snippet SectionHyperliquidAccountVaultEquities({ id, label, open })}
				<HyperliquidVaultEquity_TimestampsView
					selection={selection.$$vaultEquities}
					CollapsibleProps={{ canToggle: false }}
					collapsible={false}
					data-column-item="flexible"
					data-card
					data-scroll-container
					open={open}
					title={label}
					emptyText='No vault equities.'
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

			{#snippet SectionHyperliquidAccountTimestamps({ id, label, open })}
				<HyperliquidAccount_TimestampsView
					selection={selection.$$timestamps}
					CollapsibleProps={{ canToggle: false }}
					collapsible={false}
					data-column-item="flexible"
					data-card
					data-scroll-container
					open={open}
					title={label}
					emptyText='No timestamps.'
					id={`${id}-list`}
				/>
			{/snippet}

		</CollapsibleTabs>
	{/snippet}
</EntityView>
