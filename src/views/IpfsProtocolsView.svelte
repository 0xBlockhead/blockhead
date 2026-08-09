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
	}: EntityListViewProps<EntityType.IpfsProtocol> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.IpfsProtocol}
	bind:open
	resource={
		selection({
			...{
				fields: {
					protocolName: true,
					relationshipModel: true,
				},
			},
		})
	}
>
	{#snippet Item({ item: ipfsProtocol })}
		<EntityView
			entityType={EntityType.IpfsProtocol}
			entitySelector={ipfsProtocol[EntityMetaKey.Selector]}
			href={resolve('/(explore)/(ipfs)/ipfs')}
		>
			{#snippet Title()}
				{ipfsProtocol.protocolName || 'IPFS protocol'}
			{/snippet}

			{#snippet Value()}
				{ipfsProtocol.relationshipModel}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
