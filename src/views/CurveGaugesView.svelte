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
	}: EntityListViewProps<EntityType.CurveGauge> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.CurveGauge}
	bind:open
	resource={
		selection({
			...{
				fields: {
					name: true,
					gaugeAddress: true,
					relativeWeight: true,
					gaugeCrvApyMin: true,
					gaugeCrvApyMax: true,
					$network: true,
					$pool: true,
				},
			},
		})
	}
>
	{#snippet Item({ item: curveGauge })}
		{@const curveGaugeSelector = curveGauge[EntityMetaKey.Selector]}
		{@const network = curveGaugeSelector.$network}
		<EntityView
			entityType={EntityType.CurveGauge}
			entitySelector={curveGaugeSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/curve/gauge/[gaugeAddress=evmAddress]',
					{
						network: (
							'caip2' in network ?
								caip2StringFromValue(network.caip2)
							:
								network.slug
						),
						gaugeAddress: curveGaugeSelector.gaugeAddress,
					}
				)
			}
		>
			{#snippet Title()}
				{[(curveGauge.name ?? ''), curveGaugeSelector.gaugeAddress].filter(Boolean).join(' ') || 'Curve gauge'}
			{/snippet}

			{#snippet Value()}
				{[(curveGauge.relativeWeight ?? ''), String(curveGauge.gaugeCrvApyMin ?? ''), String(curveGauge.gaugeCrvApyMax ?? '')].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[curveGauge.$network.name || (curveGauge.$network.caip2 == null ? '' : `${curveGauge.$network.caip2.namespace}:${curveGauge.$network.caip2.reference}`) || 'Network', curveGauge.$pool == null ? '' : [curveGauge.$pool.name, curveGauge.$pool.symbol].filter(Boolean).join(' ') || 'Curve pool'].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
