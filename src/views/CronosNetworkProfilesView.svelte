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
	}: EntityListViewProps<EntityType.CronosNetworkProfile> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.CronosNetworkProfile}
	bind:open
	resource={
		selection({
			fields: {
				$network: true,
				chainKind: true,
				consensusKind: true,
			},
		})
	}
>
	{#snippet Item({ item: cronosNetworkProfile })}
		{@const cronosNetworkProfileSelector = cronosNetworkProfile[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.CronosNetworkProfile}
			entitySelector={cronosNetworkProfileSelector}
		>
			{#snippet Title()}
				{cronosNetworkProfile.$network.name || (cronosNetworkProfileSelector.$network.caip2 == null ? '' : `${cronosNetworkProfileSelector.$network.caip2.namespace}:${cronosNetworkProfileSelector.$network.caip2.reference}`) || 'Network'}
			{/snippet}

			{#snippet Value()}
				{cronosNetworkProfile.chainKind}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{cronosNetworkProfile.consensusKind ?? ''}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
