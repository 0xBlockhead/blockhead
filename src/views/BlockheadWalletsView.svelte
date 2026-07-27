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
	}: EntityListViewProps<EntityType.BlockheadWallet> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BlockheadWallet}
	bind:open
	resource={
		selection({
			fields: {
				name: true,
				protocol: true,
			},
		})
	}
>
	{#snippet Item({ item: blockheadWallet })}
		<EntityView
			entityType={EntityType.BlockheadWallet}
			entitySelector={blockheadWallet[EntityMetaKey.Selector]}
		>
			{#snippet Title()}
				{blockheadWallet.name || 'blockhead wallet'}
			{/snippet}

			{#snippet Value()}
				{blockheadWallet.protocol}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
