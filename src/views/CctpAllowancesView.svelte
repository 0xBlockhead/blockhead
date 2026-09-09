<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// State
	let {
		selection,
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.CctpAllowance> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.CctpAllowance}
	bind:open
	resource={
		selection({
			fields: {
				token: true,
			},
		})
	}
>
	{#snippet Item({ item: cctpAllowance })}
		{@const cctpAllowanceSelector = cctpAllowance[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.CctpAllowance}
			entitySelector={cctpAllowanceSelector}
			href={
				resolve(
					'/(assets)/cctp/allowance/[token=stringSegment]',
					{
						token: cctpAllowanceSelector.token,
					}
				)
			}
		>
			{#snippet Title()}
				{cctpAllowanceSelector.token || 'CCTP allowance'}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
