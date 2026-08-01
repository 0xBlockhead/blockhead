<!-- Generated from APP.ts. -->

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
	}: EntityListViewProps<EntityType.FedimintFederation> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.FedimintFederation}
	bind:open
	resource={
		selection({
			fields: {
				name: true,
				consensusVersion: true,
				federationId: true,
			},
		})
	}
>
	{#snippet Item({ item: fedimintFederation })}
		{@const fedimintFederationSelector = fedimintFederation[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.FedimintFederation}
			entitySelector={fedimintFederationSelector}
		>
			{#snippet Title()}
				{(fedimintFederation.name ?? '') || fedimintFederationSelector.federationId || 'Fedimint federation'}
			{/snippet}

			{#snippet Value()}
				{fedimintFederation.consensusVersion ?? ''}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
