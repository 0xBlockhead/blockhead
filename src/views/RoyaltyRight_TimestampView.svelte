<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { EntityProxyField, type EntityProxyData, type EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { EvmAddress } from '$/schema/ZeroExHex.ts'


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
			selection: EntityProxyResource<typeof schema, EntityType.RoyaltyRight_Timestamp>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.RoyaltyRight_Timestamp>>
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
	const royaltyRightTimestamp = $derived(selection({}))
	const titleFallback = $derived('royalty right timestamp')
	const viewDomId = $derived('royalty-right-timestamp-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))
	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import NftCollectionView from '$/views/NftCollectionView.svelte'
	import NftTokenView from '$/views/NftTokenView.svelte'
</script>


<EntityView
	entityType={EntityType.RoyaltyRight_Timestamp}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={royaltyRightTimestamp}>
			{#snippet Pending()}
				{title || 'royalty right timestamp'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>target key</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									targetKey: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const targetKey = selection.entitySelector.targetKey ?? prefetched.targetKey}
							{#if targetKey !== undefined && targetKey !== null}
								{String((targetKey) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const targetKey = resolvedEntity.targetKey}
							{#if targetKey !== undefined && targetKey !== null}
								{String((targetKey) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>right key</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									rightKey: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const rightKey = selection.entitySelector.rightKey ?? prefetched.rightKey}
							{#if rightKey !== undefined && rightKey !== null}
								{String((rightKey) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const rightKey = resolvedEntity.rightKey}
							{#if rightKey !== undefined && rightKey !== null}
								{String((rightKey) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Timestamp</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									timestampMs: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const timestampMs = selection.entitySelector.timestampMs ?? prefetched.timestampMs}
							{#if timestampMs !== undefined && timestampMs !== null}
								<Timestamp timestamp={Number(timestampMs)} />
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const timestampMs = resolvedEntity.timestampMs}
							{#if timestampMs !== undefined && timestampMs !== null}
								<Timestamp timestamp={Number(timestampMs)} />
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

			<div>
				<dt>source kind</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									sourceKind: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const sourceKind = prefetched.sourceKind}
							{#if sourceKind !== undefined && sourceKind !== null}
								{String((sourceKind) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const sourceKind = resolvedEntity.sourceKind}
							{#if sourceKind !== undefined && sourceKind !== null}
								{String((sourceKind) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={selection[EntityProxyField]<EntityType.NftCollection, false>('$collection')}
			>
				{#snippet children(nftCollection)}
					{#if nftCollection != null && nftCollection[EntityMetaKey.Selector] != null}
						<div>
							<dt>collection</dt>
							<dd>
								<NftCollectionView
									selection={select(EntityType.NftCollection, nftCollection[EntityMetaKey.Selector])}
									prefetched={nftCollection}
									layout={EntityLayout.Title}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection[EntityProxyField]<EntityType.NftToken, false>('$token')}
			>
				{#snippet children(nftToken)}
					{#if nftToken != null && nftToken[EntityMetaKey.Selector] != null}
						<div>
							<dt>token</dt>
							<dd>
								<NftTokenView
									selection={select(EntityType.NftToken, nftToken[EntityMetaKey.Selector])}
									prefetched={nftToken}
									layout={EntityLayout.Title}
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
							basisPoints: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const basisPoints = prefetched.basisPoints}
					{#if basisPoints !== undefined && basisPoints !== null}
						<div>
							<dt>basis points</dt>
							<dd>
								{String((basisPoints) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const basisPoints = resolvedEntity.basisPoints}
					{#if basisPoints !== undefined && basisPoints !== null}
						<div>
							<dt>basis points</dt>
							<dd>
								{String((basisPoints) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<div>
				<dt>calculation kind</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									calculationKind: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const calculationKind = prefetched.calculationKind}
							{#if calculationKind !== undefined && calculationKind !== null}
								{String((calculationKind) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const calculationKind = resolvedEntity.calculationKind}
							{#if calculationKind !== undefined && calculationKind !== null}
								{String((calculationKind) ?? '')}
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
							salePriceDenominationPolicy: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const salePriceDenominationPolicy = prefetched.salePriceDenominationPolicy}
					{#if salePriceDenominationPolicy !== undefined && salePriceDenominationPolicy !== null}
						<div>
							<dt>sale price denomination policy</dt>
							<dd>
								{String((salePriceDenominationPolicy) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const salePriceDenominationPolicy = resolvedEntity.salePriceDenominationPolicy}
					{#if salePriceDenominationPolicy !== undefined && salePriceDenominationPolicy !== null}
						<div>
							<dt>sale price denomination policy</dt>
							<dd>
								{String((salePriceDenominationPolicy) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							enforcementKind: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const enforcementKind = prefetched.enforcementKind}
					{#if enforcementKind !== undefined && enforcementKind !== null}
						<div>
							<dt>enforcement kind</dt>
							<dd>
								{String((enforcementKind) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const enforcementKind = resolvedEntity.enforcementKind}
					{#if enforcementKind !== undefined && enforcementKind !== null}
						<div>
							<dt>enforcement kind</dt>
							<dd>
								{String((enforcementKind) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

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
					{@const ledgerCoordinateKind = prefetched.ledgerCoordinateKind}
					{#if ledgerCoordinateKind !== undefined && ledgerCoordinateKind !== null}
						<div>
							<dt>ledger coordinate kind</dt>
							<dd>
								{String((ledgerCoordinateKind) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const ledgerCoordinateKind = resolvedEntity.ledgerCoordinateKind}
					{#if ledgerCoordinateKind !== undefined && ledgerCoordinateKind !== null}
						<div>
							<dt>ledger coordinate kind</dt>
							<dd>
								{String((ledgerCoordinateKind) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

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
					{@const ledgerCoordinateValue = prefetched.ledgerCoordinateValue}
					{#if ledgerCoordinateValue !== undefined && ledgerCoordinateValue !== null}
						<div>
							<dt>ledger coordinate value</dt>
							<dd>
								{String((ledgerCoordinateValue) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const ledgerCoordinateValue = resolvedEntity.ledgerCoordinateValue}
					{#if ledgerCoordinateValue !== undefined && ledgerCoordinateValue !== null}
						<div>
							<dt>ledger coordinate value</dt>
							<dd>
								{String((ledgerCoordinateValue) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							contractAddress: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const contractAddress = prefetched.contractAddress}
					{#if contractAddress !== undefined && contractAddress !== null}
						<div>
							<dt>contract address</dt>
							<dd>
								<TruncatedValue value={String((contractAddress) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const contractAddress = resolvedEntity.contractAddress}
					{#if contractAddress !== undefined && contractAddress !== null}
						<div>
							<dt>contract address</dt>
							<dd>
								<TruncatedValue value={String((contractAddress) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
