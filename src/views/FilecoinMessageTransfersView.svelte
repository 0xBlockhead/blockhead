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
	}: EntityListViewProps<EntityType.FilecoinMessageTransfer> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.FilecoinMessageTransfer}
	bind:open
	resource={
		selection({
			fields: {
				transferType: true,
				valueAttoFil: true,
				$from: true,
				$to: true,
			},
		})
	}
>
	{#snippet Item({ item: filecoinMessageTransfer })}
		<EntityView
			entityType={EntityType.FilecoinMessageTransfer}
			entitySelector={filecoinMessageTransfer[EntityMetaKey.Selector]}
		>
			{#snippet Title()}
				{filecoinMessageTransfer.transferType || 'filecoin message transfer'}
			{/snippet}

			{#snippet Value()}
				{filecoinMessageTransfer.valueAttoFil}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[filecoinMessageTransfer.$from == null ? '' : filecoinMessageTransfer.$from.address || 'filecoin actor', filecoinMessageTransfer.$to == null ? '' : filecoinMessageTransfer.$to.address || 'filecoin actor'].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
