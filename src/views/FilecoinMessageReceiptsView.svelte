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
	}: EntityListViewProps<EntityType.FilecoinMessageReceipt> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.FilecoinMessageReceipt}
	bind:open
	resource={
		selection({
			fields: {
				tipsetKey: true,
				exitCode: true,
				gasUsed: true,
			},
		})
	}
>
	{#snippet Item({ item: filecoinMessageReceipt })}
		{@const filecoinMessageReceiptSelector = filecoinMessageReceipt[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.FilecoinMessageReceipt}
			entitySelector={filecoinMessageReceiptSelector}
		>
			{#snippet Title()}
				{filecoinMessageReceiptSelector.tipsetKey || 'filecoin message receipt'}
			{/snippet}

			{#snippet Value()}
				{filecoinMessageReceipt.exitCode ?? ''}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{filecoinMessageReceipt.gasUsed ?? ''}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
