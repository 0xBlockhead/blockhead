<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// State
	let {
		selection,
		title = 'Validator eras',
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.PolkadotValidator_Era> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.PolkadotValidator_Era}
	{title}
	bind:open
	resource={
		selection({
			fields: {
				eraIndex: true,
				active: true,
				source: true,
			},
		})
	}
>
	{#snippet Item({ item: polkadotValidatorEra })}
		{@const polkadotValidatorEraSelector = polkadotValidatorEra[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.PolkadotValidator_Era}
			entitySelector={polkadotValidatorEraSelector}
		>
			{#snippet Title()}
				{String(polkadotValidatorEraSelector.eraIndex) || 'polkadot validator era'}
			{/snippet}

			{#snippet Value()}
				{String(polkadotValidatorEra.active ?? '')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{polkadotValidatorEraSelector.source}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
