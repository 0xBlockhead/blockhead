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
			selection: EntityProxyResource<typeof schema, EntityType.TronNetwork>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.TronNetwork>>
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
	const tronNetwork = $derived(selection({}))
	const titleFallback = $derived('tron network')
	const viewDomId = $derived('tron-network-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
	import TronNetwork_TimestampsView from '$/views/TronNetwork_TimestampsView.svelte'
	import TronBlocksView from '$/views/TronBlocksView.svelte'
	import TronTokensView from '$/views/TronTokensView.svelte'
	import TronTokenTransfersView from '$/views/TronTokenTransfersView.svelte'
	import TronWitnessesView from '$/views/TronWitnessesView.svelte'
</script>


<EntityView
	entityType={EntityType.TronNetwork}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={tronNetwork}>
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
		<ResourceBoundary resource={tronNetwork}>
			{#snippet Pending()}
				{title || 'tron network'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Network</dt>
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
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{#if detailsOpen}
			<CollapsibleTabs
				id={viewDomId + '-carousel-tron-chain-activity'}
				sectionIdPrefix={viewDomId}
				sections={
					[
						{
							id: 'tron-chain-observations',
							label: 'Observations',
						},
						{
							id: 'tron-chain-blocks',
							label: 'Blocks',
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

				{#snippet SectionTronChainObservations({ id, label, open })}
					<TronNetwork_TimestampsView
						selection={
							selection.$$timestamps({
								sources: [
									Source.TronGrid_Rest,
								],
								count: true,
							})
						}
						CollapsibleProps={{ canToggle: false }}
						emptyText='No Tron network observations.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

				{#snippet SectionTronChainBlocks({ id, label, open })}
					<TronBlocksView
						selection={
							selection.$$blocks({
								sources: [
									Source.TronGrid_Rest,
									Source.TronFullNode_Rest,
									Source.TronSolidityNode_Rest,
								],
								count: true,
							})
						}
						CollapsibleProps={{ canToggle: false }}
						emptyText='No Tron blocks.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

			</CollapsibleTabs>

			<CollapsibleTabs
				id={viewDomId + '-carousel-tron-tokens'}
				sectionIdPrefix={viewDomId}
				sections={
					[
						{
							id: 'tron-token-list',
							label: 'Tokens',
						},
						{
							id: 'tron-token-transfers',
							label: 'Token transfers',
						},
					]
				}
				data-card
				class='network-view-collapsible-tokens'
				scrollContainerProps={{
					'data-row': 'start align-start',
				}}
			>
				{#snippet Summary({})}
					<header data-row-item="flexible" data-row="wrap gap-4">
						<HeadingComponent>Tokens</HeadingComponent>
					</header>
				{/snippet}

				{#snippet SectionTronTokenList({ id, label, open })}
					<TronTokensView
						selection={
							selection.$$tokens({
								count: true,
							})
						}
						CollapsibleProps={{ canToggle: false }}
						emptyText='No Tron tokens.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

				{#snippet SectionTronTokenTransfers({ id, label, open })}
					<TronTokenTransfersView
						selection={
							selection.$$tokenTransfers({
								count: true,
							})
						}
						CollapsibleProps={{ canToggle: false }}
						emptyText='No Tron token transfers.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

			</CollapsibleTabs>

			<CollapsibleTabs
				id={viewDomId + '-carousel-tron-witnesses'}
				sectionIdPrefix={viewDomId}
				sections={
					[
						{
							id: 'tron-witness-list',
							label: 'Witnesses',
						},
					]
				}
				data-card
				class='network-view-collapsible-witnesses'
				scrollContainerProps={{
					'data-row': 'start align-start',
				}}
			>
				{#snippet Summary({})}
					<header data-row-item="flexible" data-row="wrap gap-4">
						<HeadingComponent>Witnesses</HeadingComponent>
					</header>
				{/snippet}

				{#snippet SectionTronWitnessList({ id, label, open })}
					<TronWitnessesView
						selection={
							selection.$$witnesses({
								sources: [
									Source.TronGrid_Rest,
								],
								count: true,
							})
						}
						CollapsibleProps={{ canToggle: false }}
						emptyText='No Tron witnesses.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

			</CollapsibleTabs>
		{/if}
	{/snippet}
</EntityView>
