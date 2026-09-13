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
		title = 'Algorand TEAL programs',
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.AlgorandTealProgram> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.AlgorandTealProgram}
	{title}
	bind:open
	resource={
		selection({
			fields: {
				programHash: true,
				programKind: true,
				tealVersion: true,
			},
		})
	}
>
	{#snippet Item({ item: algorandTealProgram })}
		{@const algorandTealProgramSelector = algorandTealProgram[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.AlgorandTealProgram}
			entitySelector={algorandTealProgramSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(algorand)/algorand/teal-program/[programHash=zeroExHex]',
					{
						network: (
							algorandTealProgramSelector.$network.$network.caip2 !== undefined ?
								caip2StringFromValue(algorandTealProgramSelector.$network.$network.caip2)
							:
								algorandTealProgramSelector.$network.$network.slug
						),
						programHash: algorandTealProgramSelector.programHash,
					}
				)
			}
		>
			{#snippet Title()}
				{algorandTealProgramSelector.programHash || 'algorand teal program'}
			{/snippet}

			{#snippet Value()}
				{algorandTealProgram.programKind ?? ''}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{algorandTealProgram.tealVersion ?? ''}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
