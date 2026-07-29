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
	}: EntityListViewProps<EntityType.BlockheadAgentProgramInstall_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BlockheadAgentProgramInstall_Timestamp}
	bind:open
	resource={
		selection({
			fields: {
				timestampMs: true,
				status: true,
				source: true,
			},
		})
	}
>
	{#snippet Item({ item: blockheadAgentProgramInstallTimestamp })}
		{@const blockheadAgentProgramInstallTimestampSelector = blockheadAgentProgramInstallTimestamp[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.BlockheadAgentProgramInstall_Timestamp}
			entitySelector={blockheadAgentProgramInstallTimestampSelector}
		>
			{#snippet Title()}
				{blockheadAgentProgramInstallTimestampSelector.timestampMs}
			{/snippet}

			{#snippet Value()}
				{blockheadAgentProgramInstallTimestamp.status ?? ''}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{blockheadAgentProgramInstallTimestampSelector.source}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
