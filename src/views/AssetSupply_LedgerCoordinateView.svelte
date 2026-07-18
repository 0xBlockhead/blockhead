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
			selection: RegisteredEntityProxyResource<EntityType.AssetSupply_LedgerCoordinate>
			prefetched?: Partial<RegisteredEntityProxyData<EntityType.AssetSupply_LedgerCoordinate>>
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
	const assetSupplyLedgerCoordinate = $derived(selection({
		sources: selection.sources,
		fields: {
			totalSupply: true,
			$assetInstance: {
				fields: {
					decimals: true,
					symbol: true,
				},
			},
		},
	}))
	const titleFallback = $derived([String((pendingEntity.supplyScopeKey) ?? '')].filter(Boolean).join(' ') || 'asset supply ledger coordinate')
	const viewDomId = $derived('asset-supply-ledger-coordinate-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import AssetInstanceView from '$/views/AssetInstanceView.svelte'
	import AssetClassView from '$/views/AssetClassView.svelte'
</script>


<EntityView
	entityType={EntityType.AssetSupply_LedgerCoordinate}
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
			{[String((pendingEntity.supplyScopeKey) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
		{:else}
			<ResourceBoundary resource={assetSupplyLedgerCoordinate}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{[String((resolvedEntity.supplyScopeKey) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Value()}
		{#if prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails}
					{@const totalSupply0 = pendingEntity.totalSupply}
					{#if totalSupply0 !== undefined && totalSupply0 !== null}
						<NumberValue
							value={totalSupply0}
							decimalPlaces={pendingEntity.$assetInstance.decimals}
						/>

						<span>{pendingEntity.$assetInstance.symbol == null ? '' : ` ${String(pendingEntity.$assetInstance.symbol)}`}</span>
					{/if}
		{:else}
			<ResourceBoundary resource={assetSupplyLedgerCoordinate}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const totalSupply0 = resolvedEntity.totalSupply}
					{#if totalSupply0 !== undefined && totalSupply0 !== null}
						<NumberValue
							value={totalSupply0}
							decimalPlaces={resolvedEntity.$assetInstance.decimals}
						/>

						<span>{resolvedEntity.$assetInstance.symbol == null ? '' : ` ${String(resolvedEntity.$assetInstance.symbol)}`}</span>
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet HeadingAfter()}
		{#if prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails}
			{@const source0 = pendingEntity.source}
			{#if source0 !== undefined && source0 !== null}
				<span data-text="muted">
					{String((source0) ?? '')}
				</span>
			{/if}
		{:else}
			<ResourceBoundary resource={assetSupplyLedgerCoordinate}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const source0 = resolvedEntity.source}
					{#if source0 !== undefined && source0 !== null}
						<span data-text="muted">
							{String((source0) ?? '')}
						</span>
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>asset instance</dt>
				<dd>
					<AssetInstanceView
						selection={select(EntityType.AssetInstance, selection.entitySelector.$assetInstance, {})}
						href={
							(selection.entitySelector.$assetInstance.kind !== undefined && selection.entitySelector.$assetInstance.assetKey !== undefined && selection.entitySelector.$assetInstance.$network !== undefined && selection.entitySelector.$assetInstance.$network.caip2 !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/asset/[kind=stringSegment]/[assetKey=stringSegment]', {
								kind: String(selection.entitySelector.$assetInstance.kind ?? ''),
								assetKey: String(selection.entitySelector.$assetInstance.assetKey ?? ''),
								network: String(caip2StringFromValue(selection.entitySelector.$assetInstance.$network.caip2) ?? ''),
							}) : selection.entitySelector.$assetInstance.kind !== undefined && selection.entitySelector.$assetInstance.assetKey !== undefined && selection.entitySelector.$assetInstance.$network !== undefined && selection.entitySelector.$assetInstance.$network.slug !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/asset/[kind=stringSegment]/[assetKey=stringSegment]', {
								kind: String(selection.entitySelector.$assetInstance.kind ?? ''),
								assetKey: String(selection.entitySelector.$assetInstance.assetKey ?? ''),
								network: String(selection.entitySelector.$assetInstance.$network.slug ?? ''),
							}) : undefined)
						}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>supply scope key</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									supplyScopeKey: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const supplyScopeKey = resolvedEntity.supplyScopeKey}
							{#if supplyScopeKey !== undefined && supplyScopeKey !== null}
								{String((supplyScopeKey) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={selection.$class}
			>
				{#snippet children(assetClass)}
					{#if assetClass != null && assetClass[EntityMetaKey.Selector] != null}
						<div>
							<dt>class</dt>
							<dd>
								<AssetClassView
									selection={select(EntityType.AssetClass, assetClass[EntityMetaKey.Selector])}
									prefetched={assetClass}
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
							classKey: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const classKey = resolvedEntity.classKey}
					{#if classKey !== undefined && classKey !== null}
						<div>
							<dt>class key</dt>
							<dd>
								{String((classKey) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<div>
				<dt>ledger coordinate kind</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									ledgerCoordinateKind: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const ledgerCoordinateKind = resolvedEntity.ledgerCoordinateKind}
							{#if ledgerCoordinateKind !== undefined && ledgerCoordinateKind !== null}
								{String((ledgerCoordinateKind) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>ledger coordinate value</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									ledgerCoordinateValue: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const ledgerCoordinateValue = resolvedEntity.ledgerCoordinateValue}
							{#if ledgerCoordinateValue !== undefined && ledgerCoordinateValue !== null}
								<NumberValue
									value={ledgerCoordinateValue}
								/>
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Source</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									source: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const source = resolvedEntity.source}
							{#if source !== undefined && source !== null}
								{String((source) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					selection({
						sources: selection.sources,
						fields: {
							totalSupply: true,
							$assetInstance: {
								fields: {
									decimals: true,
									symbol: true,
								},
							},
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const totalSupply = resolvedEntity.totalSupply}
					{#if totalSupply !== undefined && totalSupply !== null}
						<div>
							<dt>total supply</dt>
							<dd>
								<NumberValue
									value={totalSupply}
									decimalPlaces={({ value: totalSupply, ...resolvedEntity }).$assetInstance.decimals}
								/>

								<span>{({ value: totalSupply, ...resolvedEntity }).$assetInstance.symbol == null ? '' : ` ${String(({ value: totalSupply, ...resolvedEntity }).$assetInstance.symbol)}`}</span>
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
							maxSupply: true,
							$assetInstance: {
								fields: {
									decimals: true,
									symbol: true,
								},
							},
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const maxSupply = resolvedEntity.maxSupply}
					{#if maxSupply !== undefined && maxSupply !== null}
						<div>
							<dt>max supply</dt>
							<dd>
								<NumberValue
									value={maxSupply}
									decimalPlaces={({ value: maxSupply, ...resolvedEntity }).$assetInstance.decimals}
								/>

								<span>{({ value: maxSupply, ...resolvedEntity }).$assetInstance.symbol == null ? '' : ` ${String(({ value: maxSupply, ...resolvedEntity }).$assetInstance.symbol)}`}</span>
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
							mintedSupply: true,
							$assetInstance: {
								fields: {
									decimals: true,
									symbol: true,
								},
							},
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const mintedSupply = resolvedEntity.mintedSupply}
					{#if mintedSupply !== undefined && mintedSupply !== null}
						<div>
							<dt>minted supply</dt>
							<dd>
								<NumberValue
									value={mintedSupply}
									decimalPlaces={({ value: mintedSupply, ...resolvedEntity }).$assetInstance.decimals}
								/>

								<span>{({ value: mintedSupply, ...resolvedEntity }).$assetInstance.symbol == null ? '' : ` ${String(({ value: mintedSupply, ...resolvedEntity }).$assetInstance.symbol)}`}</span>
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
							burnedSupply: true,
							$assetInstance: {
								fields: {
									decimals: true,
									symbol: true,
								},
							},
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const burnedSupply = resolvedEntity.burnedSupply}
					{#if burnedSupply !== undefined && burnedSupply !== null}
						<div>
							<dt>burned supply</dt>
							<dd>
								<NumberValue
									value={burnedSupply}
									decimalPlaces={({ value: burnedSupply, ...resolvedEntity }).$assetInstance.decimals}
								/>

								<span>{({ value: burnedSupply, ...resolvedEntity }).$assetInstance.symbol == null ? '' : ` ${String(({ value: burnedSupply, ...resolvedEntity }).$assetInstance.symbol)}`}</span>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
