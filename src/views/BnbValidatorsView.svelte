<!-- Generated from APP.ts. -->

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
	}: EntityListViewProps<EntityType.BnbValidator> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BnbValidator}
	bind:open
	resource={
		selection({
			fields: {
				moniker: true,
				consensusAddress: true,
				operatorAddress: true,
			},
		})
	}
>
	{#snippet Item({ item: bnbValidator })}
		{@const bnbValidatorSelector = bnbValidator[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.BnbValidator}
			entitySelector={bnbValidatorSelector}
		>
			{#snippet Title()}
				{(bnbValidator.moniker ?? '') || bnbValidatorSelector.operatorAddress || 'bnb validator'}
			{/snippet}

			{#snippet Value()}
				{bnbValidator.consensusAddress ?? ''}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
