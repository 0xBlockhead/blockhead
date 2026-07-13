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
			selection: EntityProxyResource<typeof schema, EntityType.StarknetNetwork>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.StarknetNetwork>>
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
	const starknetNetwork = $derived(selection({
		sources: [
			Source.Constants_Internal,
			Source.Juno_JsonRpc,
			Source.L2Beat_Rest,
			Source.Pathfinder_JsonRpc,
			Source.Starknet_JsonRpc,
			Source.Starkscan_Rest,
			Source.Voyager_Rest,
		],
		fields: {
			chainId: true,
		},
	}))
	const titleFallback = $derived('starknet network')
	const viewDomId = $derived('starknet-network-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
	import StarknetNetwork_TimestampsView from '$/views/StarknetNetwork_TimestampsView.svelte'
	import StarknetBlocksView from '$/views/StarknetBlocksView.svelte'
	import StarknetTransactionsView from '$/views/StarknetTransactionsView.svelte'
	import StarknetContractsView from '$/views/StarknetContractsView.svelte'
	import StarknetClassesView from '$/views/StarknetClassesView.svelte'
</script>


<EntityView
	entityType={EntityType.StarknetNetwork}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={starknetNetwork}>
			{#snippet Pending()}
				<NetworkView
					selection={select(EntityType.Network, selection.entitySelector.$network)}
					href={
						(selection.entitySelector.$network.caip2 !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]', {
							network: String(caip2StringFromValue(selection.entitySelector.$network.caip2) ?? ''),
						}) : selection.entitySelector.$network.slug !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]', {
							network: String(selection.entitySelector.$network.slug ?? ''),
						}) : undefined)
					}
					layout={EntityLayout.Title}
					open={false}
				/>
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				<NetworkView
					selection={select(EntityType.Network, selection.entitySelector.$network)}
					href={
						(selection.entitySelector.$network.caip2 !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]', {
							network: String(caip2StringFromValue(selection.entitySelector.$network.caip2) ?? ''),
						}) : selection.entitySelector.$network.slug !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]', {
							network: String(selection.entitySelector.$network.slug ?? ''),
						}) : undefined)
					}
					layout={EntityLayout.Title}
					open={false}
				/>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={starknetNetwork}>
			{#snippet Pending()}
				{[String((pendingEntity.chainId) ?? '')].filter(Boolean).join(' ') || title || 'starknet network'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.chainId) ?? '')].filter(Boolean).join(' ') || titleFallback}
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

			<ResourceBoundary
				resource={
					selection({
						fields: {
							chainId: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const chainId = pendingEntity.chainId}
					{#if chainId !== undefined && chainId !== null}
						<div>
							<dt>Chain ID</dt>
							<dd>
								{String((chainId) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const chainId = resolvedEntity.chainId}
					{#if chainId !== undefined && chainId !== null}
						<div>
							<dt>Chain ID</dt>
							<dd>
								{String((chainId) ?? '')}
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
				id={viewDomId + '-carousel-starknet-chain-activity'}
				sectionIdPrefix={viewDomId}
				sections={
					[
						{
							id: 'starknet-chain-observations',
							label: 'Observations',
						},
						{
							id: 'starknet-chain-blocks',
							label: 'Blocks',
						},
						{
							id: 'starknet-chain-transactions',
							label: 'Transactions',
						},
					]
				}
				data-card
				class='network-view-collapsible-chain-activity'
				scrollContainerProps={{
					'data-row': 'start align-start',
				}}
			>
				{#snippet Summary({})}
					<header data-row-item="flexible" data-row="wrap gap-4">
						<HeadingComponent>Chain activity</HeadingComponent>
					</header>
				{/snippet}

				{#snippet SectionStarknetChainObservations({ id, label, open })}
					<StarknetNetwork_TimestampsView
						selection={
							selection.$$timestamps({
								count: true,
							})
						}
						CollapsibleProps={{ canToggle: false }}
						emptyText='No Starknet network observations.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

				{#snippet SectionStarknetChainBlocks({ id, label, open })}
					<StarknetBlocksView
						selection={
							selection.$$blocks({
								count: true,
							})
						}
						CollapsibleProps={{ canToggle: false }}
						emptyText='No Starknet blocks.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

				{#snippet SectionStarknetChainTransactions({ id, label, open })}
					<StarknetTransactionsView
						selection={
							selection.$$transactions({
								count: true,
							})
						}
						CollapsibleProps={{ canToggle: false }}
						emptyText='No Starknet transactions.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

			</CollapsibleTabs>

			<CollapsibleTabs
				id={viewDomId + '-carousel-starknet-execution'}
				sectionIdPrefix={viewDomId}
				sections={
					[
						{
							id: 'starknet-contracts',
							label: 'Contracts',
						},
						{
							id: 'starknet-classes',
							label: 'Classes',
						},
					]
				}
				data-card
				class='network-view-collapsible-execution'
				scrollContainerProps={{
					'data-row': 'start align-start',
				}}
			>
				{#snippet Summary({})}
					<header data-row-item="flexible" data-row="wrap gap-4">
						<HeadingComponent>Accounts, classes, and contracts</HeadingComponent>
					</header>
				{/snippet}

				{#snippet SectionStarknetContracts({ id, label, open })}
					<StarknetContractsView
						selection={
							selection.$$contracts({
								count: true,
							})
						}
						CollapsibleProps={{ canToggle: false }}
						emptyText='No Starknet contracts.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

				{#snippet SectionStarknetClasses({ id, label, open })}
					<StarknetClassesView
						selection={
							selection.$$classes({
								count: true,
							})
						}
						CollapsibleProps={{ canToggle: false }}
						emptyText='No Starknet classes.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

			</CollapsibleTabs>
		{/if}
	{/snippet}
</EntityView>
