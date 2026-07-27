<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// State
	let {
		selection,
		title = 'Transfer requests',
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.BlockheadTransferRequest> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BlockheadTransferRequest}
	{title}
	bind:open
	resource={
		selection({
			fields: {
				id: true,
				status: true,
				createdAt: true,
			},
		})
	}
>
	{#snippet Item({ item: blockheadTransferRequest })}
		{@const blockheadTransferRequestSelector = blockheadTransferRequest[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.BlockheadTransferRequest}
			entitySelector={blockheadTransferRequestSelector}
		>
			{#snippet Title()}
				{blockheadTransferRequestSelector.id || 'blockhead transfer request'}
			{/snippet}

			{#snippet Value()}
				{blockheadTransferRequest.status}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{String(blockheadTransferRequest.createdAt)}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
