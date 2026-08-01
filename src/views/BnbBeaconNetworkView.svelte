<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'
	import { stringify } from 'devalue'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		title,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: Omit<EntitySelectionViewProps<EntityType.BnbBeaconNetwork>, 'prefetched'> = $props()

	const bnbBeaconNetwork = $derived(selection({
		fields: {
			decommissionedAtMs: true,
		},
	}))
	const viewDomId = $derived('bnb-beacon-network-' + encodeURIComponent(stringify(selection.entitySelector)))


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
	entitySelector={selection.entitySelector}
	id={viewDomId}
	title={title ?? 'bnb beacon network'}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<NetworkView
			selection={select(EntityType.Network, selection.entitySelector.$network)}
			href={null}
			layout={EntityLayout.Title}
		/>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={bnbBeaconNetwork}>
			{#snippet children(entity)}
				{@const decommissionedAtMs = entity.decommissionedAtMs}
				{#if decommissionedAtMs != null}
					<Timestamp timestamp={decommissionedAtMs} />
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>network</dt>
				<dd>
					<NetworkView
						selection={select(EntityType.Network, selection.entitySelector.$network)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<ResourceBoundary
				resource={bnbBeaconNetwork}
			>
				{#snippet children(entity)}
					{@const decommissionedAtMs = entity.decommissionedAtMs}
					{#if decommissionedAtMs != null}
						<div>
							<dt>decommissioned AT ms</dt>
							<dd>
								<Timestamp timestamp={decommissionedAtMs} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							fusionDeadlineMs: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const fusionDeadlineMs = entity.fusionDeadlineMs}
					{#if fusionDeadlineMs != null}
						<div>
							<dt>fusion deadline ms</dt>
							<dd>
								<Timestamp timestamp={fusionDeadlineMs} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details()}
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

			{#snippet SectionBnbBeaconChainObservations({ id, label })}
				<BnbBeaconNetwork_TimestampsView
					selection={selection.$$timestamps}
					collapsible={false}
					title={label}
					emptyText='No observations yet.'
					id={`${id}-list`}
				/>
			{/snippet}

			{#snippet SectionBnbBeaconChainBlocks({ id, label })}
				<BnbBeaconBlocksView
					selection={selection.$$blocks}
					collapsible={false}
					title={label}
					emptyText='No blocks found.'
					id={`${id}-list`}
				/>
			{/snippet}

			{#snippet SectionBnbBeaconChainTransactions({ id, label })}
				<BnbBeaconTransactionsView
					selection={selection.$$transactions}
					collapsible={false}
					title={label}
					emptyText='No transactions found.'
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

			{#snippet SectionBnbBeaconValidatorList({ id, label })}
				<BnbValidatorsView
					selection={selection.$$validators}
					collapsible={false}
					title={label}
					emptyText='No validators found.'
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

			{#snippet SectionBnbBeaconTokens({ id, label })}
				<BnbBeaconTokensView
					selection={selection.$$tokens}
					collapsible={false}
					title={label}
					emptyText='No tokens found.'
					id={`${id}-list`}
				/>
			{/snippet}

			{#snippet SectionBnbBeaconMigrations({ id, label })}
				<BnbBeaconTokenMigrationsView
					selection={selection.$$migrationRecords}
					collapsible={false}
					title={label}
					emptyText='No migration records found.'
					id={`${id}-list`}
				/>
			{/snippet}

		</CollapsibleTabs>
	{/snippet}
</EntityView>
