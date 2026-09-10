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
		{@const registrationFile = eip8004AgentServiceEndpointSelector.$registrationFile}
		<EntityView
			entityType={EntityType.Eip8004AgentServiceEndpoint}
			entitySelector={eip8004AgentServiceEndpointSelector}
			href={
				resolve(
					'/(agents)/agents/eip-8004/[namespace=stringSegment]/[chainId=nonNegativeInteger]/registry/[identityRegistry=evmAddress]/agent/[agentId=stringSegment]/(eip8004AgentRegistration)/file/[fileUrl=absoluteUrl]/(eip8004AgentRegistrationFile)/service-endpoint/[endpointKind=stringSegment]/[endpointUrl=absoluteUrl]',
					{
						namespace: registrationFile.$registration.namespace,
						chainId: String(registrationFile.$registration.chainId),
						identityRegistry: registrationFile.$registration.identityRegistry,
						agentId: registrationFile.$registration.agentId,
						fileUrl: encodeURIComponent(registrationFile.fileUrl),
						endpointKind: eip8004AgentServiceEndpointSelector.endpointKind,
						endpointUrl: encodeURIComponent(eip8004AgentServiceEndpointSelector.endpointUrl),
					}
				)
			}
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
