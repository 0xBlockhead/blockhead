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
		id = 'ZeroGStorageLogEntries-list',
		...EntitiesListProps
	}: EntityListViewProps<EntityType.ZeroGStorageLogEntry> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.ZeroGStorageLogEntry}
	{id}
	bind:open
	resource={
		selection({
			fields: {
				logEntryId: true,
				$network: true,
				sequenceNumber: true,
			},
		})
	}
>
	{#snippet Item({ item: zeroGStorageLogEntry })}
		{@const zeroGStorageLogEntrySelector = zeroGStorageLogEntry[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.ZeroGStorageLogEntry}
			entitySelector={zeroGStorageLogEntrySelector}
		>
			{#snippet Title()}
				{zeroGStorageLogEntrySelector.logEntryId || 'zero g storage log entry'}
			{/snippet}

			{#snippet Value()}
				{zeroGStorageLogEntry.$network.name || (zeroGStorageLogEntrySelector.$network.caip2 == null ? '' : `${zeroGStorageLogEntrySelector.$network.caip2.namespace}:${zeroGStorageLogEntrySelector.$network.caip2.reference}`) || 'Network'}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{zeroGStorageLogEntry.sequenceNumber ?? ''}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
