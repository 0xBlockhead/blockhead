<!-- Generated from APP.ts. Do not edit by hand. -->

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
		prefetched = {},
		title,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: EntitySelectionViewProps<EntityType.HederaToken> = $props()

	const pendingEntity = $derived({ ...selection.entitySelector, ...prefetched })
	const hederaToken = $derived(selection({
		fields: {
			tokenType: true,
			decimals: true,
		},
	}))
	const titleFallback = $derived((pendingEntity.tokenId ?? '') || 'hedera token')
	const viewDomId = $derived('hedera-token-' + encodeURIComponent(stringify(selection.entitySelector)))


	// Components
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
	import HederaTokenAssociationsView from '$/views/HederaTokenAssociationsView.svelte'
	import HederaNftsView from '$/views/HederaNftsView.svelte'
	import HederaToken_TimestampsView from '$/views/HederaToken_TimestampsView.svelte'
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
	{#snippet Title()}
		{(pendingEntity.tokenId ?? '') || 'hedera token'}
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={hederaToken}>
			{#snippet children(entity)}
				{entity.tokenType || pendingEntity.tokenId || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={hederaToken}>
			{#snippet children(entity)}
				{@const decimals0 = entity.decimals}
				{#if decimals0 != null}
					<span data-text="muted">
						<NumberValue
							value={decimals0}
						/>
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>network</dt>
				<dd>
					<NetworkView
						selection={select(EntityType.Network, selection.entitySelector.$network)}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>Token ID</dt>
				<dd>
					{pendingEntity.tokenId}
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

	{#snippet Details({ open: detailsOpen })}
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

			{#snippet SectionHederaTokenAssociations({ id, label, open })}
				<HederaTokenAssociationsView
					selection={selection.$$associations}
					CollapsibleProps={{ canToggle: false }}
					collapsible={false}
					data-column-item="flexible"
					data-card
					data-scroll-container
					open={open}
					title={label}
					emptyText='No associations.'
					id={`${id}-list`}
				/>
			{/snippet}

			{#snippet SectionHederaTokenNfts({ id, label, open })}
				<HederaNftsView
					selection={selection.$$nfts}
					CollapsibleProps={{ canToggle: false }}
					collapsible={false}
					data-column-item="flexible"
					data-card
					data-scroll-container
					open={open}
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

			{#snippet SectionHederaTokenTimestamps({ id, label, open })}
				<HederaToken_TimestampsView
					selection={selection.$$timestamps}
					CollapsibleProps={{ canToggle: false }}
					collapsible={false}
					data-column-item="flexible"
					data-card
					data-scroll-container
					open={open}
					title={label}
					emptyText='No timestamps.'
					id={`${id}-list`}
				/>
			{/snippet}

		</CollapsibleTabs>
	{/snippet}
</EntityView>
