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
	}: EntityListViewProps<EntityType.BlockheadCashuToken> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BlockheadCashuToken}
	bind:open
	resource={
		selection({
			fields: {
				id: true,
				status: true,
				totalAmount: true,
				unit: true,
			},
		})
	}
>
	{#snippet Item({ item: blockheadCashuToken })}
		{@const blockheadCashuTokenSelector = blockheadCashuToken[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.BlockheadCashuToken}
			entitySelector={blockheadCashuTokenSelector}
		>
			{#snippet Title()}
				{blockheadCashuTokenSelector.id || 'blockhead Cashu token'}
			{/snippet}

			{#snippet Value()}
				{[blockheadCashuToken.status, (blockheadCashuToken.totalAmount != null ? String(blockheadCashuToken.totalAmount) + blockheadCashuToken.unit : '')].filter(Boolean).join(' ')}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
