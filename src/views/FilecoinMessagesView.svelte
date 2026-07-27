<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// State
	let {
		selection,
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.FilecoinMessage> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.FilecoinMessage}
	bind:open
	resource={
		selection({
			sources: selection.sources ?? [
				Source.Filfox_Rest,
			],
			fields: {
				cid: true,
				$from: true,
				$to: true,
				valueAttoFil: true,
			},
		})
	}
>
	{#snippet Item({ item: filecoinMessage })}
		{@const filecoinMessageSelector = filecoinMessage[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.FilecoinMessage}
			entitySelector={filecoinMessageSelector}
		>
			{#snippet Title()}
				{filecoinMessageSelector.cid || 'filecoin message'}
			{/snippet}

			{#snippet Value()}
				{[filecoinMessage.$from == null ? '' : filecoinMessage.$from.address || 'filecoin actor', filecoinMessage.$to == null ? '' : filecoinMessage.$to.address || 'filecoin actor'].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{String(filecoinMessage.valueAttoFil ?? '')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
