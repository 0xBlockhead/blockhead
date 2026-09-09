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
	}: EntityListViewProps<EntityType.MoveFunction> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.MoveFunction}
	bind:open
	resource={
		selection({
			fields: {
				functionName: true,
				visibility: true,
				$module: true,
			},
		})
	}
>
	{#snippet Item({ item: moveFunction })}
		{@const moveFunctionSelector = moveFunction[EntityMetaKey.Selector]}
		{@const module = moveFunctionSelector.$module}
		<EntityView
			entityType={EntityType.MoveFunction}
			entitySelector={moveFunctionSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/move/module/[address=stringSegment]/[moduleName=stringSegment]/(moveModule)/function/[functionName=stringSegment]',
					{
						network: (
							'caip2' in module.$network ?
								caip2StringFromValue(module.$network.caip2)
							:
								module.$network.slug
						),
						address: module.address,
						moduleName: module.moduleName,
						functionName: moveFunctionSelector.functionName,
					}
				)
			}
		>
			{#snippet Title()}
				{moveFunctionSelector.functionName || 'move function'}
			{/snippet}

			{#snippet Value()}
				{moveFunction.visibility ?? ''}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{moveFunctionSelector.$module.moduleName || 'move module'}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
