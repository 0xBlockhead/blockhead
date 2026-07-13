<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { EntityProxyData, EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { caip2StringFromValue } from '$/lib/caip2.ts'


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
			selection: EntityProxyResource<typeof schema, EntityType.HyperliquidAccount>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.HyperliquidAccount>>
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
	const hyperliquidAccount = $derived(selection({}))
	const titleFallback = $derived('hyperliquid account')
	const viewDomId = $derived('hyperliquid-account-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


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
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={hyperliquidAccount}>
			{#snippet Pending()}
				{title || 'hyperliquid account'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>network</dt>
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

			<div>
				<dt>Address</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									address: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const address = pendingEntity.address}
							{#if address !== undefined && address !== null}
								<TruncatedValue value={String((address) ?? '')} />
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const address = resolvedEntity.address}
							{#if address !== undefined && address !== null}
								<TruncatedValue value={String((address) ?? '')} />
							{/if}
						{/snippet}
					</ResourceBoundary>
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
						{#snippet Pending()}
							{@const accountRole = pendingEntity.accountRole}
							{#if accountRole !== undefined && accountRole !== null}
								<TruncatedValue value={String((accountRole) ?? '')} />
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const accountRole = resolvedEntity.accountRole}
							{#if accountRole !== undefined && accountRole !== null}
								<TruncatedValue value={String((accountRole) ?? '')} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={selection.$masterAccount}
			>
				{#snippet Pending()}{/snippet}

				{#snippet children(hyperliquidAccount)}
					{#if hyperliquidAccount != null && hyperliquidAccount[EntityMetaKey.Selector] != null}
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
				{#snippet Pending()}{/snippet}

				{#snippet children(hyperliquidAccount)}
					{#if hyperliquidAccount != null && hyperliquidAccount[EntityMetaKey.Selector] != null}
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
		{#if detailsOpen}
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
				scrollContainerProps={{
					'data-row': 'start align-start',
				}}
			>
				{#snippet Summary({})}
					<header data-row-item="flexible" data-row="wrap gap-4">
						<HeadingComponent>Activity</HeadingComponent>
					</header>
				{/snippet}

				{#snippet SectionHyperliquidAccountOrders({ id, label, open })}
					<HyperliquidOrdersView
						selection={
							selection.$$orders({
								count: true,
							})
						}
						CollapsibleProps={{ canToggle: false }}
						emptyText='No orders.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

				{#snippet SectionHyperliquidAccountFills({ id, label, open })}
					<HyperliquidFillsView
						selection={
							selection.$$fills({
								count: true,
							})
						}
						CollapsibleProps={{ canToggle: false }}
						emptyText='No fills.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

				{#snippet SectionHyperliquidAccountVaultEquities({ id, label, open })}
					<HyperliquidVaultEquity_TimestampsView
						selection={
							selection.$$vaultEquities({
								count: true,
							})
						}
						CollapsibleProps={{ canToggle: false }}
						emptyText='No vault equities.'
						open={open}
						title={label}
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
				scrollContainerProps={{
					'data-row': 'start align-start',
				}}
			>
				{#snippet Summary({})}
					<header data-row-item="flexible" data-row="wrap gap-4">
						<HeadingComponent>Observations</HeadingComponent>
					</header>
				{/snippet}

				{#snippet SectionHyperliquidAccountTimestamps({ id, label, open })}
					<HyperliquidAccount_TimestampsView
						selection={
							selection.$$timestamps({
								count: true,
							})
						}
						CollapsibleProps={{ canToggle: false }}
						emptyText='No timestamps.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

			</CollapsibleTabs>
		{/if}
	{/snippet}
</EntityView>
