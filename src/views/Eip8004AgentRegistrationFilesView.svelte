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
			...{
				fields: {
					fileUrl: true,
					$registration: true,
				},
			},
		})
	}
>
	{#snippet Item({ item: eip8004AgentRegistrationFile })}
		{@const eip8004AgentRegistrationFileSelector = eip8004AgentRegistrationFile[EntityMetaKey.Selector]}
		{@const registration = eip8004AgentRegistrationFileSelector.$registration}
		<EntityView
			entityType={EntityType.Eip8004AgentRegistrationFile}
			entitySelector={eip8004AgentRegistrationFileSelector}
			href={
				resolve(
					'/(agents)/agents/eip-8004/[namespace=stringSegment]/[chainId=nonNegativeInteger]/registry/[identityRegistry=evmAddress]/agent/[agentId=stringSegment]/(eip8004AgentRegistration)/file/[fileUrl=absoluteUrl]',
					{
						namespace: registration.namespace,
						chainId: String(registration.chainId),
						identityRegistry: registration.identityRegistry,
						agentId: registration.agentId,
						fileUrl: encodeURIComponent(eip8004AgentRegistrationFileSelector.fileUrl),
					}
				)
			}
		>
			{#snippet Title()}
				{eip8004AgentRegistrationFileSelector.fileUrl || 'EIP-8004 agent registration file'}
			{/snippet}

			{#snippet Value()}
				{eip8004AgentRegistrationFileSelector.$registration.agentId || 'EIP-8004 agent registration'}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
