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
	}: EntityListViewProps<EntityType.Eip8004AgentRegistration_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.Eip8004AgentRegistration_Timestamp}
	bind:open
	resource={
		selection({
			fields: {
				timestampMs: true,
				active: true,
				source: true,
			},
		})
	}
>
	{#snippet Item({ item: eip8004AgentRegistrationTimestamp })}
		{@const eip8004AgentRegistrationTimestampSelector = eip8004AgentRegistrationTimestamp[EntityMetaKey.Selector]}
		{@const registration = eip8004AgentRegistrationTimestampSelector.$registration}
		<EntityView
			entityType={EntityType.Eip8004AgentRegistration_Timestamp}
			entitySelector={eip8004AgentRegistrationTimestampSelector}
			href={
				resolve(
					'/(agents)/agents/eip-8004/[namespace=stringSegment]/[chainId=nonNegativeInteger]/registry/[identityRegistry=evmAddress]/agent/[agentId=stringSegment]/(eip8004AgentRegistration)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
					{
						namespace: registration.namespace,
						chainId: String(registration.chainId),
						identityRegistry: registration.identityRegistry,
						agentId: registration.agentId,
						timestampMs: String(eip8004AgentRegistrationTimestampSelector.timestampMs),
						source: eip8004AgentRegistrationTimestampSelector.source,
					}
				)
			}
		>
			{#snippet Title()}
				{eip8004AgentRegistrationTimestampSelector.timestampMs}
			{/snippet}

			{#snippet Value()}
				{eip8004AgentRegistrationTimestamp.active ?? ''}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{eip8004AgentRegistrationTimestampSelector.source}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
