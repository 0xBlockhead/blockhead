<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { EntityProxyData, EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'


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
			selection: EntityProxyResource<typeof schema, EntityType.AssetSupply_LedgerCoordinate>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.AssetSupply_LedgerCoordinate>>
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
		fields: {
			totalSupply: true,
		},
	}))
	const titleFallback = $derived([String((selection.entitySelector.supplyScopeKey ?? prefetched.supplyScopeKey) ?? '')].filter(Boolean).join(' ') || 'asset supply ledger coordinate')
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
		<ResourceBoundary resource={assetSupplyLedgerCoordinate}>
			{#snippet Pending()}
				{[String((selection.entitySelector.supplyScopeKey ?? prefetched.supplyScopeKey) ?? '')].filter(Boolean).join(' ') || title || 'asset supply ledger coordinate'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.supplyScopeKey) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={assetSupplyLedgerCoordinate}>
			{#snippet Pending()}
				{@const totalSupply0 = prefetched.totalSupply}
				{#if totalSupply0 !== undefined && totalSupply0 !== null}
					<NumberValue value={Number(totalSupply0)} />
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const totalSupply0 = resolvedEntity.totalSupply}
				{#if totalSupply0 !== undefined && totalSupply0 !== null}
					<NumberValue value={Number(totalSupply0)} />
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={assetSupplyLedgerCoordinate}>
			{#snippet Pending()}
				{@const source0 = selection.entitySelector.source ?? prefetched.source}
				{#if source0 !== undefined && source0 !== null}
					<span data-text="muted">
						{String((source0) ?? '')}
					</span>
				{/if}
			{/snippet}

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
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>asset instance</dt>
				<dd>
					<AssetInstanceView
						selection={select(EntityType.AssetInstance, selection.entitySelector.$assetInstance, {})}
						href={
							(selection.entitySelector.$assetInstance.$network !== undefined && selection.entitySelector.$assetInstance.$network.caip2 !== undefined && selection.entitySelector.$assetInstance.$network.caip2.namespace !== undefined && selection.entitySelector.$assetInstance.$network !== undefined && selection.entitySelector.$assetInstance.$network.caip2 !== undefined && selection.entitySelector.$assetInstance.$network.caip2.reference !== undefined && selection.entitySelector.$assetInstance.kind !== undefined && selection.entitySelector.$assetInstance.assetKey !== undefined ? resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/asset/[kind]/[assetKey]', {
								caip2: `${String(selection.entitySelector.$assetInstance.$network.caip2.namespace ?? '')}:${String(selection.entitySelector.$assetInstance.$network.caip2.reference ?? '')}`,
								kind: String(selection.entitySelector.$assetInstance.kind ?? ''),
								assetKey: String(selection.entitySelector.$assetInstance.assetKey ?? ''),
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
								fields: {
									supplyScopeKey: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const supplyScopeKey = selection.entitySelector.supplyScopeKey ?? prefetched.supplyScopeKey}
							{#if supplyScopeKey !== undefined && supplyScopeKey !== null}
								{String((supplyScopeKey) ?? '')}
							{/if}
						{/snippet}

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
						fields: {
							classKey: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const classKey = prefetched.classKey}
					{#if classKey !== undefined && classKey !== null}
						<div>
							<dt>class key</dt>
							<dd>
								{String((classKey) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

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
								fields: {
									ledgerCoordinateKind: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const ledgerCoordinateKind = selection.entitySelector.ledgerCoordinateKind ?? prefetched.ledgerCoordinateKind}
							{#if ledgerCoordinateKind !== undefined && ledgerCoordinateKind !== null}
								{String((ledgerCoordinateKind) ?? '')}
							{/if}
						{/snippet}

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
								fields: {
									ledgerCoordinateValue: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const ledgerCoordinateValue = selection.entitySelector.ledgerCoordinateValue ?? prefetched.ledgerCoordinateValue}
							{#if ledgerCoordinateValue !== undefined && ledgerCoordinateValue !== null}
								<NumberValue value={Number(ledgerCoordinateValue)} />
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const ledgerCoordinateValue = resolvedEntity.ledgerCoordinateValue}
							{#if ledgerCoordinateValue !== undefined && ledgerCoordinateValue !== null}
								<NumberValue value={Number(ledgerCoordinateValue)} />
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
								fields: {
									source: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const source = selection.entitySelector.source ?? prefetched.source}
							{#if source !== undefined && source !== null}
								{String((source) ?? '')}
							{/if}
						{/snippet}

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
						fields: {
							totalSupply: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const totalSupply = prefetched.totalSupply}
					{#if totalSupply !== undefined && totalSupply !== null}
						<div>
							<dt>total supply</dt>
							<dd>
								<NumberValue value={Number(totalSupply)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const totalSupply = resolvedEntity.totalSupply}
					{#if totalSupply !== undefined && totalSupply !== null}
						<div>
							<dt>total supply</dt>
							<dd>
								<NumberValue value={Number(totalSupply)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							maxSupply: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const maxSupply = prefetched.maxSupply}
					{#if maxSupply !== undefined && maxSupply !== null}
						<div>
							<dt>max supply</dt>
							<dd>
								<NumberValue value={Number(maxSupply)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const maxSupply = resolvedEntity.maxSupply}
					{#if maxSupply !== undefined && maxSupply !== null}
						<div>
							<dt>max supply</dt>
							<dd>
								<NumberValue value={Number(maxSupply)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							mintedSupply: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const mintedSupply = prefetched.mintedSupply}
					{#if mintedSupply !== undefined && mintedSupply !== null}
						<div>
							<dt>minted supply</dt>
							<dd>
								<NumberValue value={Number(mintedSupply)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const mintedSupply = resolvedEntity.mintedSupply}
					{#if mintedSupply !== undefined && mintedSupply !== null}
						<div>
							<dt>minted supply</dt>
							<dd>
								<NumberValue value={Number(mintedSupply)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							burnedSupply: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const burnedSupply = prefetched.burnedSupply}
					{#if burnedSupply !== undefined && burnedSupply !== null}
						<div>
							<dt>burned supply</dt>
							<dd>
								<NumberValue value={Number(burnedSupply)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const burnedSupply = resolvedEntity.burnedSupply}
					{#if burnedSupply !== undefined && burnedSupply !== null}
						<div>
							<dt>burned supply</dt>
							<dd>
								<NumberValue value={Number(burnedSupply)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
