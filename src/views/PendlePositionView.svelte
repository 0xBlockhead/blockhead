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
	}: Omit<EntitySelectionViewProps<EntityType.PendlePosition>, 'prefetched'> = $props()

	const market = $derived(selection.entitySelector.$market)
	const pendlePosition = $derived(selection({
		sources: selection.sources ?? [
			Source.Pendle_Rest,
		],
		fields: {
			ptBalance: true,
			ytBalance: true,
			syBalance: true,
			lpBalance: true,
		},
	}))
	const titleFallback = 'Pendle position'


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import EvmNetworkAccountView from '$/views/EvmNetworkAccountView.svelte'
	import PendleMarketView from '$/views/PendleMarketView.svelte'
</script>


<EntityView
	entityType={EntityType.PendlePosition}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	href={
		href === undefined ?
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/pendle/market/[marketAddress=evmAddress]/(pendleMarket)/position/[accountAddress=evmAddress]',
				{
					network: (
						market.$network.caip2 !== undefined ?
							caip2StringFromValue(market.$network.caip2)
						:
							market.$network.slug
					),
					marketAddress: market.marketAddress,
					accountAddress: selection.entitySelector.$account.$actor.address,
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
		<PendleMarketView
			selection={select(EntityType.PendleMarket, selection.entitySelector.$market)}
			href={null}
			layout={EntityLayout.Title}
		/>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={pendlePosition}>
			{#snippet children(entity)}
				{[(entity.ptBalance ?? ''), (entity.ytBalance ?? ''), (entity.syBalance ?? ''), (entity.lpBalance ?? '')].filter(Boolean).join(' ') || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>Account</dt>
				<dd>
					<EvmNetworkAccountView
						selection={select(EntityType.EvmNetworkAccount, selection.entitySelector.$account)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<div>
				<dt>Market</dt>
				<dd>
					<PendleMarketView
						selection={select(EntityType.PendleMarket, selection.entitySelector.$market)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={pendlePosition}
			>
				{#snippet children(entity)}
					{@const ptBalance = entity.ptBalance}
					{#if ptBalance != null}
						<div>
							<dt>PT balance</dt>
							<dd>
								{ptBalance}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={pendlePosition}
			>
				{#snippet children(entity)}
					{@const ytBalance = entity.ytBalance}
					{#if ytBalance != null}
						<div>
							<dt>YT balance</dt>
							<dd>
								{ytBalance}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={pendlePosition}
			>
				{#snippet children(entity)}
					{@const syBalance = entity.syBalance}
					{#if syBalance != null}
						<div>
							<dt>SY balance</dt>
							<dd>
								{syBalance}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={pendlePosition}
			>
				{#snippet children(entity)}
					{@const lpBalance = entity.lpBalance}
					{#if lpBalance != null}
						<div>
							<dt>LP balance</dt>
							<dd>
								{lpBalance}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
