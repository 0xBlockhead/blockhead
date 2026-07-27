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
		typeAnnotationParagraphs = ['Lens is a social graph protocol. This hub shows bounded account and post windows from the declared Lens GraphQL source.'],
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.LensNetwork> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.LensNetwork}
	bind:open
	{typeAnnotationParagraphs}
	resource={
		selection({
			fields: {
				protocolName: true,
			},
		})
	}
>
	{#snippet Item({ item: lensNetwork })}
		<EntityView
			entityType={EntityType.LensNetwork}
			entitySelector={lensNetwork[EntityMetaKey.Selector]}
			href={resolve('/(social)/(lens)/lens')}
		>
			{#snippet Title()}
				{lensNetwork.protocolName || 'Lens'}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
