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
		id = 'ZeroGKvEntries-list',
		...EntitiesListProps
	}: EntityListViewProps<EntityType.ZeroGKvEntry> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.ZeroGKvEntry}
	{id}
	bind:open
	resource={
		selection({
			fields: {
				key: true,
				namespace: true,
				$network: true,
			},
		})
	}
>
	{#snippet Item({ item: zeroGKvEntry })}
		{@const zeroGKvEntrySelector = zeroGKvEntry[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.ZeroGKvEntry}
			entitySelector={zeroGKvEntrySelector}
		>
			{#snippet Title()}
				{zeroGKvEntrySelector.key || 'zero g kv entry'}
			{/snippet}

			{#snippet Value()}
				{zeroGKvEntrySelector.namespace}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{zeroGKvEntry.$network.name || (zeroGKvEntrySelector.$network.caip2 == null ? '' : `${zeroGKvEntrySelector.$network.caip2.namespace}:${zeroGKvEntrySelector.$network.caip2.reference}`) || 'Network'}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
