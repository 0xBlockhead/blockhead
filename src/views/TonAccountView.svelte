<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityProxyData, EntityProxyResource } from '$/client/$proxy.svelte.ts'
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
			selection: EntityProxyResource<typeof schema, EntityType.TonAccount>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.TonAccount>>
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
	const tonAccount = $derived(selection({}))
	const titleFallback = $derived('TON account')
	const viewDomId = $derived('ton-account-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import TonNetworkView from '$/views/TonNetworkView.svelte'
	import TonTransactionsView from '$/views/TonTransactionsView.svelte'
	import TonMessagesView from '$/views/TonMessagesView.svelte'
	import TonNftItemsView from '$/views/TonNftItemsView.svelte'
	import TonJettonBalance_TimestampsView from '$/views/TonJettonBalance_TimestampsView.svelte'
	import TonAccount_TimestampsView from '$/views/TonAccount_TimestampsView.svelte'
</script>


<EntityView
	entityType={EntityType.TonAccount}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={tonAccount}>
			{#snippet Pending()}
				{title || 'TON account'}
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
					<TonNetworkView
						selection={select(EntityType.TonNetwork, selection.entitySelector.$network, {})}
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

			<ResourceBoundary
				resource={
					selection({
						fields: {
							workchain: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const workchain = pendingEntity.workchain}
					{#if workchain !== undefined && workchain !== null}
						<div>
							<dt>workchain</dt>
							<dd>
								{String((workchain) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const workchain = resolvedEntity.workchain}
					{#if workchain !== undefined && workchain !== null}
						<div>
							<dt>workchain</dt>
							<dd>
								{String((workchain) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							addressHash: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const addressHash = pendingEntity.addressHash}
					{#if addressHash !== undefined && addressHash !== null}
						<div>
							<dt>address hash</dt>
							<dd>
								<TruncatedValue value={String((addressHash) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const addressHash = resolvedEntity.addressHash}
					{#if addressHash !== undefined && addressHash !== null}
						<div>
							<dt>address hash</dt>
							<dd>
								<TruncatedValue value={String((addressHash) ?? '')} />
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
				id={viewDomId + '-carousel-ton-account-activity'}
				sectionIdPrefix={viewDomId}
				sections={
					[
						{
							id: 'ton-account-transactions',
							label: 'Transactions',
						},
						{
							id: 'ton-account-messages',
							label: 'Messages',
						},
						{
							id: 'ton-account-nft-items',
							label: 'Nft Items',
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

				{#snippet SectionTonAccountTransactions({ id, label, open })}
					<TonTransactionsView
						selection={
							selection.$$transactions({
								count: true,
							})
						}
						CollapsibleProps={{ canToggle: false }}
						emptyText='No transactions.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

				{#snippet SectionTonAccountMessages({ id, label, open })}
					<TonMessagesView
						selection={
							selection.$$messages({
								count: true,
							})
						}
						CollapsibleProps={{ canToggle: false }}
						emptyText='No messages.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

				{#snippet SectionTonAccountNftItems({ id, label, open })}
					<TonNftItemsView
						selection={
							selection.$$nftItems({
								count: true,
							})
						}
						CollapsibleProps={{ canToggle: false }}
						emptyText='No nft items.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

			</CollapsibleTabs>

			<CollapsibleTabs
				id={viewDomId + '-carousel-ton-account-observations'}
				sectionIdPrefix={viewDomId}
				sections={
					[
						{
							id: 'ton-account-jetton-balance-timestamps',
							label: 'Jetton Balance Timestamps',
						},
						{
							id: 'ton-account-timestamps',
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

				{#snippet SectionTonAccountJettonBalanceTimestamps({ id, label, open })}
					<TonJettonBalance_TimestampsView
						selection={
							selection.$$jettonBalanceTimestamps({
								count: true,
							})
						}
						CollapsibleProps={{ canToggle: false }}
						emptyText='No jetton balance timestamps.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

				{#snippet SectionTonAccountTimestamps({ id, label, open })}
					<TonAccount_TimestampsView
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
