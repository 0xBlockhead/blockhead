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
	}: EntityListViewProps<EntityType.SuiObject> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.SuiObject}
	bind:open
	resource={
		selection({
			...{
				fields: {
					objectId: true,
					$network: true,
				},
			},
		})
	}
>
	{#snippet Item({ item: suiObject })}
		{@const suiObjectSelector = suiObject[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.SuiObject}
			entitySelector={suiObjectSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/object/[objectId=stringSegment]',
					{
						network: (
							'caip2' in suiObjectSelector.$network.$network ?
								caip2StringFromValue(suiObjectSelector.$network.$network.caip2)
							:
								suiObjectSelector.$network.$network.slug
						),
						objectId: suiObjectSelector.objectId,
					}
				)
			}
		>
			{#snippet Title()}
				{suiObjectSelector.objectId || 'Sui object'}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{suiObject.$network.$network.name || (suiObject.$network.$network.caip2 == null ? '' : `${suiObject.$network.$network.caip2.namespace}:${suiObject.$network.$network.caip2.reference}`) || 'Network'}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
