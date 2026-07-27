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
	}: EntityListViewProps<EntityType.AcpToolCall> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.AcpToolCall}
	bind:open
	resource={
		selection({
			fields: {
				toolCallId: true,
				toolName: true,
				serverName: true,
			},
		})
	}
>
	{#snippet Item({ item: acpToolCall })}
		{@const acpToolCallSelector = acpToolCall[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.AcpToolCall}
			entitySelector={acpToolCallSelector}
		>
			{#snippet Title()}
				{acpToolCallSelector.toolCallId || 'ACP tool call'}
			{/snippet}

			{#snippet Value()}
				{(acpToolCall.toolName ?? '')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{(acpToolCall.serverName ?? '')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
