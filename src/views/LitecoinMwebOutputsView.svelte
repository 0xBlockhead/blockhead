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
	}: EntityListViewProps<EntityType.LitecoinMwebOutput> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.LitecoinMwebOutput}
	bind:open
	resource={
		selection({
			fields: {
				commitment: true,
				outputIndex: true,
				$transaction: {
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
						kernelOffset: true,
					},
				},
			},
		})
	}
>
	{#snippet Item({ item: litecoinMwebOutput })}
		{@const litecoinMwebOutputSelector = litecoinMwebOutput[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.LitecoinMwebOutput}
			entitySelector={litecoinMwebOutputSelector}
		>
			{#snippet Title()}
				{(litecoinMwebOutput.commitment ?? '') || `Block #${litecoinMwebOutputSelector.$transaction.$mwebBlock.$block.height}`}
			{/snippet}

			{#snippet Value()}
				{litecoinMwebOutputSelector.outputIndex}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
