<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// State
	let {
		selection,
		emptyText = 'No authority requests recorded.',
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.BlockheadActionAuthorityRequest> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BlockheadActionAuthorityRequest}
	bind:open
	resource={
		selection({
			...{
				fields: {
					id: true,
					decision: true,
					presentedAt: true,
				},
			},
		})
	}
	{emptyText}
>
	{#snippet Item({ item: blockheadActionAuthorityRequest })}
		{@const blockheadActionAuthorityRequestSelector = blockheadActionAuthorityRequest[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.BlockheadActionAuthorityRequest}
			entitySelector={blockheadActionAuthorityRequestSelector}
		>
			{#snippet Title()}
				{blockheadActionAuthorityRequestSelector.id || 'authority request'}
			{/snippet}

			{#snippet Value()}
				{blockheadActionAuthorityRequest.decision ?? ''}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{blockheadActionAuthorityRequest.presentedAt}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
