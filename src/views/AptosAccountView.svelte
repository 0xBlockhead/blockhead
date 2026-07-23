<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { RegisteredEntityProxyPrefetchedData, RegisteredEntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { stringify } from 'devalue'
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
			selection: RegisteredEntityProxyResource<EntityType.AptosAccount>
			prefetched?: RegisteredEntityProxyPrefetchedData<EntityType.AptosAccount>
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
	const aptosAccount = $derived(selection(prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails ? {
		sources: selection.sources,
		fields: {},
	} : {
		sources: selection.sources,
	}))
	const titleFallback = $derived([String((pendingEntity.address) ?? '')].filter(Boolean).join(' ') || 'aptos account')
	const viewDomId = $derived('aptos-account-' + encodeURIComponent(stringify(selection.entitySelector ?? prefetched[EntityMetaKey.Selector])))


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
		<ResourceBoundary resource={aptosAccount}>
			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const address0 = resolvedEntity.address}
				{#if address0 !== undefined && address0 !== null}
					<TruncatedValue value={String((address0) ?? '')} />
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={aptosAccount}>
			{#snippet children(entity)}
				<AptosNetworkView
					selection={select(EntityType.AptosNetwork, selection.entitySelector.$network)}
					href=""
					layout={EntityLayout.Value}
					open={false}
				/>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>network</dt>
				<dd>
					<AptosNetworkView
						selection={select(EntityType.AptosNetwork, selection.entitySelector.$network)}
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
				<CollapsibleTabs
					id={viewDomId + '-carousel-aptos-account-activity'}
					sectionIdPrefix={viewDomId}
					sections={
						[
							{
								id: 'aptos-account-observations',
								label: 'Observations',
								ownsSection: true,
							},
							{
								id: 'aptos-account-transactions',
								label: 'Transactions',
								ownsSection: true,
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

					{#snippet MarkerAptosAccountObservations(_context, Content)}
						{@const aptosAccountActivityAptosAccountObservationsResource = selection
		.$$timestamps({
			sources: [
				Source.AptosFullnode_Rest,
			],
		})}
						<ResourceBoundary
							resource={aptosAccountActivityAptosAccountObservationsResource}
						>
							{#snippet children(_resolved)}
								{@render Content()}
							{/snippet}

							{#snippet PendingContent()}
								{@render Content()}
							{/snippet}

							{#snippet FailedContent(_error, _retry)}
								{@render Content()}
							{/snippet}
						</ResourceBoundary>
					{/snippet}

					{#snippet SectionAptosAccountObservations({ id, label, open, active })}
						{@const aptosAccountActivityAptosAccountObservationsResource = selection
		.$$timestamps({
			sources: [
				Source.AptosFullnode_Rest,
			],
		})}
						<ResourceBoundary
							resource={aptosAccountActivityAptosAccountObservationsResource}
						>
							{#snippet children(aptosAccountTimestamp)}
								<section
									id={id}
									aria-labelledby={`${id}:marker`}
									data-scroll-marker-label={label}
									data-column-item="flexible"
									data-column
									data-active={active}
								>
									<AptosAccount_TimestampsView
										selection={aptosAccountActivityAptosAccountObservationsResource}
										CollapsibleProps={{ canToggle: false }}
										collapsible={false}
										data-column-item="flexible"
										data-card
										data-scroll-container
										open={open}
										title={label}
										emptyText='No observations yet.'
										id={`${id}-list`}
									/>
								</section>
							{/snippet}

							{#snippet Pending()}
								<section id={id} aria-labelledby={`${id}:marker`} data-scroll-marker-label={label} data-column-item="flexible" data-column data-active={active}>
									<article id={`${id}-list`} data-column-item="flexible" data-card data-scroll-container>
										<span data-tag data-text="muted" data-resource-state="pending" class="loading inline-placeholder" aria-busy="true" aria-label="Loading…">•••</span>
									</article>
								</section>
							{/snippet}

							{#snippet Failed(_error, _retry)}
								<section id={id} aria-labelledby={`${id}:marker`} data-scroll-marker-label={label} data-column-item="flexible" data-column data-active={active}>
									<article id={`${id}-list`} data-column-item="flexible" data-card data-scroll-container>
										<span data-tag data-resource-state="failed" class="inline-placeholder" aria-label="Failed to load">•••</span>
									</article>
								</section>
							{/snippet}
						</ResourceBoundary>
					{/snippet}

					{#snippet MarkerAptosAccountTransactions(_context, Content)}
						{@const aptosAccountActivityAptosAccountTransactionsResource = selection
		.$$transactions({
			sources: [
				Source.AptosIndexer_Graphql,
				Source.AptosFullnode_Rest,
			],
		})}
						<ResourceBoundary
							resource={aptosAccountActivityAptosAccountTransactionsResource}
						>
							{#snippet children(_resolved)}
								{@render Content()}
							{/snippet}

							{#snippet PendingContent()}
								{@render Content()}
							{/snippet}

							{#snippet FailedContent(_error, _retry)}
								{@render Content()}
							{/snippet}
						</ResourceBoundary>
					{/snippet}

					{#snippet SectionAptosAccountTransactions({ id, label, open, active })}
						{@const aptosAccountActivityAptosAccountTransactionsResource = selection
		.$$transactions({
			sources: [
				Source.AptosIndexer_Graphql,
				Source.AptosFullnode_Rest,
			],
		})}
						<ResourceBoundary
							resource={aptosAccountActivityAptosAccountTransactionsResource}
						>
							{#snippet children(aptosTransaction)}
								<section
									id={id}
									aria-labelledby={`${id}:marker`}
									data-scroll-marker-label={label}
									data-column-item="flexible"
									data-column
									data-active={active}
								>
									<AptosTransactionsView
										selection={aptosAccountActivityAptosAccountTransactionsResource}
										CollapsibleProps={{ canToggle: false }}
										collapsible={false}
										data-column-item="flexible"
										data-card
										data-scroll-container
										open={open}
										title={label}
										emptyText='No transactions found.'
										id={`${id}-list`}
									/>
								</section>
							{/snippet}

							{#snippet Pending()}
								<section id={id} aria-labelledby={`${id}:marker`} data-scroll-marker-label={label} data-column-item="flexible" data-column data-active={active}>
									<article id={`${id}-list`} data-column-item="flexible" data-card data-scroll-container>
										<span data-tag data-text="muted" data-resource-state="pending" class="loading inline-placeholder" aria-busy="true" aria-label="Loading…">•••</span>
									</article>
								</section>
							{/snippet}

							{#snippet Failed(_error, _retry)}
								<section id={id} aria-labelledby={`${id}:marker`} data-scroll-marker-label={label} data-column-item="flexible" data-column data-active={active}>
									<article id={`${id}-list`} data-column-item="flexible" data-card data-scroll-container>
										<span data-tag data-resource-state="failed" class="inline-placeholder" aria-label="Failed to load">•••</span>
									</article>
								</section>
							{/snippet}
						</ResourceBoundary>
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
								ownsSection: true,
							},
							{
								id: 'aptos-account-resource-list',
								label: 'Resources',
								ownsSection: true,
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

					{#snippet MarkerAptosAccountBalances(_context, Content)}
						{@const aptosAccountResourcesAptosAccountBalancesResource = selection
		.$$balances({
			sources: [
				Source.AptosIndexer_Graphql,
			],
		})}
						<ResourceBoundary
							resource={aptosAccountResourcesAptosAccountBalancesResource}
						>
							{#snippet children(_resolved)}
								{@render Content()}
							{/snippet}

							{#snippet PendingContent()}
								{@render Content()}
							{/snippet}

							{#snippet FailedContent(_error, _retry)}
								{@render Content()}
							{/snippet}
						</ResourceBoundary>
					{/snippet}

					{#snippet SectionAptosAccountBalances({ id, label, open, active })}
						{@const aptosAccountResourcesAptosAccountBalancesResource = selection
		.$$balances({
			sources: [
				Source.AptosIndexer_Graphql,
			],
		})}
						<ResourceBoundary
							resource={aptosAccountResourcesAptosAccountBalancesResource}
						>
							{#snippet children(aptosCoinBalanceTimestamp)}
								<section
									id={id}
									aria-labelledby={`${id}:marker`}
									data-scroll-marker-label={label}
									data-column-item="flexible"
									data-column
									data-active={active}
								>
									<AptosCoinBalance_TimestampsView
										selection={aptosAccountResourcesAptosAccountBalancesResource}
										CollapsibleProps={{ canToggle: false }}
										collapsible={false}
										data-column-item="flexible"
										data-card
										data-scroll-container
										open={open}
										title={label}
										emptyText='No balances found.'
										id={`${id}-list`}
									/>
								</section>
							{/snippet}

							{#snippet Pending()}
								<section id={id} aria-labelledby={`${id}:marker`} data-scroll-marker-label={label} data-column-item="flexible" data-column data-active={active}>
									<article id={`${id}-list`} data-column-item="flexible" data-card data-scroll-container>
										<span data-tag data-text="muted" data-resource-state="pending" class="loading inline-placeholder" aria-busy="true" aria-label="Loading…">•••</span>
									</article>
								</section>
							{/snippet}

							{#snippet Failed(_error, _retry)}
								<section id={id} aria-labelledby={`${id}:marker`} data-scroll-marker-label={label} data-column-item="flexible" data-column data-active={active}>
									<article id={`${id}-list`} data-column-item="flexible" data-card data-scroll-container>
										<span data-tag data-resource-state="failed" class="inline-placeholder" aria-label="Failed to load">•••</span>
									</article>
								</section>
							{/snippet}
						</ResourceBoundary>
					{/snippet}

					{#snippet MarkerAptosAccountResourceList(_context, Content)}
						{@const aptosAccountResourcesAptosAccountResourceListResource = selection
		.$$resources({
			sources: [
				Source.AptosFullnode_Rest,
			],
		})}
						<ResourceBoundary
							resource={aptosAccountResourcesAptosAccountResourceListResource}
						>
							{#snippet children(_resolved)}
								{@render Content()}
							{/snippet}

							{#snippet PendingContent()}
								{@render Content()}
							{/snippet}

							{#snippet FailedContent(_error, _retry)}
								{@render Content()}
							{/snippet}
						</ResourceBoundary>
					{/snippet}

					{#snippet SectionAptosAccountResourceList({ id, label, open, active })}
						{@const aptosAccountResourcesAptosAccountResourceListResource = selection
		.$$resources({
			sources: [
				Source.AptosFullnode_Rest,
			],
		})}
						<ResourceBoundary
							resource={aptosAccountResourcesAptosAccountResourceListResource}
						>
							{#snippet children(aptosAccountResource)}
								<section
									id={id}
									aria-labelledby={`${id}:marker`}
									data-scroll-marker-label={label}
									data-column-item="flexible"
									data-column
									data-active={active}
								>
									<AptosAccountResourcesView
										selection={aptosAccountResourcesAptosAccountResourceListResource}
										CollapsibleProps={{ canToggle: false }}
										collapsible={false}
										data-column-item="flexible"
										data-card
										data-scroll-container
										open={open}
										title={label}
										emptyText='No resources found.'
										id={`${id}-list`}
									/>
								</section>
							{/snippet}

							{#snippet Pending()}
								<section id={id} aria-labelledby={`${id}:marker`} data-scroll-marker-label={label} data-column-item="flexible" data-column data-active={active}>
									<article id={`${id}-list`} data-column-item="flexible" data-card data-scroll-container>
										<span data-tag data-text="muted" data-resource-state="pending" class="loading inline-placeholder" aria-busy="true" aria-label="Loading…">•••</span>
									</article>
								</section>
							{/snippet}

							{#snippet Failed(_error, _retry)}
								<section id={id} aria-labelledby={`${id}:marker`} data-scroll-marker-label={label} data-column-item="flexible" data-column data-active={active}>
									<article id={`${id}-list`} data-column-item="flexible" data-card data-scroll-container>
										<span data-tag data-resource-state="failed" class="inline-placeholder" aria-label="Failed to load">•••</span>
									</article>
								</section>
							{/snippet}
						</ResourceBoundary>
					{/snippet}

				</CollapsibleTabs>
	{/snippet}
</EntityView>
