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
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.MoveModule> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.MoveModule}
	bind:open
	resource={
		selection({
			fields: {
				moduleName: true,
				address: true,
				$network: true,
			},
		})
	}
>
	{#snippet Item({ item: moveModule })}
		{@const moveModuleSelector = moveModule[EntityMetaKey.Selector]}
		{@const network = moveModuleSelector.$network}
		<EntityView
			entityType={EntityType.MoveModule}
			entitySelector={moveModuleSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/move/module/[address=stringSegment]/[moduleName=stringSegment]',
					{
						network: (
							network.caip2 !== undefined ?
								caip2StringFromValue(network.caip2)
							:
								network.slug
						),
						address: moveModuleSelector.address,
						moduleName: moveModuleSelector.moduleName,
					}
				)
			}
		>
			{#snippet Title()}
				{moveModuleSelector.moduleName || 'move module'}
			{/snippet}

			{#snippet Value()}
				{moveModuleSelector.address}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{moveModule.$network.name || (moveModule.$network.caip2 == null ? '' : `${moveModule.$network.caip2.namespace}:${moveModule.$network.caip2.reference}`) || 'Network'}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
