<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// State
	let {
		selection,
		title = 'Shared addresses',
		open = $bindable(true),
		id = 'BlockheadSharedAddresses-list',
		...EntitiesListProps
	}: EntityListViewProps<EntityType.BlockheadSharedAddress> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BlockheadSharedAddress}
	{id}
	{title}
	bind:open
	resource={
		selection({
			fields: {
				$account: true,
				sharedAt: true,
			},
		})
	}
>
	{#snippet Item({ item: blockheadSharedAddress })}
		<EntityView
			entityType={EntityType.BlockheadSharedAddress}
			entitySelector={blockheadSharedAddress[EntityMetaKey.Selector]}
		>
			{#snippet Title()}
				{blockheadSharedAddress.$account.address || 'EVM account'}
			{/snippet}

			{#snippet Value()}
				{blockheadSharedAddress.sharedAt}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
