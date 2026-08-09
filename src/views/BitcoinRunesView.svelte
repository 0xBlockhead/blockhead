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
	}: EntityListViewProps<EntityType.BitcoinRune> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BitcoinRune}
	bind:open
	resource={
		selection({
			...{
				fields: {
					spacedRune: true,
					rune: true,
					runeId: true,
					number: true,
				},
			},
		})
	}
>
	{#snippet Item({ item: bitcoinRune })}
		{@const bitcoinRuneSelector = bitcoinRune[EntityMetaKey.Selector]}
		{@const network = bitcoinRuneSelector.$network}
		<EntityView
			entityType={EntityType.BitcoinRune}
			entitySelector={bitcoinRuneSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/rune/[runeId=stringSegment]',
					{
						network: (
							'caip2' in network ?
								caip2StringFromValue(network.caip2)
							:
								network.slug
						),
						runeId: bitcoinRuneSelector.runeId,
					}
				)
			}
		>
			{#snippet Title()}
				{[(bitcoinRune.spacedRune ?? ''), (bitcoinRune.rune ?? '')].filter(Boolean).join(' ') || 'Bitcoin Rune'}
			{/snippet}

			{#snippet Value()}
				{[bitcoinRuneSelector.runeId, String(bitcoinRune.number ?? '')].filter(Boolean).join(' ')}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
