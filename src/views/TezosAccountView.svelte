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
			selection: EntityProxyResource<typeof schema, EntityType.TezosAccount>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.TezosAccount>>
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
	const tezosAccount = $derived(selection({}))
	const titleFallback = $derived('tezos account')
	const viewDomId = $derived('tezos-account-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import TezosNetworkView from '$/views/TezosNetworkView.svelte'
	import TezosOperationsView from '$/views/TezosOperationsView.svelte'
	import TezosTokenTransfersView from '$/views/TezosTokenTransfersView.svelte'
	import TezosTokenBalance_TimestampsView from '$/views/TezosTokenBalance_TimestampsView.svelte'
	import TezosAccount_TimestampsView from '$/views/TezosAccount_TimestampsView.svelte'
</script>


<EntityView
	entityType={EntityType.TezosAccount}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={tezosAccount}>
			{#snippet Pending()}
				{title || 'tezos account'}
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
					<TezosNetworkView
						selection={select(EntityType.TezosNetwork, selection.entitySelector.$network, {})}
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
				<dt>account kind</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									accountKind: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const accountKind = pendingEntity.accountKind}
							{#if accountKind !== undefined && accountKind !== null}
								<TruncatedValue value={String((accountKind) ?? '')} />
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const accountKind = resolvedEntity.accountKind}
							{#if accountKind !== undefined && accountKind !== null}
								<TruncatedValue value={String((accountKind) ?? '')} />
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
				id={viewDomId + '-carousel-tezos-account-activity'}
				sectionIdPrefix={viewDomId}
				sections={
					[
						{
							id: 'tezos-account-operations',
							label: 'Operations',
						},
						{
							id: 'tezos-account-token-transfers',
							label: 'Token Transfers',
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

				{#snippet SectionTezosAccountOperations({ id, label, open })}
					<TezosOperationsView
						selection={selection.$$operations}
						CollapsibleProps={{ canToggle: false }}
						emptyText='No operations.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

				{#snippet SectionTezosAccountTokenTransfers({ id, label, open })}
					<TezosTokenTransfersView
						selection={selection.$$tokenTransfers}
						CollapsibleProps={{ canToggle: false }}
						emptyText='No token transfers.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

			</CollapsibleTabs>

			<CollapsibleTabs
				id={viewDomId + '-carousel-tezos-account-observations'}
				sectionIdPrefix={viewDomId}
				sections={
					[
						{
							id: 'tezos-account-token-balance-timestamps',
							label: 'Token Balance Timestamps',
						},
						{
							id: 'tezos-account-timestamps',
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

				{#snippet SectionTezosAccountTokenBalanceTimestamps({ id, label, open })}
					<TezosTokenBalance_TimestampsView
						selection={selection.$$tokenBalanceTimestamps}
						CollapsibleProps={{ canToggle: false }}
						emptyText='No token balance timestamps.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

				{#snippet SectionTezosAccountTimestamps({ id, label, open })}
					<TezosAccount_TimestampsView
						selection={selection.$$timestamps}
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
