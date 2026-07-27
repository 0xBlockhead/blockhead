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
	}: EntityListViewProps<EntityType.NearReceipt> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.NearReceipt}
	bind:open
	resource={
		selection({
			fields: {
				receiptId: true,
				$receiver: true,
				$predecessor: true,
			},
		})
	}
>
	{#snippet Item({ item: nearReceipt })}
		{@const nearReceiptSelector = nearReceipt[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.NearReceipt}
			entitySelector={nearReceiptSelector}
		>
			{#snippet Title()}
				{nearReceiptSelector.receiptId || 'near receipt'}
			{/snippet}

			{#snippet Value()}
				{nearReceipt.$receiver == null ? '' : nearReceipt.$receiver.accountId || 'near account'}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{nearReceipt.$predecessor == null ? '' : nearReceipt.$predecessor.accountId || 'near account'}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
