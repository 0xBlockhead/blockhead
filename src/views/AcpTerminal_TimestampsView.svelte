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
	}: EntityListViewProps<EntityType.AcpTerminal_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.AcpTerminal_Timestamp}
	bind:open
	resource={
		selection({
			fields: {
				timestampMs: true,
				status: true,
				exitCode: true,
			},
		})
	}
>
	{#snippet Item({ item: acpTerminalTimestamp })}
		{@const acpTerminalTimestampSelector = acpTerminalTimestamp[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.AcpTerminal_Timestamp}
			entitySelector={acpTerminalTimestampSelector}
		>
			{#snippet Title()}
				{acpTerminalTimestampSelector.timestampMs}
			{/snippet}

			{#snippet Value()}
				{acpTerminalTimestamp.status ?? ''}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{acpTerminalTimestamp.exitCode ?? ''}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
