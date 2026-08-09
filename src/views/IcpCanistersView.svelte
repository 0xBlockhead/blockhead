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
	}: EntityListViewProps<EntityType.IcpCanister> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.IcpCanister}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: icpCanister })}
		{@const icpCanisterSelector = icpCanister[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.IcpCanister}
			entitySelector={icpCanisterSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/canister/[canisterId=stringSegment]',
					{
						network: (
							'caip2' in icpCanisterSelector.$network.$network ?
								caip2StringFromValue(icpCanisterSelector.$network.$network.caip2)
							:
								icpCanisterSelector.$network.$network.slug
						),
						canisterId: icpCanisterSelector.canisterId,
					}
				)
			}
		>
			{#snippet Title()}
				ICP canister
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
