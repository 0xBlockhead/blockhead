<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2StringFromValue } from '$/lib/caip2.ts'


	// State
	let {
		selection,
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.BalancerGauge> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BalancerGauge}
	bind:open
	resource={
		selection({
			fields: {
				poolSymbol: true,
				gaugeAddress: true,
				isKilled: true,
				relativeWeightCap: true,
				$network: true,
				$pool: true,
			},
		})
	}
>
	{#snippet Item({ item: balancerGauge })}
		{@const balancerGaugeSelector = balancerGauge[EntityMetaKey.Selector]}
		{@const network = balancerGaugeSelector.$network}
		<EntityView
			entityType={EntityType.BalancerGauge}
			entitySelector={balancerGaugeSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/balancer-gauge/[gaugeAddress=evmAddress]',
					{
						network: (
							network.caip2 !== undefined ?
								caip2StringFromValue(network.caip2)
							:
								network.slug
						),
						gaugeAddress: balancerGaugeSelector.gaugeAddress,
					}
				)
			}
		>
			{#snippet Title()}
				{[(balancerGauge.poolSymbol ?? ''), balancerGaugeSelector.gaugeAddress].filter(Boolean).join(' ') || 'Balancer gauge'}
			{/snippet}

			{#snippet Value()}
				{[String(balancerGauge.isKilled ?? ''), (balancerGauge.relativeWeightCap ?? '')].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[balancerGauge.$network.name || (balancerGauge.$network.caip2 == null ? '' : `${balancerGauge.$network.caip2.namespace}:${balancerGauge.$network.caip2.reference}`) || 'Network', balancerGauge.$pool == null ? '' : balancerGauge.$pool.name || 'Balancer pool'].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
