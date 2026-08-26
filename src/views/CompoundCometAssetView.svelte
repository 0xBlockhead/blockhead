<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2StringFromValue } from '$/lib/caip2.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { getAppClient } from '$/routes/applicationClient.ts'


	const select = getAppClient().select

	// State
	let {
		selection,
		title,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: Omit<EntitySelectionViewProps<EntityType.CompoundCometAsset>, 'prefetched'> = $props()

	const comet = $derived(selection.entitySelector.$comet)
	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.Compound_Rest,
		],
	}))
	const compoundCometAsset = $derived(viewSelection({
		fields: {
			borrowCF: true,
			liquidateCF: true,
		},
	}))
	const titleFallback = $derived(selection.entitySelector.symbol || 'Compound Comet collateral asset')


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import CompoundCometView from '$/views/CompoundCometView.svelte'
</script>


<EntityView
	entityType={EntityType.CompoundCometAsset}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	href={
		href === undefined ?
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/compound-comet/[cometAddress=evmAddress]/(compoundComet)/asset/[symbol=stringSegment]',
				{
					network: (
						'caip2' in comet.$network ?
							caip2StringFromValue(comet.$network.caip2)
						:
							comet.$network.slug
					),
					cometAddress: comet.cometAddress,
					symbol: selection.entitySelector.symbol,
				}
			)
		:
			href ?? undefined
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Value()}
		<ResourceBoundary resource={compoundCometAsset}>
			{#snippet children(entity)}
				{[String(entity.borrowCF), String(entity.liquidateCF)].filter(Boolean).join(' ') || selection.entitySelector.symbol || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>Comet market</dt>
				<dd>
					<CompoundCometView
						selection={select(EntityType.CompoundComet, selection.entitySelector.$comet)}
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

			<div>
				<dt>Token address</dt>
				<dd>
					<ResourceBoundary
						resource={
							viewSelection({
								fields: {
									tokenAddress: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							<TruncatedValue value={entity.tokenAddress} />
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Price feed address</dt>
				<dd>
					<ResourceBoundary
						resource={
							viewSelection({
								fields: {
									priceFeedAddress: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							<TruncatedValue value={entity.priceFeedAddress} />
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Decimals</dt>
				<dd>
					<ResourceBoundary
						resource={
							viewSelection({
								fields: {
									decimals: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{entity.decimals}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<div>
				<dt>Borrow collateral factor</dt>
				<dd>
					<ResourceBoundary
						resource={compoundCometAsset}
					>
						{#snippet children(entity)}
							{entity.borrowCF}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Liquidation collateral factor</dt>
				<dd>
					<ResourceBoundary
						resource={compoundCometAsset}
					>
						{#snippet children(entity)}
							{entity.liquidateCF}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Liquidation factor</dt>
				<dd>
					<ResourceBoundary
						resource={
							viewSelection({
								fields: {
									liquidationFactor: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{entity.liquidationFactor}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Supply cap</dt>
				<dd>
					<ResourceBoundary
						resource={
							viewSelection({
								fields: {
									supplyCap: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{entity.supplyCap}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>
	{/snippet}
</EntityView>
