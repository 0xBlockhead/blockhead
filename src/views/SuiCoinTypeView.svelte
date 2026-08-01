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
	}: EntitySelectionViewProps<EntityType.SuiCoinType> = $props()

	const viewDomId = $derived('sui-coin-type-' + encodeURIComponent(stringify(selection.entitySelector)))


	// Components
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import SuiNetworkView from '$/views/SuiNetworkView.svelte'
	import MoveStructView from '$/views/MoveStructView.svelte'
	import SuiObjectView from '$/views/SuiObjectView.svelte'
	import AssetInstanceView from '$/views/AssetInstanceView.svelte'
	import SuiCoinBalance_TimestampsView from '$/views/SuiCoinBalance_TimestampsView.svelte'
	import SuiObjectsView from '$/views/SuiObjectsView.svelte'
	import SuiRegulatedCoinState_TimestampsView from '$/views/SuiRegulatedCoinState_TimestampsView.svelte'
</script>


<EntityView
	entityType={EntityType.SuiCoinType}
	entitySelector={selection.entitySelector}
	id={viewDomId}
	title={title ?? 'Sui coin type'}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>network</dt>
				<dd>
					<SuiNetworkView
						selection={select(EntityType.SuiNetwork, selection.entitySelector.$network)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<div>
				<dt>coin type</dt>
				<dd>
					{selection.entitySelector.coinType}
				</dd>
			</div>

			<ResourceBoundary
				resource={selection.$definingStruct}
			>
				{#snippet children(moveStruct)}
					{#if moveStruct != null}
						<div>
							<dt>defining struct</dt>
							<dd>
								<MoveStructView
									selection={select(EntityType.MoveStruct, moveStruct[EntityMetaKey.Selector])}
									prefetched={moveStruct}
									layout={EntityLayout.Value}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$treasuryCap}
			>
				{#snippet children(suiObject)}
					{#if suiObject != null}
						<div>
							<dt>treasury cap</dt>
							<dd>
								<SuiObjectView
									selection={select(EntityType.SuiObject, suiObject[EntityMetaKey.Selector])}
									prefetched={suiObject}
									layout={EntityLayout.Value}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$assetInstance}
			>
				{#snippet children(assetInstance)}
					{#if assetInstance != null}
						<div>
							<dt>asset instance</dt>
							<dd>
								<AssetInstanceView
									selection={select(EntityType.AssetInstance, assetInstance[EntityMetaKey.Selector])}
									prefetched={assetInstance}
									layout={EntityLayout.Value}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							decimals: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const decimals = entity.decimals}
					{#if decimals != null}
						<div>
							<dt>Decimals</dt>
							<dd>
								{decimals}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							symbol: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const symbol = entity.symbol}
					{#if symbol != null}
						<div>
							<dt>Symbol</dt>
							<dd>
								{symbol}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							name: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const name = entity.name}
					{#if name != null}
						<div>
							<dt>Name</dt>
							<dd>
								{name}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							description: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const description = entity.description}
					{#if description != null}
						<div>
							<dt>Description</dt>
							<dd>
								{description}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							iconUrl: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const iconUrl = entity.iconUrl}
					{#if iconUrl != null}
						<div>
							<dt>icon URL</dt>
							<dd>
								<a
									href={iconUrl}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={iconUrl} />
								</a>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details()}
		<CollapsibleTabs
			id={viewDomId + '-carousel-sui-coin-type-activity-a'}
			sectionIdPrefix={viewDomId}
			sections={
				[
					{
						id: 'sui-coin-type-balances',
						label: 'Balances',
					},
					{
						id: 'sui-coin-type-objects',
						label: 'Objects',
					},
				]
			}
			data-card
			class='network-view-collapsible-activity-a'
		>
			{#snippet Summary()}
				<header data-row-item="flexible" data-row="wrap gap-4">
					<HeadingComponent>Activity</HeadingComponent>
				</header>
			{/snippet}

			{#snippet SectionSuiCoinTypeBalances({ id, label, open })}
				<SuiCoinBalance_TimestampsView
					selection={selection.$$balances}
					collapsible={false}
					title={label}
					emptyText='No balances.'
					id={`${id}-list`}
				/>
			{/snippet}

			{#snippet SectionSuiCoinTypeObjects({ id, label, open })}
				<SuiObjectsView
					selection={selection.$$objects}
					collapsible={false}
					title={label}
					emptyText='No objects.'
					id={`${id}-list`}
				/>
			{/snippet}

		</CollapsibleTabs>

		<CollapsibleTabs
			id={viewDomId + '-carousel-sui-coin-type-activity-b'}
			sectionIdPrefix={viewDomId}
			sections={
				[
					{
						id: 'sui-coin-type-regulated-states',
						label: 'Regulated States',
					},
				]
			}
			data-card
			class='network-view-collapsible-activity-b'
		>
			{#snippet Summary()}
				<header data-row-item="flexible" data-row="wrap gap-4">
					<HeadingComponent>Activity continued</HeadingComponent>
				</header>
			{/snippet}

			{#snippet SectionSuiCoinTypeRegulatedStates({ id, label, open })}
				<SuiRegulatedCoinState_TimestampsView
					selection={selection.$$regulatedStates}
					collapsible={false}
					title={label}
					emptyText='No regulated states.'
					id={`${id}-list`}
				/>
			{/snippet}

		</CollapsibleTabs>
	{/snippet}
</EntityView>
