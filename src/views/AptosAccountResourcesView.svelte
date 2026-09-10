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
	}: EntityListViewProps<EntityType.AptosAccountResource> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.AptosAccountResource}
	bind:open
	resource={
		selection({
			fields: {
				resourceType: true,
				$account: true,
			},
		})
	}
>
	{#snippet Item({ item: aptosAccountResource })}
		{@const aptosAccountResourceSelector = aptosAccountResource[EntityMetaKey.Selector]}
		{@const account = aptosAccountResourceSelector.$account}
		<EntityView
			entityType={EntityType.AptosAccountResource}
			entitySelector={aptosAccountResourceSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(accounts)/account/[accountId=stringSegmentOrPolkadotAccountIdOrEvmAddressOrSolanaPubkey]/(selection)/resource/[resourceType=stringSegment]',
					{
						network: (
							'caip2' in account.$network.$network ?
								caip2StringFromValue(account.$network.$network.caip2)
							:
								account.$network.$network.slug
						),
						accountId: account.address,
						resourceType: aptosAccountResourceSelector.resourceType,
					}
				)
			}
		>
			{#snippet Title()}
				{aptosAccountResourceSelector.resourceType || 'aptos account resource'}
			{/snippet}

			{#snippet Value()}
				{aptosAccountResourceSelector.$account.address || 'aptos account'}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
