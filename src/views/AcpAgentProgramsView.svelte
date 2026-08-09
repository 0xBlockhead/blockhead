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
			...{
				fields: {
					label: true,
					packageName: true,
					registryAgentId: true,
					repositoryUrl: true,
				},
			},
		})
	}
>
	{#snippet Item({ item: acpAgentProgram })}
		{@const acpAgentProgramSelector = acpAgentProgram[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.AcpAgentProgram}
			entitySelector={acpAgentProgramSelector}
			href={
				'registryAgentId' in acpAgentProgramSelector ?
					resolve(
						'/(agents)/agents/acp/program/registry/[registryAgentId=stringSegment]',
						{
							registryAgentId: acpAgentProgramSelector.registryAgentId,
						}
					)
				:
					'packageName' in acpAgentProgramSelector ?
						resolve(
							'/(agents)/agents/acp/program/package/[packageName=stringSegment]',
							{
								packageName: acpAgentProgramSelector.packageName,
							}
						)
					:
						'repositoryUrl' in acpAgentProgramSelector ?
							resolve(
								'/(agents)/agents/acp/program/repository/[repositoryUrl=absoluteUrl]',
								{
									repositoryUrl: encodeURIComponent(acpAgentProgramSelector.repositoryUrl),
								}
							)
						:
							undefined
			}
		>
			{#snippet Title()}
				{(acpAgentProgram.label ?? '') || [(acpAgentProgram.registryAgentId ?? ''), (acpAgentProgram.packageName ?? ''), (acpAgentProgram.repositoryUrl ?? '')].filter(Boolean).join(' ') || 'ACP agent program'}
			{/snippet}

			{#snippet Value()}
				{acpAgentProgram.packageName ?? ''}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
