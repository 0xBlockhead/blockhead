<!-- Generated from APP.ts. -->

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
	}: EntityListViewProps<EntityType.NearTransaction> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.NearTransaction}
	bind:open
	resource={
		selection({
			sources: selection.sources ?? [
				Source.NearRpc_JsonRpc,
				Source.NearBlocks_Rest,
			],
			fields: {
				hash: true,
				$signer: true,
				signerAccountId: true,
				$receiver: true,
			},
		})
	}
>
	{#snippet Item({ item: nearTransaction })}
		{@const nearTransactionSelector = nearTransaction[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.NearTransaction}
			entitySelector={nearTransactionSelector}
		>
			{#snippet Title()}
				{nearTransactionSelector.hash || 'near transaction'}
			{/snippet}

			{#snippet Value()}
				{[nearTransaction.$signer == null ? '' : nearTransaction.$signer.accountId || 'near account', nearTransaction.signerAccountId].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{nearTransaction.$receiver == null ? '' : nearTransaction.$receiver.accountId || 'near account'}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
