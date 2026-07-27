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
		typeAnnotationParagraphs = ['AT Protocol is a DID-based social protocol. This hub shows bounded actor and post windows from declared Bluesky-compatible appview sources, not a claim about every repository on the network.'],
		open = $bindable(true),
		id = 'GlobalAtprotoNetworks-list',
		...EntitiesListProps
	}: EntityListViewProps<EntityType._GlobalAtprotoNetwork> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType._GlobalAtprotoNetwork}
	{id}
	bind:open
	{typeAnnotationParagraphs}
	resource={
		selection({
			fields: {
				protocolName: true,
				scope: true,
			},
		})
	}
>
	{#snippet Item({ item: globalAtprotoNetwork })}
		<EntityView
			entityType={EntityType._GlobalAtprotoNetwork}
			entitySelector={globalAtprotoNetwork[EntityMetaKey.Selector]}
			href={resolve('/(social)/(atproto)/atproto')}
		>
			{#snippet Title()}
				{globalAtprotoNetwork.protocolName || 'AT Protocol'}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
