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
	}: EntityListViewProps<EntityType.MoveStruct> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.MoveStruct}
	bind:open
	resource={
		selection({
			...{
				fields: {
					structName: true,
					isEvent: true,
					isNative: true,
					$module: true,
				},
			},
		})
	}
>
	{#snippet Item({ item: moveStruct })}
		{@const moveStructSelector = moveStruct[EntityMetaKey.Selector]}
		{@const module = moveStructSelector.$module}
		<EntityView
			entityType={EntityType.MoveStruct}
			entitySelector={moveStructSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/move/module/[address=stringSegment]/[moduleName=stringSegment]/(moveModule)/struct/[structName=stringSegment]',
					{
						network: (
							'caip2' in module.$network ?
								caip2StringFromValue(module.$network.caip2)
							:
								module.$network.slug
						),
						address: module.address,
						moduleName: module.moduleName,
						structName: moveStructSelector.structName,
					}
				)
			}
		>
			{#snippet Title()}
				{moveStructSelector.structName || 'move struct'}
			{/snippet}

			{#snippet Value()}
				{[String(moveStruct.isEvent ?? ''), String(moveStruct.isNative ?? '')].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{moveStructSelector.$module.moduleName || 'move module'}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
