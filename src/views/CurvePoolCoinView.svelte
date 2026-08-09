<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2StringFromValue } from '$/lib/caip2.ts'
	import { Source } from '$/sources/Source.ts'


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
	}: EntitySelectionViewProps<EntityType.CurvePoolCoin> = $props()

	const pool = $derived(selection.entitySelector.$pool)
	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.Curve_Rest,
		],
	}))
	const curvePoolCoin = $derived(viewSelection({
		fields: {
			symbol: true,
			name: true,
			poolBalance: true,
			usdPrice: true,
		},
	}))
	const titleFallback = $derived([(prefetched.symbol ?? ''), (prefetched.name ?? '')].filter(Boolean).join(' ') || 'Curve pool coin')


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import CurvePoolView from '$/views/CurvePoolView.svelte'
</script>


<EntityView
	entityType={EntityType.CurvePoolCoin}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	href={
		href === undefined ?
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/curve-pool/[poolAddress=evmAddress]/(curvePool)/coin/[coinAddress=evmAddress]',
				{
					network: (
						'caip2' in pool.$network ?
							caip2StringFromValue(pool.$network.caip2)
						:
							pool.$network.slug
					),
					poolAddress: pool.poolAddress,
					coinAddress: selection.entitySelector.coinAddress,
				}
			)
		:
			href ?? undefined
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={curvePoolCoin}>
			{#snippet children(entity)}
				{[entity.symbol, entity.name].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={curvePoolCoin}>
			{#snippet children(entity)}
				{[(entity.poolBalance ?? ''), String(entity.usdPrice ?? '')].filter(Boolean).join(' ') || [entity.symbol, entity.name].filter(Boolean).join(' ') || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<span data-text="muted">
			<CurvePoolView
				selection={select(EntityType.CurvePool, selection.entitySelector.$pool)}
				layout={EntityLayout.Title}
			/>
		</span>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>Pool</dt>
				<dd>
					<CurvePoolView
						selection={select(EntityType.CurvePool, selection.entitySelector.$pool)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<div>
				<dt>Coin address</dt>
				<dd>
					<TruncatedValue value={selection.entitySelector.coinAddress} />
				</dd>
			</div>

			<div>
				<dt>Symbol</dt>
				<dd>
					<ResourceBoundary
						resource={curvePoolCoin}
					>
						{#snippet children(entity)}
							{entity.symbol}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Name</dt>
				<dd>
					<ResourceBoundary
						resource={curvePoolCoin}
					>
						{#snippet children(entity)}
							{entity.name}
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
			<ResourceBoundary
				resource={curvePoolCoin}
			>
				{#snippet children(entity)}
					{@const poolBalance = entity.poolBalance}
					{#if poolBalance != null}
						<div>
							<dt>Pool balance</dt>
							<dd>
								{poolBalance}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={curvePoolCoin}
			>
				{#snippet children(entity)}
					{@const usdPrice = entity.usdPrice}
					{#if usdPrice != null}
						<div>
							<dt>USD price</dt>
							<dd>
								<NumberValue
									value={usdPrice}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							isBasePoolLpToken: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const isBasePoolLpToken = entity.isBasePoolLpToken}
					{#if isBasePoolLpToken != null}
						<div>
							<dt>Base pool LP token</dt>
							<dd>
								{isBasePoolLpToken ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
