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
	}: Omit<EntitySelectionViewProps<EntityType.BnbBeaconToken>, 'prefetched'> = $props()

	const bnbBeaconToken = $derived(selection({
		fields: {
			tokenName: true,
			tokenType: true,
		},
	}))
	const titleFallback = $derived(selection.entitySelector.symbol || 'bnb beacon token')
	const viewDomId = $derived('bnb-beacon-token-' + encodeURIComponent(stringify(selection.entitySelector)))


	// Components
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import BnbBeaconNetworkView from '$/views/BnbBeaconNetworkView.svelte'
	import BnbBeaconTokenTransfersView from '$/views/BnbBeaconTokenTransfersView.svelte'
	import BnbBeaconTokenMigrationsView from '$/views/BnbBeaconTokenMigrationsView.svelte'
	import BnbBeaconToken_TimestampsView from '$/views/BnbBeaconToken_TimestampsView.svelte'
</script>


<EntityView
	entityType={EntityType.BnbBeaconToken}
	entitySelector={selection.entitySelector}
	id={viewDomId}
	title={title ?? titleFallback}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Value()}
		<ResourceBoundary resource={bnbBeaconToken}>
			{#snippet children(entity)}
				{[(entity.tokenName ?? ''), (entity.tokenType ?? '')].filter(Boolean).join(' ') || selection.entitySelector.symbol || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>network</dt>
				<dd>
					<BnbBeaconNetworkView
						selection={select(EntityType.BnbBeaconNetwork, selection.entitySelector.$network)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<div>
				<dt>Symbol</dt>
				<dd>
					{selection.entitySelector.symbol}
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							originalSymbol: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const originalSymbol = entity.originalSymbol}
					{#if originalSymbol != null}
						<div>
							<dt>original symbol</dt>
							<dd>
								{originalSymbol}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={bnbBeaconToken}
			>
				{#snippet children(entity)}
					{@const tokenName = entity.tokenName}
					{#if tokenName != null}
						<div>
							<dt>token name</dt>
							<dd>
								{tokenName}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={bnbBeaconToken}
			>
				{#snippet children(entity)}
					{@const tokenType = entity.tokenType}
					{#if tokenType != null}
						<div>
							<dt>token type</dt>
							<dd>
								{tokenType}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							ownerAddress: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const ownerAddress = entity.ownerAddress}
					{#if ownerAddress != null}
						<div>
							<dt>owner address</dt>
							<dd>
								<TruncatedValue value={ownerAddress} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details()}
		<CollapsibleTabs
			id={viewDomId + '-carousel-bnb-beacon-token-activity'}
			sectionIdPrefix={viewDomId}
			sections={
				[
					{
						id: 'bnb-beacon-token-transfers',
						label: 'Transfers',
					},
					{
						id: 'bnb-beacon-token-migrations',
						label: 'Migrations',
					},
				]
			}
			data-card
			class='network-view-collapsible-activity'
		>
			{#snippet Summary()}
				<header data-row-item="flexible" data-row="wrap gap-4">
					<HeadingComponent>Activity</HeadingComponent>
				</header>
			{/snippet}

			{#snippet SectionBnbBeaconTokenTransfers({ id, label })}
				<BnbBeaconTokenTransfersView
					selection={selection.$$transfers}
					collapsible={false}
					title={label}
					emptyText='No transfers.'
					id={`${id}-list`}
				/>
			{/snippet}

			{#snippet SectionBnbBeaconTokenMigrations({ id, label })}
				<BnbBeaconTokenMigrationsView
					selection={selection.$$migrations}
					collapsible={false}
					title={label}
					emptyText='No migrations.'
					id={`${id}-list`}
				/>
			{/snippet}

		</CollapsibleTabs>

		<CollapsibleTabs
			id={viewDomId + '-carousel-bnb-beacon-token-observations'}
			sectionIdPrefix={viewDomId}
			sections={
				[
					{
						id: 'bnb-beacon-token-timestamps',
						label: 'Timestamps',
					},
				]
			}
			data-card
			class='network-view-collapsible-observations'
		>
			{#snippet Summary()}
				<header data-row-item="flexible" data-row="wrap gap-4">
					<HeadingComponent>Observations</HeadingComponent>
				</header>
			{/snippet}

			{#snippet SectionBnbBeaconTokenTimestamps({ id, label })}
				<BnbBeaconToken_TimestampsView
					selection={selection.$$timestamps}
					collapsible={false}
					title={label}
					emptyText='No timestamps.'
					id={`${id}-list`}
				/>
			{/snippet}

		</CollapsibleTabs>
	{/snippet}
</EntityView>
