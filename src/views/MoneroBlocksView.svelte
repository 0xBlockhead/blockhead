<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// State
	let {
		selection,
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.MoneroBlock> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.MoneroBlock}
	bind:open
	resource={
		selection({
			sources: selection.sources ?? [
				Source.MoneroDaemonRpc_JsonRpc,
				Source.ThreeXpl_Rest,
			],
			fields: {
				height: true,
				hash: true,
				timestampMs: true,
			},
		})
	}
>
	{#snippet Item({ item: moneroBlock })}
		{@const moneroBlockSelector = moneroBlock[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.MoneroBlock}
			entitySelector={moneroBlockSelector}
		>
			{#snippet Title()}
				{moneroBlockSelector.height}
			{/snippet}

			{#snippet Value()}
				{moneroBlockSelector.hash}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{moneroBlock.timestampMs ?? ''}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
