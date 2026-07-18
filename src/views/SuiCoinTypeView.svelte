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
			selection: RegisteredEntityProxyResource<EntityType.SuiCoinType>
			prefetched?: Partial<RegisteredEntityProxyData<EntityType.SuiCoinType>>
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
	const suiCoinType = $derived(selection({
		sources: selection.sources,
	}))
	const titleFallback = $derived('Sui coin type')
	const viewDomId = $derived('sui-coin-type-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


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
			{title || titleFallback}
		{:else}
			<ResourceBoundary resource={suiCoinType}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{title || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>network</dt>
				<dd>
					<SuiNetworkView
						selection={select(EntityType.SuiNetwork, selection.entitySelector.$network, {})}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>coin type</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									coinType: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const coinType = resolvedEntity.coinType}
							{#if coinType !== undefined && coinType !== null}
								{String((coinType) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={selection.$definingStruct}
			>
				{#snippet children(moveStruct)}
					{#if moveStruct != null && moveStruct[EntityMetaKey.Selector] != null}
						<div>
							<dt>defining struct</dt>
							<dd>
								<MoveStructView
									selection={select(EntityType.MoveStruct, moveStruct[EntityMetaKey.Selector])}
									prefetched={moveStruct}
									layout={EntityLayout.Value}
									open={false}
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
					{#if suiObject != null && suiObject[EntityMetaKey.Selector] != null}
						<div>
							<dt>treasury cap</dt>
							<dd>
								<SuiObjectView
									selection={select(EntityType.SuiObject, suiObject[EntityMetaKey.Selector])}
									prefetched={suiObject}
									layout={EntityLayout.Value}
									open={false}
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
					{#if assetInstance != null && assetInstance[EntityMetaKey.Selector] != null}
						<div>
							<dt>asset instance</dt>
							<dd>
								<AssetInstanceView
									selection={select(EntityType.AssetInstance, assetInstance[EntityMetaKey.Selector])}
									prefetched={assetInstance}
									href={
										(assetInstance[EntityMetaKey.Selector].kind !== undefined && assetInstance[EntityMetaKey.Selector].assetKey !== undefined && assetInstance[EntityMetaKey.Selector].$network !== undefined && assetInstance[EntityMetaKey.Selector].$network.caip2 !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/asset/[kind=stringSegment]/[assetKey=stringSegment]', {
											kind: String(assetInstance[EntityMetaKey.Selector].kind ?? ''),
											assetKey: String(assetInstance[EntityMetaKey.Selector].assetKey ?? ''),
											network: String(caip2StringFromValue(assetInstance[EntityMetaKey.Selector].$network.caip2) ?? ''),
										}) : assetInstance[EntityMetaKey.Selector].kind !== undefined && assetInstance[EntityMetaKey.Selector].assetKey !== undefined && assetInstance[EntityMetaKey.Selector].$network !== undefined && assetInstance[EntityMetaKey.Selector].$network.slug !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/asset/[kind=stringSegment]/[assetKey=stringSegment]', {
											kind: String(assetInstance[EntityMetaKey.Selector].kind ?? ''),
											assetKey: String(assetInstance[EntityMetaKey.Selector].assetKey ?? ''),
											network: String(assetInstance[EntityMetaKey.Selector].$network.slug ?? ''),
										}) : undefined)
									}
									layout={EntityLayout.Value}
									open={false}
								/>
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
							decimals: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const decimals = resolvedEntity.decimals}
					{#if decimals !== undefined && decimals !== null}
						<div>
							<dt>Decimals</dt>
							<dd>
								{String((decimals) ?? '')}
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
							symbol: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const symbol = resolvedEntity.symbol}
					{#if symbol !== undefined && symbol !== null}
						<div>
							<dt>Symbol</dt>
							<dd>
								{String((symbol) ?? '')}
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
							name: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const name = resolvedEntity.name}
					{#if name !== undefined && name !== null}
						<div>
							<dt>Name</dt>
							<dd>
								{String((name) ?? '')}
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
							description: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const description = resolvedEntity.description}
					{#if description !== undefined && description !== null}
						<div>
							<dt>Description</dt>
							<dd>
								{String((description) ?? '')}
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
							iconUrl: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const iconUrl = resolvedEntity.iconUrl}
					{#if iconUrl !== undefined && iconUrl !== null}
						<div>
							<dt>icon URL</dt>
							<dd>
								<svelte:element
									this={'a'}
									href={String(iconUrl)}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={String(iconUrl)} />
								</svelte:element>
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
						CollapsibleProps={{ canToggle: false }}
						collapsible={false}
						data-column-item="flexible"
						data-card
						data-scroll-container
						emptyText='No balances.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

				{#snippet SectionSuiCoinTypeObjects({ id, label, open })}
					<SuiObjectsView
						selection={selection.$$objects}
						CollapsibleProps={{ canToggle: false }}
						collapsible={false}
						data-column-item="flexible"
						data-card
						data-scroll-container
						emptyText='No objects.'
						open={open}
						title={label}
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
						CollapsibleProps={{ canToggle: false }}
						collapsible={false}
						data-column-item="flexible"
						data-card
						data-scroll-container
						emptyText='No regulated states.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

			</CollapsibleTabs>
		{/if}
	{/snippet}
</EntityView>
