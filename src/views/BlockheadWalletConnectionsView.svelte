<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// State
	let {
		selection,
		emptyText = 'No saved wallet connections.',
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.BlockheadWalletConnection> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BlockheadWalletConnection}
	bind:open
	resource={
		selection({
			fields: {
				$wallet: {
					fields: {
						name: true,
						protocol: true,
					},
				},
				status: true,
			},
		})
	}
	{emptyText}
>
	{#snippet Item({ item: blockheadWalletConnection })}
		{@const blockheadWalletConnectionSelector = blockheadWalletConnection[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.BlockheadWalletConnection}
			entitySelector={blockheadWalletConnectionSelector}
			href={
				resolve(
					'/~/accounts/connections/[connectionKey=stringSegment]',
					{
						connectionKey: String(blockheadWalletConnectionSelector.connectionKey),
					}
				)
			}
		>
			{#snippet Title()}
				{blockheadWalletConnection.$wallet.name || 'blockhead wallet'}
			{/snippet}

			{#snippet Value()}
				{blockheadWalletConnection.status}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{blockheadWalletConnection.status}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
