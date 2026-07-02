<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { EntityProxyData, EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityProxyField } from '$/client/$proxy.svelte.ts'
	import { EntityLayout } from '$/components/EntityView.svelte'
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
			selection: EntityProxyResource<typeof schema, EntityType.CosmosNetwork>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.CosmosNetwork>>
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

	const cosmosNetwork = $derived(selection({}))
	const titleFallback = $derived('Cosmos network')
	const viewDomId = $derived('cosmos-network-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))
	// Components
	import EntityView from '$/components/EntityView.svelte'
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import CosmosNetwork_TimestampsView from '$/views/CosmosNetwork_TimestampsView.svelte'
	import CosmosBlocksView from '$/views/CosmosBlocksView.svelte'
	import CosmosAccountsView from '$/views/CosmosAccountsView.svelte'
	import CosmosValidatorsView from '$/views/CosmosValidatorsView.svelte'
	import CosmosGovernanceProposalsView from '$/views/CosmosGovernanceProposalsView.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
</script>


<EntityView
	entityType={EntityType.CosmosNetwork}
	entitySelector={selection.entitySelector}
	id={viewDomId}
	title={title ?? titleFallback}
	href={
		href ?? resolve('/(explore)/(networks)/network/[caip2=networkCaip2]/cosmos', {
			caip2: `${String(({ ...selection.entitySelector, ...prefetched }).$network.caip2.namespace)}:${String(({ ...selection.entitySelector, ...prefetched }).$network.caip2.reference)}`,
		})
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{#if layout === EntityLayout.Summary || layout === EntityLayout.SummaryInline}
			<NetworkView
				selection={select(EntityType.Network, selection.entitySelector.$network)}
				href={
						(selection.entitySelector.$network?.caip2 != null && selection.entitySelector.$network?.caip2?.namespace != null && selection.entitySelector.$network?.caip2?.reference != null ? resolve('/(explore)/(networks)/network/[caip2=networkCaip2]', {
							caip2: `${String(selection.entitySelector.$network.caip2.namespace)}:${String(selection.entitySelector.$network.caip2.reference)}`,
						}) : selection.entitySelector.$network?.slug != null ? resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]', {
							networkSlug: String(selection.entitySelector.$network.slug),
						}) : undefined)
					}
				layout={EntityLayout.Title}
				open={false}
			/>
		{:else}
			<ResourceBoundary resource={cosmosNetwork}>
				{#snippet Pending()}
					<NetworkView
						selection={select(EntityType.Network, selection.entitySelector.$network)}
						href={
							(selection.entitySelector.$network?.caip2 != null && selection.entitySelector.$network?.caip2?.namespace != null && selection.entitySelector.$network?.caip2?.reference != null ? resolve('/(explore)/(networks)/network/[caip2=networkCaip2]', {
								caip2: `${String(selection.entitySelector.$network.caip2.namespace)}:${String(selection.entitySelector.$network.caip2.reference)}`,
							}) : selection.entitySelector.$network?.slug != null ? resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]', {
								networkSlug: String(selection.entitySelector.$network.slug),
							}) : undefined)
						}
						layout={EntityLayout.Title}
						open={false}
					/>
				{/snippet}

				{#snippet children(entity)}
					<NetworkView
						selection={select(EntityType.Network, selection.entitySelector.$network)}
						href={
							(selection.entitySelector.$network?.caip2 != null && selection.entitySelector.$network?.caip2?.namespace != null && selection.entitySelector.$network?.caip2?.reference != null ? resolve('/(explore)/(networks)/network/[caip2=networkCaip2]', {
								caip2: `${String(selection.entitySelector.$network.caip2.namespace)}:${String(selection.entitySelector.$network.caip2.reference)}`,
							}) : selection.entitySelector.$network?.slug != null ? resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]', {
								networkSlug: String(selection.entitySelector.$network.slug),
							}) : undefined)
						}
						layout={EntityLayout.Title}
						open={false}
					/>
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Value()}
		{#if layout === EntityLayout.Summary || layout === EntityLayout.SummaryInline}
			<NetworkView
				selection={select(EntityType.Network, selection.entitySelector.$network)}
				href={
						(selection.entitySelector.$network?.caip2 != null && selection.entitySelector.$network?.caip2?.namespace != null && selection.entitySelector.$network?.caip2?.reference != null ? resolve('/(explore)/(networks)/network/[caip2=networkCaip2]', {
							caip2: `${String(selection.entitySelector.$network.caip2.namespace)}:${String(selection.entitySelector.$network.caip2.reference)}`,
						}) : selection.entitySelector.$network?.slug != null ? resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]', {
							networkSlug: String(selection.entitySelector.$network.slug),
						}) : undefined)
					}
				layout={EntityLayout.Value}
				open={false}
			/>
		{:else}
			<ResourceBoundary resource={cosmosNetwork}>
				{#snippet Pending()}
					<NetworkView
						selection={select(EntityType.Network, selection.entitySelector.$network)}
						href={
							(selection.entitySelector.$network?.caip2 != null && selection.entitySelector.$network?.caip2?.namespace != null && selection.entitySelector.$network?.caip2?.reference != null ? resolve('/(explore)/(networks)/network/[caip2=networkCaip2]', {
								caip2: `${String(selection.entitySelector.$network.caip2.namespace)}:${String(selection.entitySelector.$network.caip2.reference)}`,
							}) : selection.entitySelector.$network?.slug != null ? resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]', {
								networkSlug: String(selection.entitySelector.$network.slug),
							}) : undefined)
						}
						layout={EntityLayout.Value}
						open={false}
					/>
				{/snippet}

				{#snippet children(entity)}
					<NetworkView
						selection={select(EntityType.Network, selection.entitySelector.$network)}
						href={
							(selection.entitySelector.$network?.caip2 != null && selection.entitySelector.$network?.caip2?.namespace != null && selection.entitySelector.$network?.caip2?.reference != null ? resolve('/(explore)/(networks)/network/[caip2=networkCaip2]', {
								caip2: `${String(selection.entitySelector.$network.caip2.namespace)}:${String(selection.entitySelector.$network.caip2.reference)}`,
							}) : selection.entitySelector.$network?.slug != null ? resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]', {
								networkSlug: String(selection.entitySelector.$network.slug),
							}) : undefined)
						}
						layout={EntityLayout.Value}
						open={false}
					/>
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{#if detailsOpen}
			<CosmosNetwork_TimestampsView
				selection={selection[EntityProxyField]<EntityType.CosmosNetwork_Timestamp>('$$timestamps')}
				title='Network snapshots'
				emptyText='No Cosmos network observations.'
				id='CosmosNetwork_TimestampsView-$$timestamps'
			/>

			<CosmosBlocksView
				selection={selection[EntityProxyField]<EntityType.CosmosBlock>('$$blocks')}
				title='Blocks'
				emptyText='No Cosmos blocks.'
				id='CosmosBlocksView-$$blocks'
			/>

			<CosmosAccountsView
				selection={selection[EntityProxyField]<EntityType.CosmosAccount>('$$accounts')}
				title='Accounts'
				emptyText='No Cosmos accounts.'
				id='CosmosAccountsView-$$accounts'
			/>

			<CosmosValidatorsView
				selection={selection[EntityProxyField]<EntityType.CosmosValidator>('$$validators')}
				title='Validators'
				emptyText='No Cosmos validators.'
				id='CosmosValidatorsView-$$validators'
			/>

			<CosmosGovernanceProposalsView
				selection={selection[EntityProxyField]<EntityType.CosmosGovernanceProposal>('$$governanceProposals')}
				title='Governance proposals'
				emptyText='No Cosmos governance proposals.'
				id='CosmosGovernanceProposalsView-$$governanceProposals'
			/>

			<CollapsibleTabs
				id={viewDomId + '-carousel-rest-endpoints'}
				sectionIdPrefix={viewDomId}
				sections={
					[
						{
							id: 'rest-endpoints',
							label: 'REST endpoints',
						},
					]
				}
				data-card
				scrollContainerProps={{
					'data-row': 'start align-start',
				}}
			>
				{#snippet Summary({})}
					<header data-row-item="flexible" data-row="wrap gap-4">
						<HeadingComponent>REST endpoints</HeadingComponent>
					</header>
				{/snippet}

				{#snippet SectionRestEndpoints({ id, label, open })}
					<ResourceBoundary
						resource={
							selection({
								fields: {
									restEndpoints: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const restEndpoints = entity.restEndpoints}
							{#if restEndpoints.length > 0}
								<ul data-column="gap-2">
									{#each restEndpoints as rESTEndpoint, rESTEndpointIndex (rESTEndpointIndex)}
										{@const providerNameValue = rESTEndpoint.providerName}
										{@const transportTypeValue = rESTEndpoint.transportType}
										{@const urlValue = rESTEndpoint.url}
										<li>
											<dl data-column-item="center">
												<div>
													<dt>Provider</dt>
													<dd>
														{#if providerNameValue !== undefined && providerNameValue !== null}
															{String((providerNameValue) ?? '')}
														{/if}
													</dd>
												</div>

												<div>
													<dt>Transport</dt>
													<dd>
														{#if transportTypeValue !== undefined && transportTypeValue !== null}
															{String((transportTypeValue) ?? '')}
														{/if}
													</dd>
												</div>

												<div>
													<dt>URL</dt>
													<dd>
														{#if urlValue !== undefined && urlValue !== null}
															<svelte:element
																this={'a'}
																href={String(urlValue)}
																target="_blank"
																rel="noreferrer noopener"
															>
																<TruncatedValue value={String(urlValue)} />
															</svelte:element>
														{/if}
													</dd>
												</div>
											</dl>
										</li>
									{/each}
								</ul>
							{:else}
								<p data-text="muted">No REST endpoints.</p>
							{/if}
						{/snippet}
					</ResourceBoundary>
				{/snippet}

			</CollapsibleTabs>
		{/if}
	{/snippet}
</EntityView>
