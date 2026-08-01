<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// State
	let {
		selection,
		title = 'Validators',
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.CosmosValidator> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.CosmosValidator}
	{title}
	bind:open
	resource={
		selection({
			fields: {
				moniker: true,
				operatorAddress: true,
				$network: true,
			},
		})
	}
>
	{#snippet Item({ item: cosmosValidator })}
		{@const cosmosValidatorSelector = cosmosValidator[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.CosmosValidator}
			entitySelector={cosmosValidatorSelector}
		>
			{#snippet Title()}
				{[(cosmosValidator.moniker ?? ''), cosmosValidatorSelector.operatorAddress].filter(Boolean).join(' ') || 'Cosmos validator'}
			{/snippet}

			{#snippet Value()}
				{cosmosValidatorSelector.operatorAddress}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{cosmosValidator.$network.name || (cosmosValidatorSelector.$network.caip2 == null ? '' : `${cosmosValidatorSelector.$network.caip2.namespace}:${cosmosValidatorSelector.$network.caip2.reference}`) || 'Network'}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
