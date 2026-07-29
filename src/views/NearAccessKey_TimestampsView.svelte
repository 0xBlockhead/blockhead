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
	}: EntityListViewProps<EntityType.NearAccessKey_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.NearAccessKey_Timestamp}
	bind:open
	resource={
		selection({
			fields: {
				timestampMs: true,
				permission: true,
				blockHeight: true,
			},
		})
	}
>
	{#snippet Item({ item: nearAccessKeyTimestamp })}
		{@const nearAccessKeyTimestampSelector = nearAccessKeyTimestamp[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.NearAccessKey_Timestamp}
			entitySelector={nearAccessKeyTimestampSelector}
		>
			{#snippet Title()}
				{nearAccessKeyTimestampSelector.timestampMs}
			{/snippet}

			{#snippet Value()}
				{nearAccessKeyTimestamp.permission ?? ''}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{nearAccessKeyTimestamp.blockHeight ?? ''}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
