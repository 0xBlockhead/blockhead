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
	}: EntityListViewProps<EntityType.StellarEffect> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.StellarEffect}
	bind:open
	resource={
		selection({
			...{
				fields: {
					effectType: true,
					effectId: true,
				},
			},
		})
	}
>
	{#snippet Item({ item: stellarEffect })}
		{@const stellarEffectSelector = stellarEffect[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.StellarEffect}
			entitySelector={stellarEffectSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/effect/stellar/[effectId=stringSegment]',
					{
						network: (
							'caip2' in stellarEffectSelector.$network.$network ?
								caip2StringFromValue(stellarEffectSelector.$network.$network.caip2)
							:
								stellarEffectSelector.$network.$network.slug
						),
						effectId: stellarEffectSelector.effectId,
					}
				)
			}
		>
			{#snippet Title()}
				{stellarEffect.effectType || stellarEffectSelector.effectId || 'stellar effect'}
			{/snippet}

			{#snippet Value()}
				{stellarEffectSelector.effectId}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
