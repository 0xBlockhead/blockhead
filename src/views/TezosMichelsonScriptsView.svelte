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
	}: EntityListViewProps<EntityType.TezosMichelsonScript> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.TezosMichelsonScript}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: tezosMichelsonScript })}
		{@const tezosMichelsonScriptSelector = tezosMichelsonScript[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.TezosMichelsonScript}
			entitySelector={tezosMichelsonScriptSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/script/[scriptHash=stringSegment]',
					{
						network: (
							'caip2' in tezosMichelsonScriptSelector.$network.$network ?
								caip2StringFromValue(tezosMichelsonScriptSelector.$network.$network.caip2)
							:
								tezosMichelsonScriptSelector.$network.$network.slug
						),
						scriptHash: tezosMichelsonScriptSelector.scriptHash,
					}
				)
			}
		/>
	{/snippet}
</EntitiesList>
