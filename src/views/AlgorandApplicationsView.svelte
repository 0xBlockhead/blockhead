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
	}: EntityListViewProps<EntityType.AlgorandApplication> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.AlgorandApplication}
	bind:open
	resource={
		selection({
			...{
				fields: {
					applicationId: true,
					$network: true,
					creator: true,
				},
			},
		})
	}
>
	{#snippet Item({ item: algorandApplication })}
		{@const algorandApplicationSelector = algorandApplication[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.AlgorandApplication}
			entitySelector={algorandApplicationSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(algorand)/algorand/application/[applicationId=nonNegativeBigInt]',
					{
						network: (
							'caip2' in algorandApplicationSelector.$network.$network ?
								caip2StringFromValue(algorandApplicationSelector.$network.$network.caip2)
							:
								algorandApplicationSelector.$network.$network.slug
						),
						applicationId: String(algorandApplicationSelector.applicationId),
					}
				)
			}
		>
			{#snippet Title()}
				{algorandApplicationSelector.applicationId}
			{/snippet}

			{#snippet Value()}
				algorand network
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{algorandApplication.creator ?? ''}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
