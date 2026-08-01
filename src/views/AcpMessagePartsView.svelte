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
	}: EntityListViewProps<EntityType.AcpMessagePart> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.AcpMessagePart}
	bind:open
	resource={
		selection({
			fields: {
				partKind: true,
				partIndex: true,
				mimeType: true,
			},
		})
	}
>
	{#snippet Item({ item: acpMessagePart })}
		{@const acpMessagePartSelector = acpMessagePart[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.AcpMessagePart}
			entitySelector={acpMessagePartSelector}
		>
			{#snippet Title()}
				{acpMessagePart.partKind || 'ACP message part'}
			{/snippet}

			{#snippet Value()}
				{acpMessagePartSelector.partIndex}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{acpMessagePart.mimeType ?? ''}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
