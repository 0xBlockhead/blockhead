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
	}: EntityListViewProps<EntityType.BlockheadAgentProgramInstall> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BlockheadAgentProgramInstall}
	bind:open
	resource={
		selection({
			fields: {
				installId: true,
				command: true,
				updatedAt: true,
			},
		})
	}
>
	{#snippet Item({ item: blockheadAgentProgramInstall })}
		{@const blockheadAgentProgramInstallSelector = blockheadAgentProgramInstall[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.BlockheadAgentProgramInstall}
			entitySelector={blockheadAgentProgramInstallSelector}
			href={
				resolve(
					'/~/agent/program-install/[installId=stringSegment]',
					{
						installId: blockheadAgentProgramInstallSelector.installId,
					}
				)
			}
		>
			{#snippet Title()}
				{blockheadAgentProgramInstallSelector.installId || 'blockhead agent program install'}
			{/snippet}

			{#snippet Value()}
				{blockheadAgentProgramInstall.command ?? ''}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{blockheadAgentProgramInstall.updatedAt ?? ''}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
