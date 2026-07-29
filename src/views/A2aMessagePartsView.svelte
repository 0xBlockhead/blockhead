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
	}: EntityListViewProps<EntityType.A2aMessagePart> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.A2aMessagePart}
	bind:open
	resource={
		selection({
			fields: {
				partIndex: true,
				partKind: true,
				mimeType: true,
			},
		})
	}
>
	{#snippet Item({ item: a2aMessagePart })}
		{@const a2aMessagePartSelector = a2aMessagePart[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.A2aMessagePart}
			entitySelector={a2aMessagePartSelector}
		>
			{#snippet Title()}
				{a2aMessagePartSelector.partIndex}
			{/snippet}

			{#snippet Value()}
				{a2aMessagePart.partKind}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{a2aMessagePart.mimeType ?? ''}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
