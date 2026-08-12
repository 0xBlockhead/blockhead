<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import ProjectionBoundary from '$/components/ProjectionBoundary.svelte'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { untrack } from 'svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { stringify } from 'devalue'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		title,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: Omit<EntitySelectionViewProps<EntityType.Account>, 'prefetched'> = $props()

	const account = $derived(selection({
		sources: selection.sources ?? [
			Source.Constants_Internal,
		],
		fields: {
			namespace: true,
			address: true,
		},
	}))
	const viewDomId = $derived('account-' + encodeURIComponent(stringify(selection.entitySelector)))


	// Components
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import IconComponent from '$/components/Icon.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
	import EvmNetworkAccountView from '$/views/EvmNetworkAccountView.svelte'
	import SuiAccountView from '$/views/SuiAccountView.svelte'
	import TezosAccountView from '$/views/TezosAccountView.svelte'
</script>


<EntityView
	entityType={EntityType.Account}
	entitySelector={selection.entitySelector}
	id={viewDomId}
	title={title ?? (`${selection.entitySelector.caip10.namespace}:${selection.entitySelector.caip10.reference}:${selection.entitySelector.caip10.accountAddress}` || 'account')}
	href={
		href === undefined ?
			resolve(
				'/(explore)/account/[namespace=stringSegment]:[reference=stringSegment]/[accountAddress=stringSegment]',
				{
					namespace: selection.entitySelector.caip10.namespace,
					reference: selection.entitySelector.caip10.reference,
					accountAddress: selection.entitySelector.caip10.accountAddress,
				}
			)
		:
			href ?? undefined
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Icon()}
		<IconComponent />
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>CAIP-10</dt>
				<dd>
					<TruncatedValue value={`${selection.entitySelector.caip10.namespace}:${selection.entitySelector.caip10.reference}:${selection.entitySelector.caip10.accountAddress}`} />
				</dd>
			</div>

			<div>
				<dt>network</dt>
				<dd>
					<ResourceBoundary
						resource={selection.$network}
					>
						{#snippet children(network)}
							{@const networkInitial = untrack(() => network)}
							<NetworkView
								selection={select(EntityType.Network, (network ?? networkInitial)[EntityMetaKey.Selector])}
								prefetched={network ?? networkInitial}
								layout={EntityLayout.Value}
							/>
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Namespace</dt>
				<dd>
					<ResourceBoundary
						resource={account}
					>
						{#snippet children(entity)}
							{entity.namespace}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Address</dt>
				<dd>
					<ResourceBoundary
						resource={account}
					>
						{#snippet children(entity)}
							<TruncatedValue value={entity.address} />
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>
	{/snippet}

	{#snippet Details()}
		<ProjectionBoundary
			resource={selection.Evm}
		>
			{#snippet Applicable(projection)}
				<CollapsibleTabs
					id={viewDomId + '-carousel-account-evm'}
					sectionIdPrefix={viewDomId}
					sections={
						[
							{
								id: 'account-evm-projection',
								label: 'EVM holdings and positions',
								ownsSection: true,
							},
						]
					}
					data-card
					class='account-view-collapsible-evm'
				>
					{#snippet Summary()}
						<header data-row-item="flexible" data-row="wrap gap-4">
							<HeadingComponent>EVM holdings and positions</HeadingComponent>
						</header>
					{/snippet}

					{#snippet SectionAccountEvmProjection({ id, label, active })}
						<ResourceBoundary
							resource={projection.$account}
						>
							{#snippet children(evmNetworkAccount)}
								{@const evmNetworkAccountInitial = untrack(() => evmNetworkAccount)}
								<section
									id={id}
									aria-labelledby={`${id}:marker`}
									data-scroll-marker-label={label}
									data-column-item="flexible"
									data-column
									data-active={active}
								>
									<EvmNetworkAccountView
										selection={
											select(EntityType.EvmNetworkAccount, (evmNetworkAccount ?? evmNetworkAccountInitial)[EntityMetaKey.Selector], {
												sources: selection.sources,
											})
										}
										layout={EntityLayout.SummaryDetails}
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
		</ProjectionBoundary>

		<ProjectionBoundary
			resource={selection.Sui}
		>
			{#snippet Applicable(projection)}
				<CollapsibleTabs
					id={viewDomId + '-carousel-account-sui'}
					sectionIdPrefix={viewDomId}
					sections={
						[
							{
								id: 'account-sui-projection',
								label: 'Sui account',
								ownsSection: true,
							},
						]
					}
					data-card
					class='account-view-collapsible-sui'
				>
					{#snippet Summary()}
						<header data-row-item="flexible" data-row="wrap gap-4">
							<HeadingComponent>Sui</HeadingComponent>
						</header>
					{/snippet}

					{#snippet SectionAccountSuiProjection({ id, label, active })}
						<ResourceBoundary
							resource={projection.$account}
						>
							{#snippet children(suiAccount)}
								{@const suiAccountInitial = untrack(() => suiAccount)}
								<section
									id={id}
									aria-labelledby={`${id}:marker`}
									data-scroll-marker-label={label}
									data-column-item="flexible"
									data-column
									data-active={active}
								>
									<SuiAccountView
										selection={
											select(EntityType.SuiAccount, (suiAccount ?? suiAccountInitial)[EntityMetaKey.Selector], {
												sources: selection.sources,
											})
										}
										layout={EntityLayout.SummaryDetails}
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
		</ProjectionBoundary>

		<ProjectionBoundary
			resource={selection.Tezos}
		>
			{#snippet Applicable(projection)}
				<CollapsibleTabs
					id={viewDomId + '-carousel-account-tezos'}
					sectionIdPrefix={viewDomId}
					sections={
						[
							{
								id: 'account-tezos-projection',
								label: 'Tezos account',
								ownsSection: true,
							},
						]
					}
					data-card
					class='account-view-collapsible-tezos'
				>
					{#snippet Summary()}
						<header data-row-item="flexible" data-row="wrap gap-4">
							<HeadingComponent>Tezos</HeadingComponent>
						</header>
					{/snippet}

					{#snippet SectionAccountTezosProjection({ id, label, active })}
						<ResourceBoundary
							resource={projection.$account}
						>
							{#snippet children(tezosAccount)}
								{@const tezosAccountInitial = untrack(() => tezosAccount)}
								<section
									id={id}
									aria-labelledby={`${id}:marker`}
									data-scroll-marker-label={label}
									data-column-item="flexible"
									data-column
									data-active={active}
								>
									<TezosAccountView
										selection={
											select(EntityType.TezosAccount, (tezosAccount ?? tezosAccountInitial)[EntityMetaKey.Selector], {
												sources: selection.sources,
											})
										}
										layout={EntityLayout.SummaryDetails}
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
		</ProjectionBoundary>
	{/snippet}
</EntityView>
