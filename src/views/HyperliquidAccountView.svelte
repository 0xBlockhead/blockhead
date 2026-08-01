<!-- Generated from APP.ts. -->

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
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: Omit<EntitySelectionViewProps<EntityType.HyperliquidAccount>, 'prefetched'> = $props()

	const viewDomId = $derived('hyperliquid-account-' + encodeURIComponent(stringify(selection.entitySelector)))


	// Components
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import EntitiesList from '$/components/EntitiesList.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
	import HyperliquidAccountView from '$/views/HyperliquidAccountView.svelte'
</script>


<EntityView
	entityType={EntityType.HyperliquidAccount}
	entitySelector={selection.entitySelector}
	id={viewDomId}
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
						<div>
							<dt>master account</dt>
							<dd>
								<HyperliquidAccountView
									selection={select(EntityType.HyperliquidAccount, hyperliquidAccount[EntityMetaKey.Selector])}
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
						<div>
							<dt>agent account</dt>
							<dd>
								<HyperliquidAccountView
									selection={select(EntityType.HyperliquidAccount, hyperliquidAccount[EntityMetaKey.Selector])}
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
				<EntitiesList
					entityType={EntityType.HyperliquidOrder}
					collapsible={false}
					title={label}
					emptyText='No orders.'
					open={true}
					id={`${id}-list`}
					resource={selection.$$orders()}
				>
					{#snippet Item({ item: hyperliquidOrder })}
						<EntityView
							entityType={EntityType.HyperliquidOrder}
							entitySelector={hyperliquidOrder[EntityMetaKey.Selector]}
						/>
					{/snippet}
				</EntitiesList>
			{/snippet}

			{#snippet SectionHyperliquidAccountFills({ id, label })}
				<EntitiesList
					entityType={EntityType.HyperliquidFill}
					collapsible={false}
					title={label}
					emptyText='No fills.'
					open={true}
					id={`${id}-list`}
					resource={selection.$$fills()}
				>
					{#snippet Item({ item: hyperliquidFill })}
						<EntityView
							entityType={EntityType.HyperliquidFill}
							entitySelector={hyperliquidFill[EntityMetaKey.Selector]}
						/>
					{/snippet}
				</EntitiesList>
			{/snippet}

			{#snippet SectionHyperliquidAccountVaultEquities({ id, label })}
				<EntitiesList
					entityType={EntityType.HyperliquidVaultEquity_Timestamp}
					collapsible={false}
					title={label}
					emptyText='No vault equities.'
					open={true}
					id={`${id}-list`}
					resource={selection.$$vaultEquities()}
				>
					{#snippet Item({ item: hyperliquidVaultEquityTimestamp })}
						<EntityView
							entityType={EntityType.HyperliquidVaultEquity_Timestamp}
							entitySelector={hyperliquidVaultEquityTimestamp[EntityMetaKey.Selector]}
						/>
					{/snippet}
				</EntitiesList>
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
				<EntitiesList
					entityType={EntityType.HyperliquidAccount_Timestamp}
					collapsible={false}
					title={label}
					emptyText='No timestamps.'
					open={true}
					id={`${id}-list`}
					resource={selection.$$timestamps()}
				>
					{#snippet Item({ item: hyperliquidAccountTimestamp })}
						<EntityView
							entityType={EntityType.HyperliquidAccount_Timestamp}
							entitySelector={hyperliquidAccountTimestamp[EntityMetaKey.Selector]}
						/>
					{/snippet}
				</EntitiesList>
			{/snippet}

		</CollapsibleTabs>
	{/snippet}
</EntityView>
