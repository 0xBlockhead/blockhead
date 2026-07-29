<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// State
	let {
		selection,
		title = 'agent identity claims',
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.AgentIdentityClaim> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.AgentIdentityClaim}
	{title}
	bind:open
	resource={
		selection({
			fields: {
				identityKind: true,
				subjectKind: true,
				objectKind: true,
				timestampMs: true,
			},
		})
	}
>
	{#snippet Item({ item: agentIdentityClaim })}
		{@const agentIdentityClaimSelector = agentIdentityClaim[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.AgentIdentityClaim}
			entitySelector={agentIdentityClaimSelector}
		>
			{#snippet Title()}
				{agentIdentityClaimSelector.identityKind || 'agent identity claim'}
			{/snippet}

			{#snippet Value()}
				{[agentIdentityClaimSelector.subjectKind, agentIdentityClaimSelector.objectKind].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{agentIdentityClaimSelector.timestampMs}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
