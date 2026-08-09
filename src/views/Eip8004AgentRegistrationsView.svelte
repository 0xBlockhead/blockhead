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
	}: EntityListViewProps<EntityType.Eip8004AgentRegistration> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.Eip8004AgentRegistration}
	bind:open
	resource={
		selection({
			...{
				fields: {
					agentId: true,
					namespace: true,
					chainId: true,
				},
			},
		})
	}
>
	{#snippet Item({ item: eip8004AgentRegistration })}
		{@const eip8004AgentRegistrationSelector = eip8004AgentRegistration[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.Eip8004AgentRegistration}
			entitySelector={eip8004AgentRegistrationSelector}
			href={
				resolve(
					'/(agents)/agents/eip-8004/[namespace=stringSegment]/[chainId=nonNegativeInteger]/registry/[identityRegistry=evmAddress]/agent/[agentId=stringSegment]',
					{
						namespace: eip8004AgentRegistrationSelector.namespace,
						chainId: String(eip8004AgentRegistrationSelector.chainId),
						identityRegistry: eip8004AgentRegistrationSelector.identityRegistry,
						agentId: eip8004AgentRegistrationSelector.agentId,
					}
				)
			}
		>
			{#snippet Title()}
				{eip8004AgentRegistrationSelector.agentId || 'EIP-8004 agent registration'}
			{/snippet}

			{#snippet Value()}
				{eip8004AgentRegistrationSelector.namespace}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{eip8004AgentRegistrationSelector.chainId}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
