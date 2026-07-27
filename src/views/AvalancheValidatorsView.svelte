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
	}: EntityListViewProps<EntityType.AvalancheValidator> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.AvalancheValidator}
	bind:open
	resource={
		selection({
			fields: {
				nodeId: true,
				stakeAmountNavax: true,
				startTimeMs: true,
			},
		})
	}
>
	{#snippet Item({ item: avalancheValidator })}
		{@const avalancheValidatorSelector = avalancheValidator[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.AvalancheValidator}
			entitySelector={avalancheValidatorSelector}
		>
			{#snippet Title()}
				{avalancheValidatorSelector.nodeId || 'avalanche validator'}
			{/snippet}

			{#snippet Value()}
				{String(avalancheValidator.stakeAmountNavax ?? '')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{String(avalancheValidatorSelector.startTimeMs)}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
