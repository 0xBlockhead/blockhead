<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { ZeroExHex } from '$/schema/ZeroExHex.ts'


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
		>
			{#snippet Title()}
				{String(algorandTealProgramSelector.programHash) || 'algorand teal program'}
			{/snippet}

			{#snippet Value()}
				{(algorandTealProgram.programKind ?? '')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{String(algorandTealProgram.tealVersion ?? '')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
