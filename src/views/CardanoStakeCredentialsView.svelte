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
	}: EntityListViewProps<EntityType.CardanoStakeCredential> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.CardanoStakeCredential}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: cardanoStakeCredential })}
		{@const cardanoStakeCredentialSelector = cardanoStakeCredential[EntityMetaKey.Selector]}
		{@const network = cardanoStakeCredentialSelector.$network}
		<EntityView
			entityType={EntityType.CardanoStakeCredential}
			entitySelector={cardanoStakeCredentialSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/stake-credential/[credential=stringSegment]',
					{
						network: (
							network.caip2 !== undefined ?
								caip2StringFromValue(network.caip2)
							:
								network.slug
						),
						credential: cardanoStakeCredentialSelector.credential,
					}
				)
			}
		>
			{#snippet Title()}
				Cardano stake credential
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
