<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { RegisteredEntityProxyData, RegisteredEntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


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
			selection: RegisteredEntityProxyResource<EntityType.AptosAccount>
			prefetched?: Partial<RegisteredEntityProxyData<EntityType.AptosAccount>>
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
	const aptosAccount = $derived(selection({
		sources: selection.sources,
	}))
	const titleFallback = $derived([String((pendingEntity.address) ?? '')].filter(Boolean).join(' ') || 'aptos account')
	const viewDomId = $derived('aptos-account-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import AptosNetworkView from '$/views/AptosNetworkView.svelte'
	import AptosAccount_TimestampsView from '$/views/AptosAccount_TimestampsView.svelte'
	import AptosTransactionsView from '$/views/AptosTransactionsView.svelte'
	import AptosCoinBalance_TimestampsView from '$/views/AptosCoinBalance_TimestampsView.svelte'
	import AptosAccountResourcesView from '$/views/AptosAccountResourcesView.svelte'
</script>


<EntityView
	entityType={EntityType.AptosAccount}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{#if prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails}
					{@const address0 = pendingEntity.address}
					{#if address0 !== undefined && address0 !== null}
						<TruncatedValue value={String((address0) ?? '')} />
					{/if}
		{:else}
			<ResourceBoundary resource={aptosAccount}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const address0 = resolvedEntity.address}
					{#if address0 !== undefined && address0 !== null}
						<TruncatedValue value={String((address0) ?? '')} />
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Value()}
		{#if prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails}
					<AptosNetworkView
						selection={select(EntityType.AptosNetwork, selection.entitySelector.$network)}
						layout={EntityLayout.Value}
						open={false}
					/>
		{:else}
			<ResourceBoundary resource={aptosAccount}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					<AptosNetworkView
						selection={select(EntityType.AptosNetwork, selection.entitySelector.$network)}
						layout={EntityLayout.Value}
						open={false}
					/>
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>network</dt>
				<dd>
					<AptosNetworkView
						selection={select(EntityType.AptosNetwork, selection.entitySelector.$network, {})}
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
								sources: selection.sources,
								fields: {
									address: true,
								},
							})
						}
					>
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
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{#if detailsOpen}
			<CollapsibleTabs
				id={viewDomId + '-carousel-aptos-account-activity'}
				sectionIdPrefix={viewDomId}
				sections={
					[
						{
							id: 'aptos-account-observations',
							label: 'Observations',
						},
						{
							id: 'aptos-account-transactions',
							label: 'Transactions',
						},
					]
				}
				data-card
				class='network-view-collapsible-account-activity'
			>
				{#snippet Summary()}
					<header data-row-item="flexible" data-row="wrap gap-4">
						<HeadingComponent>Account activity</HeadingComponent>
					</header>
				{/snippet}

				{#snippet SectionAptosAccountObservations({ id, label, open })}
					<AptosAccount_TimestampsView
						selection={selection.$$timestamps}
						CollapsibleProps={{ canToggle: false }}
						collapsible={false}
						data-column-item="flexible"
						data-card
						data-scroll-container
						emptyText='No observations yet.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

				{#snippet SectionAptosAccountTransactions({ id, label, open })}
					<AptosTransactionsView
						selection={selection.$$transactions}
						CollapsibleProps={{ canToggle: false }}
						collapsible={false}
						data-column-item="flexible"
						data-card
						data-scroll-container
						emptyText='No transactions found.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

			</CollapsibleTabs>

			<CollapsibleTabs
				id={viewDomId + '-carousel-aptos-account-resources'}
				sectionIdPrefix={viewDomId}
				sections={
					[
						{
							id: 'aptos-account-balances',
							label: 'Balances',
						},
						{
							id: 'aptos-account-resource-list',
							label: 'Resources',
						},
					]
				}
				data-card
				class='network-view-collapsible-resources-modules'
			>
				{#snippet Summary()}
					<header data-row-item="flexible" data-row="wrap gap-4">
						<HeadingComponent>Resources and modules</HeadingComponent>
					</header>
				{/snippet}

				{#snippet SectionAptosAccountBalances({ id, label, open })}
					<AptosCoinBalance_TimestampsView
						selection={selection.$$balances}
						CollapsibleProps={{ canToggle: false }}
						collapsible={false}
						data-column-item="flexible"
						data-card
						data-scroll-container
						emptyText='No balances found.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

				{#snippet SectionAptosAccountResourceList({ id, label, open })}
					<AptosAccountResourcesView
						selection={selection.$$resources}
						CollapsibleProps={{ canToggle: false }}
						collapsible={false}
						data-column-item="flexible"
						data-card
						data-scroll-container
						emptyText='No resources found.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

			</CollapsibleTabs>
		{/if}
	{/snippet}
</EntityView>
