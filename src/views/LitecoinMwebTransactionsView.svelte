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
	}: EntityListViewProps<EntityType.LitecoinMwebTransaction> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.LitecoinMwebTransaction}
	bind:open
	resource={
		selection({
			fields: {
				$mwebBlock: {
					fields: {
						$block: {
							fields: {
								hash: true,
								transactionCount: true,
							},
						},
						hogExTransactionId: true,
						kernelRoot: true,
					},
				},
				transactionIndex: true,
				kernelOffset: true,
			},
		})
	}
>
	{#snippet Item({ item: litecoinMwebTransaction })}
		{@const litecoinMwebTransactionSelector = litecoinMwebTransaction[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.LitecoinMwebTransaction}
			entitySelector={litecoinMwebTransactionSelector}
		>
			{#snippet Title()}
				{`Block #${litecoinMwebTransactionSelector.$mwebBlock.$block.height}`}
			{/snippet}

			{#snippet Value()}
				{litecoinMwebTransactionSelector.transactionIndex}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{litecoinMwebTransaction.kernelOffset ?? ''}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
