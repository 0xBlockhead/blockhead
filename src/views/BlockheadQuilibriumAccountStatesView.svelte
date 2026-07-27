<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// State
	let {
		selection,
		title = 'Blockhead Quilibrium account states',
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.BlockheadQuilibriumAccountState> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BlockheadQuilibriumAccountState}
	{title}
	bind:open
	resource={
		selection({
			fields: {
				accountAddress: true,
				$network: true,
				accountKind: true,
			},
		})
	}
>
	{#snippet Item({ item: blockheadQuilibriumAccountState })}
		{@const blockheadQuilibriumAccountStateSelector = blockheadQuilibriumAccountState[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.BlockheadQuilibriumAccountState}
			entitySelector={blockheadQuilibriumAccountStateSelector}
		>
			{#snippet Title()}
				{blockheadQuilibriumAccountStateSelector.accountAddress || 'blockhead quilibrium account state'}
			{/snippet}

			{#snippet Value()}
				{blockheadQuilibriumAccountState.$network.name || (blockheadQuilibriumAccountStateSelector.$network.caip2 == null ? '' : `${blockheadQuilibriumAccountStateSelector.$network.caip2.namespace}:${blockheadQuilibriumAccountStateSelector.$network.caip2.reference}`) || 'Network'}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{(blockheadQuilibriumAccountState.accountKind ?? '')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
