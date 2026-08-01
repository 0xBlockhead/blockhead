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
	}: EntityListViewProps<EntityType.AcpAgentRuntime_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.AcpAgentRuntime_Timestamp}
	bind:open
	resource={
		selection({
			fields: {
				timestampMs: true,
				health: true,
				protocolVersion: true,
			},
		})
	}
>
	{#snippet Item({ item: acpAgentRuntimeTimestamp })}
		{@const acpAgentRuntimeTimestampSelector = acpAgentRuntimeTimestamp[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.AcpAgentRuntime_Timestamp}
			entitySelector={acpAgentRuntimeTimestampSelector}
		>
			{#snippet Title()}
				{acpAgentRuntimeTimestampSelector.timestampMs}
			{/snippet}

			{#snippet Value()}
				{acpAgentRuntimeTimestamp.health ?? ''}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{acpAgentRuntimeTimestamp.protocolVersion ?? ''}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
