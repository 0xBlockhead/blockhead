<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { RegisteredEntityProxyData, RegisteredEntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
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
			selection: RegisteredEntityProxyResource<EntityType.BnbBeaconNetwork>
			prefetched?: Partial<RegisteredEntityProxyData<EntityType.BnbBeaconNetwork>>
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
	const bnbBeaconNetwork = $derived(selection({
		sources: selection.sources,
		fields: {
			decommissionedAtMs: true,
		},
	}))
	const titleFallback = $derived('bnb beacon network')
	const viewDomId = $derived('bnb-beacon-network-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
	import BnbBeaconNetwork_TimestampsView from '$/views/BnbBeaconNetwork_TimestampsView.svelte'
	import BnbBeaconBlocksView from '$/views/BnbBeaconBlocksView.svelte'
	import BnbBeaconTransactionsView from '$/views/BnbBeaconTransactionsView.svelte'
	import BnbValidatorsView from '$/views/BnbValidatorsView.svelte'
	import BnbBeaconTokensView from '$/views/BnbBeaconTokensView.svelte'
	import BnbBeaconTokenMigrationsView from '$/views/BnbBeaconTokenMigrationsView.svelte'
</script>


<EntityView
	entityType={EntityType.BnbBeaconNetwork}
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
		{:else}
			<ResourceBoundary resource={bnbBeaconNetwork}>
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
		{/if}
	{/snippet}

	{#snippet Value()}
		{#if prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails}
					{@const decommissionedAtMs0 = pendingEntity.decommissionedAtMs}
					{#if decommissionedAtMs0 !== undefined && decommissionedAtMs0 !== null}
						<Timestamp timestamp={Number(decommissionedAtMs0)} />
					{/if}
		{:else}
			<ResourceBoundary resource={bnbBeaconNetwork}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const decommissionedAtMs0 = resolvedEntity.decommissionedAtMs}
					{#if decommissionedAtMs0 !== undefined && decommissionedAtMs0 !== null}
						<Timestamp timestamp={Number(decommissionedAtMs0)} />
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
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
						sources: selection.sources,
						fields: {
							decommissionedAtMs: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const decommissionedAtMs = resolvedEntity.decommissionedAtMs}
					{#if decommissionedAtMs !== undefined && decommissionedAtMs !== null}
						<div>
							<dt>decommissioned AT ms</dt>
							<dd>
								<Timestamp timestamp={Number(decommissionedAtMs)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						sources: selection.sources,
						fields: {
							fusionDeadlineMs: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const fusionDeadlineMs = resolvedEntity.fusionDeadlineMs}
					{#if fusionDeadlineMs !== undefined && fusionDeadlineMs !== null}
						<div>
							<dt>fusion deadline ms</dt>
							<dd>
								<Timestamp timestamp={Number(fusionDeadlineMs)} />
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
				id={viewDomId + '-carousel-bnb-beacon-chain-activity'}
				sectionIdPrefix={viewDomId}
				sections={
					[
						{
							id: 'bnb-beacon-chain-observations',
							label: 'Observations',
						},
						{
							id: 'bnb-beacon-chain-blocks',
							label: 'Blocks',
						},
						{
							id: 'bnb-beacon-chain-transactions',
							label: 'Transactions',
						},
					]
				}
				data-card
				class='network-view-collapsible-chain-activity'
			>
				{#snippet Summary()}
					<header data-row-item="flexible" data-row="wrap gap-4">
						<HeadingComponent>Chain activity</HeadingComponent>
					</header>
				{/snippet}

				{#snippet SectionBnbBeaconChainObservations({ id, label, open })}
					<BnbBeaconNetwork_TimestampsView
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

				{#snippet SectionBnbBeaconChainBlocks({ id, label, open })}
					<BnbBeaconBlocksView
						selection={selection.$$blocks}
						CollapsibleProps={{ canToggle: false }}
						collapsible={false}
						data-column-item="flexible"
						data-card
						data-scroll-container
						emptyText='No blocks found.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

				{#snippet SectionBnbBeaconChainTransactions({ id, label, open })}
					<BnbBeaconTransactionsView
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
				id={viewDomId + '-carousel-bnb-beacon-validators'}
				sectionIdPrefix={viewDomId}
				sections={
					[
						{
							id: 'bnb-beacon-validator-list',
							label: 'Validators',
						},
					]
				}
				data-card
				class='network-view-collapsible-validators'
			>
				{#snippet Summary()}
					<header data-row-item="flexible" data-row="wrap gap-4">
						<HeadingComponent>Validators</HeadingComponent>
					</header>
				{/snippet}

				{#snippet SectionBnbBeaconValidatorList({ id, label, open })}
					<BnbValidatorsView
						selection={selection.$$validators}
						CollapsibleProps={{ canToggle: false }}
						collapsible={false}
						data-column-item="flexible"
						data-card
						data-scroll-container
						emptyText='No validators found.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

			</CollapsibleTabs>

			<CollapsibleTabs
				id={viewDomId + '-carousel-bnb-beacon-tokens-migration'}
				sectionIdPrefix={viewDomId}
				sections={
					[
						{
							id: 'bnb-beacon-tokens',
							label: 'Tokens',
						},
						{
							id: 'bnb-beacon-migrations',
							label: 'Migration records',
						},
					]
				}
				data-card
				class='network-view-collapsible-tokens-migration'
			>
				{#snippet Summary()}
					<header data-row-item="flexible" data-row="wrap gap-4">
						<HeadingComponent>Tokens and migration</HeadingComponent>
					</header>
				{/snippet}

				{#snippet SectionBnbBeaconTokens({ id, label, open })}
					<BnbBeaconTokensView
						selection={selection.$$tokens}
						CollapsibleProps={{ canToggle: false }}
						collapsible={false}
						data-column-item="flexible"
						data-card
						data-scroll-container
						emptyText='No tokens found.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

				{#snippet SectionBnbBeaconMigrations({ id, label, open })}
					<BnbBeaconTokenMigrationsView
						selection={selection.$$migrationRecords}
						CollapsibleProps={{ canToggle: false }}
						collapsible={false}
						data-column-item="flexible"
						data-card
						data-scroll-container
						emptyText='No migration records found.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

			</CollapsibleTabs>
		{/if}
	{/snippet}
</EntityView>
