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
	}: EntityListViewProps<EntityType.EigenLayerOperator> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.EigenLayerOperator}
	bind:open
	resource={
		selection({
			fields: {
				operatorAddress: true,
				name: true,
				$network: true,
			},
		})
	}
>
	{#snippet Item({ item: eigenLayerOperator })}
		{@const eigenLayerOperatorSelector = eigenLayerOperator[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.EigenLayerOperator}
			entitySelector={eigenLayerOperatorSelector}
		>
			{#snippet Title()}
				{eigenLayerOperatorSelector.operatorAddress || 'eigen layer operator'}
			{/snippet}

			{#snippet Value()}
				{eigenLayerOperator.name ?? ''}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{eigenLayerOperator.$network.name || (eigenLayerOperatorSelector.$network.caip2 == null ? '' : `${eigenLayerOperatorSelector.$network.caip2.namespace}:${eigenLayerOperatorSelector.$network.caip2.reference}`) || 'Network'}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
