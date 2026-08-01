<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { stringify } from 'devalue'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		prefetched = {},
		title,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: EntitySelectionViewProps<EntityType.HederaToken> = $props()

	const hederaToken = $derived(selection({
		fields: {
			tokenType: true,
			decimals: true,
		},
	}))
	const titleFallback = $derived(selection.entitySelector.tokenId || 'hedera token')
	const viewDomId = $derived('hedera-token-' + encodeURIComponent(stringify(selection.entitySelector)))


	// Components
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import EntitiesList from '$/components/EntitiesList.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
	import HederaTokenAssociationsView from '$/views/HederaTokenAssociationsView.svelte'
	import HederaNftsView from '$/views/HederaNftsView.svelte'
</script>


<EntityView
	entityType={EntityType.HederaToken}
	entitySelector={selection.entitySelector}
	id={viewDomId}
	title={title ?? titleFallback}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Value()}
		<ResourceBoundary resource={hederaToken}>
			{#snippet children(entity)}
				{entity.tokenType || selection.entitySelector.tokenId || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={hederaToken}>
			{#snippet children(entity)}
				{@const decimals = entity.decimals}
				{#if decimals != null}
					<span data-text="muted">
						<NumberValue
							value={decimals}
						/>
					</span>
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

			<div>
				<dt>Token ID</dt>
				<dd>
					{selection.entitySelector.tokenId}
				</dd>
			</div>

			<div>
				<dt>token type</dt>
				<dd>
					<ResourceBoundary
						resource={hederaToken}
					>
						{#snippet children(entity)}
							{entity.tokenType}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					selection({
						fields: {
							supplyType: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const supplyType = entity.supplyType}
					{#if supplyType != null}
						<div>
							<dt>supply type</dt>
							<dd>
								{supplyType}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={hederaToken}
			>
				{#snippet children(entity)}
					{@const decimals = entity.decimals}
					{#if decimals != null}
						<div>
							<dt>Decimals</dt>
							<dd>
								<NumberValue
									value={decimals}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details()}
		<CollapsibleTabs
			id={viewDomId + '-carousel-hedera-token-activity'}
			sectionIdPrefix={viewDomId}
			sections={
				[
					{
						id: 'hedera-token-associations',
						label: 'Associations',
					},
					{
						id: 'hedera-token-nfts',
						label: 'NFTs',
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

			{#snippet SectionHederaTokenAssociations({ id, label })}
				<HederaTokenAssociationsView
					selection={selection.$$associations}
					collapsible={false}
					title={label}
					emptyText='No associations.'
					id={`${id}-list`}
				/>
			{/snippet}

			{#snippet SectionHederaTokenNfts({ id, label })}
				<HederaNftsView
					selection={selection.$$nfts}
					collapsible={false}
					title={label}
					emptyText='No NFTs.'
					id={`${id}-list`}
				/>
			{/snippet}

		</CollapsibleTabs>

		<CollapsibleTabs
			id={viewDomId + '-carousel-hedera-token-observations'}
			sectionIdPrefix={viewDomId}
			sections={
				[
					{
						id: 'hedera-token-timestamps',
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

			{#snippet SectionHederaTokenTimestamps({ id, label })}
				<EntitiesList
					entityType={EntityType.HederaToken_Timestamp}
					collapsible={false}
					title={label}
					emptyText='No timestamps.'
					open={true}
					id={`${id}-list`}
					resource={selection.$$timestamps()}
				>
					{#snippet Item({ item: hederaTokenTimestamp })}
						<EntityView
							entityType={EntityType.HederaToken_Timestamp}
							entitySelector={hederaTokenTimestamp[EntityMetaKey.Selector]}
						/>
					{/snippet}
				</EntitiesList>
			{/snippet}

		</CollapsibleTabs>
	{/snippet}
</EntityView>
