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
	}: EntityListViewProps<EntityType.CardanoDRep> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.CardanoDRep}
	bind:open
	resource={
		selection({
			fields: {
				displayName: true,
				drepCredential: true,
				credentialKind: true,
			},
		})
	}
>
	{#snippet Item({ item: cardanoDRep })}
		{@const cardanoDRepSelector = cardanoDRep[EntityMetaKey.Selector]}
		{@const network = cardanoDRepSelector.$network}
		<EntityView
			entityType={EntityType.CardanoDRep}
			entitySelector={cardanoDRepSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/drep/[drepCredential=stringSegment]',
					{
						network: (
							'caip2' in network ?
								caip2StringFromValue(network.caip2)
							:
								network.slug
						),
						drepCredential: cardanoDRepSelector.drepCredential,
					}
				)
			}
		>
			{#snippet Title()}
				{[(cardanoDRep.displayName ?? ''), cardanoDRepSelector.drepCredential].filter(Boolean).join(' ') || 'Cardano DRep'}
			{/snippet}

			{#snippet Value()}
				{cardanoDRep.credentialKind ?? ''}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
