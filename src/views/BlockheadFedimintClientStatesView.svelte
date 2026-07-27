<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// State
	let {
		selection,
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.BlockheadFedimintClientState> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BlockheadFedimintClientState}
	bind:open
	resource={
		selection({
			fields: {
				clientName: true,
				federationId: true,
				clientId: true,
			},
		})
	}
>
	{#snippet Item({ item: blockheadFedimintClientState })}
		{@const blockheadFedimintClientStateSelector = blockheadFedimintClientState[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.BlockheadFedimintClientState}
			entitySelector={blockheadFedimintClientStateSelector}
		>
			{#snippet Title()}
				{(blockheadFedimintClientState.clientName ?? '') || blockheadFedimintClientStateSelector.clientId || 'blockhead Fedimint client state'}
			{/snippet}

			{#snippet Value()}
				{blockheadFedimintClientStateSelector.federationId}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
