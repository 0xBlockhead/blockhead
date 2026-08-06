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
	}: EntityListViewProps<EntityType.FilecoinMessageTokenTransfer> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.FilecoinMessageTokenTransfer}
	bind:open
	resource={
		selection({
			fields: {
				tokenSymbol: true,
				token: true,
				value: true,
				$from: true,
				$to: true,
			},
		})
	}
>
	{#snippet Item({ item: filecoinMessageTokenTransfer })}
		<EntityView
			entityType={EntityType.FilecoinMessageTokenTransfer}
			entitySelector={filecoinMessageTokenTransfer[EntityMetaKey.Selector]}
		>
			{#snippet Title()}
				{[(filecoinMessageTokenTransfer.tokenSymbol ?? ''), (filecoinMessageTokenTransfer.token ?? '')].filter(Boolean).join(' ') || 'filecoin message token transfer'}
			{/snippet}

			{#snippet Value()}
				{filecoinMessageTokenTransfer.value}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[filecoinMessageTokenTransfer.$from == null ? '' : filecoinMessageTokenTransfer.$from.address || 'filecoin actor', filecoinMessageTokenTransfer.$to == null ? '' : filecoinMessageTokenTransfer.$to.address || 'filecoin actor'].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
