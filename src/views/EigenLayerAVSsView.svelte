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
		id = 'EigenLayerAVSs-list',
		...EntitiesListProps
	}: EntityListViewProps<EntityType.EigenLayerAvs> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.EigenLayerAvs}
	{id}
	bind:open
	resource={
		selection({
			fields: {
				avsAddress: true,
				name: true,
				$network: true,
			},
		})
	}
>
	{#snippet Item({ item: eigenLayerAvs })}
		{@const eigenLayerAvsSelector = eigenLayerAvs[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.EigenLayerAvs}
			entitySelector={eigenLayerAvsSelector}
		>
			{#snippet Title()}
				{eigenLayerAvsSelector.avsAddress || 'eigen layer avs'}
			{/snippet}

			{#snippet Value()}
				{eigenLayerAvs.name ?? ''}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{eigenLayerAvs.$network.name || (eigenLayerAvsSelector.$network.caip2 == null ? '' : `${eigenLayerAvsSelector.$network.caip2.namespace}:${eigenLayerAvsSelector.$network.caip2.reference}`) || 'Network'}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
