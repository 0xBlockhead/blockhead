<!-- Generated from APP.ts. Do not edit by hand. -->

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
	}: EntityListViewProps<EntityType.XrplAmm> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.XrplAmm}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: xrplAmm })}
		{@const xrplAmmSelector = xrplAmm[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.XrplAmm}
			entitySelector={xrplAmmSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/amm/[ammAccount=stringSegment]',
					{
						network: (
							'caip2' in xrplAmmSelector.$network ?
								String(caip2StringFromValue(xrplAmmSelector.$network.caip2))
							:
								String(xrplAmmSelector.$network.slug)
						),
						ammAccount: String(xrplAmmSelector.ammAccount),
					}
				)
			}
		>
			{#snippet Title()}
				XRPL AMM
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
