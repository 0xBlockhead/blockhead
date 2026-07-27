<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { UrlString } from '$/schema/UrlString.ts'


	// State
	let {
		selection,
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.Eip8004AgentRegistrationFile> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.Eip8004AgentRegistrationFile}
	bind:open
	resource={
		selection({
			fields: {
				fileUrl: true,
				$registration: true,
			},
		})
	}
>
	{#snippet Item({ item: eip8004AgentRegistrationFile })}
		{@const eip8004AgentRegistrationFileSelector = eip8004AgentRegistrationFile[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.Eip8004AgentRegistrationFile}
			entitySelector={eip8004AgentRegistrationFileSelector}
		>
			{#snippet Title()}
				{String(eip8004AgentRegistrationFileSelector.fileUrl) || 'EIP-8004 agent registration file'}
			{/snippet}

			{#snippet Value()}
				{eip8004AgentRegistrationFileSelector.$registration.agentId || 'EIP-8004 agent registration'}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
