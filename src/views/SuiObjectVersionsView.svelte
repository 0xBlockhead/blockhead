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
	}: EntityListViewProps<EntityType.SuiObjectVersion> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.SuiObjectVersion}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: suiObjectVersion })}
		{@const suiObjectVersionSelector = suiObjectVersion[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.SuiObjectVersion}
			entitySelector={suiObjectVersionSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/object/[objectId=stringSegment]/(suiObject)/version/[version=nonNegativeBigInt]/[digest=stringSegment]',
					{
						network: (
							suiObjectVersionSelector.$network.$network.caip2 !== undefined ?
								caip2StringFromValue(suiObjectVersionSelector.$network.$network.caip2)
							:
								suiObjectVersionSelector.$network.$network.slug
						),
						objectId: suiObjectVersionSelector.objectId,
						version: String(suiObjectVersionSelector.version),
						digest: suiObjectVersionSelector.digest,
					}
				)
			}
		>
			{#snippet Title()}
				Sui object version
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
