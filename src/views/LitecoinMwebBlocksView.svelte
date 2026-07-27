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
	}: EntityListViewProps<EntityType.LitecoinMwebBlock> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.LitecoinMwebBlock}
	bind:open
	resource={
		selection({
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
		})
	}
>
	{#snippet Item({ item: litecoinMwebBlock })}
		{@const litecoinMwebBlockSelector = litecoinMwebBlock[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.LitecoinMwebBlock}
			entitySelector={litecoinMwebBlockSelector}
		>
			{#snippet Title()}
				{((String(litecoinMwebBlockSelector.$block.height ?? '') ? 'Block #' + String(litecoinMwebBlockSelector.$block.height ?? '') : '') || (litecoinMwebBlockSelector.$block.hash ?? '') || 'UTXO block')}
			{/snippet}

			{#snippet Value()}
				{(litecoinMwebBlock.hogExTransactionId ?? '')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{(litecoinMwebBlock.kernelRoot ?? '')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
