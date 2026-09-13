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
	}: EntityListViewProps<EntityType.CompoundPosition> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.CompoundPosition}
	bind:open
	resource={
		selection({
			fields: {
				$comet: true,
				baseTokenSymbol: true,
				suppliedBalance: true,
				borrowedBalance: true,
			},
		})
	}
>
	{#snippet Item({ item: compoundPosition })}
		{@const compoundPositionSelector = compoundPosition[EntityMetaKey.Selector]}
		{@const comet = compoundPositionSelector.$comet}
		<EntityView
			entityType={EntityType.CompoundPosition}
			entitySelector={compoundPositionSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/compound-comet/[cometAddress=evmAddress]/(compoundComet)/position/[accountAddress=evmAddress]',
					{
						network: (
							comet.$network.caip2 !== undefined ?
								caip2StringFromValue(comet.$network.caip2)
							:
								comet.$network.slug
						),
						cometAddress: comet.cometAddress,
						accountAddress: compoundPositionSelector.$account.$actor.address,
					}
				)
			}
		>
			{#snippet Title()}
				{[compoundPosition.$comet.name || 'Compound Comet market', compoundPosition.baseTokenSymbol].filter(Boolean).join(' ') || 'Compound position'}
			{/snippet}

			{#snippet Value()}
				{[(compoundPosition.suppliedBalance ?? ''), (compoundPosition.borrowedBalance ?? '')].filter(Boolean).join(' ')}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
