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
		id = 'CardanoScriptWitnesses-list',
		...EntitiesListProps
	}: EntityListViewProps<EntityType.CardanoScriptWitness> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.CardanoScriptWitness}
	{id}
	bind:open
	resource={
		selection({
			fields: {
				scriptKind: true,
				witnessIndex: true,
				scriptHash: true,
			},
		})
	}
>
	{#snippet Item({ item: cardanoScriptWitness })}
		{@const cardanoScriptWitnessSelector = cardanoScriptWitness[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.CardanoScriptWitness}
			entitySelector={cardanoScriptWitnessSelector}
		>
			{#snippet Title()}
				{([cardanoScriptWitness.scriptKind, (String(cardanoScriptWitnessSelector.witnessIndex) ? 'Script #' + String(cardanoScriptWitnessSelector.witnessIndex) : '')].filter(Boolean).join(' ')) || 'Cardano script witness'}
			{/snippet}

			{#snippet Value()}
				{(cardanoScriptWitness.scriptHash ?? '')}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
