<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
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
				apiHost: true,
				allowance: true,
				fetchedAt: true,
			},
		})
	}
>
	{#snippet Item({ item: cctpAllowance })}
		{@const cctpAllowanceSelector = cctpAllowance[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.CctpAllowance}
			entitySelector={cctpAllowanceSelector}
		>
			{#snippet Title()}
				{cctpAllowanceSelector.apiHost || 'CCTP allowance'}
			{/snippet}

			{#snippet Value()}
				{cctpAllowance.allowance ?? ''}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{cctpAllowance.fetchedAt}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
