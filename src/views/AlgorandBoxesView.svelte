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
		id = 'AlgorandBoxes-list',
		...EntitiesListProps
	}: EntityListViewProps<EntityType.AlgorandBox> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.AlgorandBox}
	{id}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: algorandBox })}
		{@const algorandBoxSelector = algorandBox[EntityMetaKey.Selector]}
		{@const application = algorandBoxSelector.$application}
		<EntityView
			entityType={EntityType.AlgorandBox}
			entitySelector={algorandBoxSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(algorand)/algorand/application/[applicationId=nonNegativeBigInt]/(algorandApplication)/box/[boxName=zeroExHex]',
					{
						network: (
							'caip2' in application.$network.$network ?
								caip2StringFromValue(application.$network.$network.caip2)
							:
								application.$network.$network.slug
						),
						applicationId: String(application.applicationId),
						boxName: algorandBoxSelector.boxName,
					}
				)
			}
		/>
	{/snippet}
</EntitiesList>
