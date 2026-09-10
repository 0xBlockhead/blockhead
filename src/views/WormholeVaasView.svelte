<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// State
	let {
		selection,
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.WormholeVaa> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.WormholeVaa}
	bind:open
	resource={
		selection({
			fields: {
				digest: true,
				emitterChain: true,
				sequence: true,
			},
		})
	}
>
	{#snippet Item({ item: wormholeVaa })}
		{@const wormholeVaaSelector = wormholeVaa[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.WormholeVaa}
			entitySelector={wormholeVaaSelector}
			href={
				resolve(
					'/wormhole/vaa/[emitterChain=nonNegativeInteger]/[emitter=stringSegment]/[sequence=stringSegment]',
					{
						emitterChain: String(wormholeVaaSelector.emitterChain),
						emitter: wormholeVaaSelector.emitter,
						sequence: wormholeVaaSelector.sequence,
					}
				)
			}
		>
			{#snippet Title()}
				{wormholeVaa.digest || 'Wormhole VAA'}
			{/snippet}

			{#snippet Value()}
				{[String(wormholeVaaSelector.emitterChain), wormholeVaaSelector.sequence].filter(Boolean).join(' ')}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
