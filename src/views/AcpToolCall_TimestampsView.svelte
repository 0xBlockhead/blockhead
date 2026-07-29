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
	}: EntityListViewProps<EntityType.AcpToolCall_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.AcpToolCall_Timestamp}
	bind:open
	resource={
		selection({
			fields: {
				timestampMs: true,
				status: true,
				latencyMs: true,
			},
		})
	}
>
	{#snippet Item({ item: acpToolCallTimestamp })}
		{@const acpToolCallTimestampSelector = acpToolCallTimestamp[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.AcpToolCall_Timestamp}
			entitySelector={acpToolCallTimestampSelector}
		>
			{#snippet Title()}
				{acpToolCallTimestampSelector.timestampMs}
			{/snippet}

			{#snippet Value()}
				{acpToolCallTimestamp.status ?? ''}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{acpToolCallTimestamp.latencyMs ?? ''}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
