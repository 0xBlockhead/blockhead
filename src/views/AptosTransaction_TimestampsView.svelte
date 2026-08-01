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
	}: EntityListViewProps<EntityType.AptosTransaction_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.AptosTransaction_Timestamp}
	bind:open
	resource={
		selection({
			fields: {
				ledgerVersion: true,
				success: true,
				vmStatus: true,
				timestampMs: true,
			},
		})
	}
>
	{#snippet Item({ item: aptosTransactionTimestamp })}
		{@const aptosTransactionTimestampSelector = aptosTransactionTimestamp[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.AptosTransaction_Timestamp}
			entitySelector={aptosTransactionTimestampSelector}
		>
			{#snippet Title()}
				{aptosTransactionTimestampSelector.ledgerVersion}
			{/snippet}

			{#snippet Value()}
				{[String(aptosTransactionTimestamp.success ?? ''), (aptosTransactionTimestamp.vmStatus ?? '')].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{aptosTransactionTimestamp.timestampMs ?? ''}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
