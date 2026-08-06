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
	}: EntityListViewProps<EntityType.FilecoinMessageFee> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.FilecoinMessageFee}
	bind:open
	resource={
		selection({
			fields: {
				source: true,
				minerTip: true,
				$message: true,
			},
		})
	}
>
	{#snippet Item({ item: filecoinMessageFee })}
		{@const filecoinMessageFeeSelector = filecoinMessageFee[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.FilecoinMessageFee}
			entitySelector={filecoinMessageFeeSelector}
		>
			{#snippet Title()}
				{filecoinMessageFeeSelector.source || 'filecoin message fee'}
			{/snippet}

			{#snippet Value()}
				{filecoinMessageFee.minerTip}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{filecoinMessageFeeSelector.$message.cid || 'filecoin message'}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
