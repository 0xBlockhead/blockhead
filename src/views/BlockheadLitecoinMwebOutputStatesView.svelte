<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// State
	let {
		selection,
		title = 'Blockhead Litecoin MWEB output states',
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.BlockheadLitecoinMwebOutputState> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BlockheadLitecoinMwebOutputState}
	{title}
	bind:open
	resource={
		selection({
			fields: {
				commitment: true,
				walletId: true,
				amountLitoshis: true,
			},
		})
	}
>
	{#snippet Item({ item: blockheadLitecoinMwebOutputState })}
		{@const blockheadLitecoinMwebOutputStateSelector = blockheadLitecoinMwebOutputState[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.BlockheadLitecoinMwebOutputState}
			entitySelector={blockheadLitecoinMwebOutputStateSelector}
		>
			{#snippet Title()}
				{blockheadLitecoinMwebOutputStateSelector.commitment || 'blockhead litecoin mweb output state'}
			{/snippet}

			{#snippet Value()}
				{blockheadLitecoinMwebOutputStateSelector.walletId}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{String(blockheadLitecoinMwebOutputState.amountLitoshis ?? '')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
