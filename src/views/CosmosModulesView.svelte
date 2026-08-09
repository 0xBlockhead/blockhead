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
		title = 'Modules',
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.CosmosModule> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.CosmosModule}
	{title}
	bind:open
	resource={
		selection({
			...{
				fields: {
					moduleName: true,
					$network: true,
				},
			},
		})
	}
>
	{#snippet Item({ item: cosmosModule })}
		{@const cosmosModuleSelector = cosmosModule[EntityMetaKey.Selector]}
		{@const network = cosmosModuleSelector.$network}
		<EntityView
			entityType={EntityType.CosmosModule}
			entitySelector={cosmosModuleSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/module/[moduleName=stringSegment]',
					{
						network: (
							'caip2' in network ?
								caip2StringFromValue(network.caip2)
							:
								network.slug
						),
						moduleName: cosmosModuleSelector.moduleName,
					}
				)
			}
		>
			{#snippet Title()}
				{cosmosModuleSelector.moduleName || 'Cosmos module'}
			{/snippet}

			{#snippet Value()}
				{cosmosModuleSelector.moduleName}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{cosmosModule.$network.name || `${cosmosModule.$network.caip2.namespace}:${cosmosModule.$network.caip2.reference}` || 'Network'}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
