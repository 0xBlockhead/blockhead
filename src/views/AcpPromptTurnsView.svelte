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
	}: EntityListViewProps<EntityType.AcpPromptTurn> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.AcpPromptTurn}
	bind:open
	resource={
		selection({
			fields: {
				turnId: true,
				stopReason: true,
				startedAt: true,
			},
		})
	}
>
	{#snippet Item({ item: acpPromptTurn })}
		{@const acpPromptTurnSelector = acpPromptTurn[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.AcpPromptTurn}
			entitySelector={acpPromptTurnSelector}
		>
			{#snippet Title()}
				{acpPromptTurnSelector.turnId || 'ACP prompt turn'}
			{/snippet}

			{#snippet Value()}
				{acpPromptTurn.stopReason ?? ''}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{acpPromptTurn.startedAt ?? ''}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
