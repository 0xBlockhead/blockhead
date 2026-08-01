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
	}: EntityListViewProps<EntityType.Eip8004AgentServiceEndpoint> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.Eip8004AgentServiceEndpoint}
	bind:open
	resource={
		selection({
			fields: {
				endpointUrl: true,
				endpointKind: true,
				protocolKind: true,
			},
		})
	}
>
	{#snippet Item({ item: eip8004AgentServiceEndpoint })}
		{@const eip8004AgentServiceEndpointSelector = eip8004AgentServiceEndpoint[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.Eip8004AgentServiceEndpoint}
			entitySelector={eip8004AgentServiceEndpointSelector}
		>
			{#snippet Title()}
				{eip8004AgentServiceEndpointSelector.endpointUrl || 'EIP-8004 agent service endpoint'}
			{/snippet}

			{#snippet Value()}
				{eip8004AgentServiceEndpointSelector.endpointKind}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{eip8004AgentServiceEndpoint.protocolKind ?? ''}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
