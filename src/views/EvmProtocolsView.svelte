<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// State
	let {
		selection,
		typeAnnotationParagraphs = ['Catalog surface for EVM signature, topic, and error registries.'],
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.EvmProtocol> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.EvmProtocol}
	bind:open
	{typeAnnotationParagraphs}
	resource={
		selection({
			fields: {
				protocolName: true,
				registryName: true,
			},
		})
	}
>
	{#snippet Item({ item: evmProtocol })}
		{@const evmProtocolSelector = evmProtocol[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.EvmProtocol}
			entitySelector={evmProtocolSelector}
			href={
				evmProtocolSelector.scope === 'EvmProtocol' ?
					resolve('/(explore)/(protocols)/evm')
				:
					undefined
			}
		>
			{#snippet Title()}
				{evmProtocol.protocolName || 'EVM protocol'}
			{/snippet}

			{#snippet Value()}
				{evmProtocol.registryName}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
