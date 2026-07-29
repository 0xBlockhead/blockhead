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
	}: EntityListViewProps<EntityType.NetworkUpgrade_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.NetworkUpgrade_Timestamp}
	bind:open
	resource={
		selection({
			fields: {
				timestampMs: true,
				status: true,
				activationHeight: true,
			},
		})
	}
>
	{#snippet Item({ item: networkUpgradeTimestamp })}
		{@const networkUpgradeTimestampSelector = networkUpgradeTimestamp[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.NetworkUpgrade_Timestamp}
			entitySelector={networkUpgradeTimestampSelector}
		>
			{#snippet Title()}
				{networkUpgradeTimestampSelector.timestampMs}
			{/snippet}

			{#snippet Value()}
				{networkUpgradeTimestamp.status ?? ''}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{networkUpgradeTimestamp.activationHeight ?? ''}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
