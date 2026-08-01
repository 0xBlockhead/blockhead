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
	}: EntityListViewProps<EntityType.AcpAgentProgram> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.AcpAgentProgram}
	bind:open
	resource={
		selection({
			fields: {
				label: true,
				packageName: true,
				registryAgentId: true,
				repositoryUrl: true,
			},
		})
	}
>
	{#snippet Item({ item: acpAgentProgram })}
		{@const acpAgentProgramSelector = acpAgentProgram[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.AcpAgentProgram}
			entitySelector={acpAgentProgramSelector}
		>
			{#snippet Title()}
				{(acpAgentProgram.label ?? '') || [(acpAgentProgramSelector.registryAgentId ?? ''), (acpAgentProgramSelector.packageName ?? ''), (acpAgentProgramSelector.repositoryUrl ?? '')].filter(Boolean).join(' ') || 'ACP agent program'}
			{/snippet}

			{#snippet Value()}
				{acpAgentProgramSelector.packageName ?? ''}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
