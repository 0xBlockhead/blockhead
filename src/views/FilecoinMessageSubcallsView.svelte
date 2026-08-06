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
	}: EntityListViewProps<EntityType.FilecoinMessageSubcall> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.FilecoinMessageSubcall}
	bind:open
	resource={
		selection({
			fields: {
				method: true,
				$from: true,
				$to: true,
				valueAttoFil: true,
			},
		})
	}
>
	{#snippet Item({ item: filecoinMessageSubcall })}
		<EntityView
			entityType={EntityType.FilecoinMessageSubcall}
			entitySelector={filecoinMessageSubcall[EntityMetaKey.Selector]}
		>
			{#snippet Title()}
				{filecoinMessageSubcall.method || 'filecoin message subcall'}
			{/snippet}

			{#snippet Value()}
				{[filecoinMessageSubcall.$from == null ? '' : filecoinMessageSubcall.$from.address || 'filecoin actor', filecoinMessageSubcall.$to == null ? '' : filecoinMessageSubcall.$to.address || 'filecoin actor'].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{filecoinMessageSubcall.valueAttoFil}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
