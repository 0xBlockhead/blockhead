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
	}: EntityListViewProps<EntityType.BitcoinMiningPool> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BitcoinMiningPool}
	bind:open
	resource={
		selection({
			fields: {
				name: true,
				slug: true,
			},
		})
	}
>
	{#snippet Item({ item: bitcoinMiningPool })}
		{@const bitcoinMiningPoolSelector = bitcoinMiningPool[EntityMetaKey.Selector]}
		{@const network = bitcoinMiningPoolSelector.$network}
		<EntityView
			entityType={EntityType.BitcoinMiningPool}
			entitySelector={bitcoinMiningPoolSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/mining-pool/[slug=stringSegment]',
					{
						network: (
							'caip2' in network ?
								caip2StringFromValue(network.caip2)
							:
								network.slug
						),
						slug: bitcoinMiningPoolSelector.slug,
					}
				)
			}
		>
			{#snippet Title()}
				{bitcoinMiningPool.name || 'Bitcoin mining pool'}
			{/snippet}

			{#snippet Value()}
				{bitcoinMiningPoolSelector.slug}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
