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
	}: EntityListViewProps<EntityType.A2aAgentService> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.A2aAgentService}
	bind:open
	resource={
		selection({
			fields: {
				endpointUrl: true,
				protocolBinding: true,
				transportKind: true,
			},
		})
	}
>
	{#snippet Item({ item: a2aAgentService })}
		{@const a2aAgentServiceSelector = a2aAgentService[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.A2aAgentService}
			entitySelector={a2aAgentServiceSelector}
		>
			{#snippet Title()}
				{a2aAgentServiceSelector.endpointUrl || 'A2A agent service'}
			{/snippet}

			{#snippet Value()}
				{a2aAgentServiceSelector.protocolBinding}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{a2aAgentService.transportKind ?? ''}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
