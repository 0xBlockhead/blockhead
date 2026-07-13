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
			selection: EntityProxyResource<typeof schema, EntityType.TezosToken>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.TezosToken>>
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
	const tezosToken = $derived(selection({}))
	const titleFallback = $derived('tezos token')
	const viewDomId = $derived('tezos-token-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import TezosNetworkView from '$/views/TezosNetworkView.svelte'
	import TezosContractView from '$/views/TezosContractView.svelte'
	import TezosTokenTransfersView from '$/views/TezosTokenTransfersView.svelte'
	import TezosToken_TimestampsView from '$/views/TezosToken_TimestampsView.svelte'
	import TezosTokenBalance_TimestampsView from '$/views/TezosTokenBalance_TimestampsView.svelte'
</script>


<EntityView
	entityType={EntityType.TezosToken}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={tezosToken}>
			{#snippet Pending()}
				{title || 'tezos token'}
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
				<dt>contract address</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									contractAddress: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const contractAddress = pendingEntity.contractAddress}
							{#if contractAddress !== undefined && contractAddress !== null}
								<TruncatedValue value={String((contractAddress) ?? '')} />
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const contractAddress = resolvedEntity.contractAddress}
							{#if contractAddress !== undefined && contractAddress !== null}
								<TruncatedValue value={String((contractAddress) ?? '')} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Token ID</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									tokenId: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const tokenId = pendingEntity.tokenId}
							{#if tokenId !== undefined && tokenId !== null}
								{String((tokenId) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const tokenId = resolvedEntity.tokenId}
							{#if tokenId !== undefined && tokenId !== null}
								{String((tokenId) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							standard: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const standard = pendingEntity.standard}
					{#if standard !== undefined && standard !== null}
						<div>
							<dt>standard</dt>
							<dd>
								{String((standard) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const standard = resolvedEntity.standard}
					{#if standard !== undefined && standard !== null}
						<div>
							<dt>standard</dt>
							<dd>
								{String((standard) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$contract}
			>
				{#snippet Pending()}{/snippet}

				{#snippet children(tezosContract)}
					{#if tezosContract != null && tezosContract[EntityMetaKey.Selector] != null}
						<div>
							<dt>contract</dt>
							<dd>
								<TezosContractView
									selection={select(EntityType.TezosContract, tezosContract[EntityMetaKey.Selector])}
									prefetched={tezosContract}
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
				id={viewDomId + '-carousel-tezos-token-activity'}
				sectionIdPrefix={viewDomId}
				sections={
					[
						{
							id: 'tezos-token-transfers',
							label: 'Transfers',
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

				{#snippet SectionTezosTokenTransfers({ id, label, open })}
					<TezosTokenTransfersView
						selection={
							selection.$$transfers({
								count: true,
							})
						}
						CollapsibleProps={{ canToggle: false }}
						emptyText='No transfers.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

			</CollapsibleTabs>

			<CollapsibleTabs
				id={viewDomId + '-carousel-tezos-token-observations'}
				sectionIdPrefix={viewDomId}
				sections={
					[
						{
							id: 'tezos-token-timestamps',
							label: 'Timestamps',
						},
						{
							id: 'tezos-token-balance-timestamps',
							label: 'Balance Timestamps',
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

				{#snippet SectionTezosTokenTimestamps({ id, label, open })}
					<TezosToken_TimestampsView
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

				{#snippet SectionTezosTokenBalanceTimestamps({ id, label, open })}
					<TezosTokenBalance_TimestampsView
						selection={
							selection.$$balanceTimestamps({
								count: true,
							})
						}
						CollapsibleProps={{ canToggle: false }}
						emptyText='No balance timestamps.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

			</CollapsibleTabs>
		{/if}
	{/snippet}
</EntityView>
