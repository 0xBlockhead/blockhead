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
		id = 'NearContractStorageEntries-list',
		...EntitiesListProps
	}: EntityListViewProps<EntityType.NearContractStorageEntry> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.NearContractStorageEntry}
	{id}
	bind:open
	resource={
		selection({
			fields: {
				keyBase64: true,
				valueHash: true,
				blockHeight: true,
			},
		})
	}
>
	{#snippet Item({ item: nearContractStorageEntry })}
		{@const nearContractStorageEntrySelector = nearContractStorageEntry[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.NearContractStorageEntry}
			entitySelector={nearContractStorageEntrySelector}
		>
			{#snippet Title()}
				{nearContractStorageEntrySelector.keyBase64 || 'near contract storage entry'}
			{/snippet}

			{#snippet Value()}
				{(nearContractStorageEntry.valueHash ?? '')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{String(nearContractStorageEntrySelector.blockHeight)}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
