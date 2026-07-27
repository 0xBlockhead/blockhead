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
	}: EntityListViewProps<EntityType.FilecoinBlock> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.FilecoinBlock}
	bind:open
	resource={
		selection({
			sources: selection.sources ?? [
				Source.Lotus_JsonRpc,
				Source.Filfox_Rest,
			],
			fields: {
				cid: true,
				$miner: true,
				$tipset: true,
			},
		})
	}
>
	{#snippet Item({ item: filecoinBlock })}
		{@const filecoinBlockSelector = filecoinBlock[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.FilecoinBlock}
			entitySelector={filecoinBlockSelector}
		>
			{#snippet Title()}
				{filecoinBlockSelector.cid || 'filecoin block'}
			{/snippet}

			{#snippet Value()}
				{filecoinBlock.$miner == null ? '' : filecoinBlock.$miner.minerAddress || 'filecoin miner'}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{filecoinBlock.$tipset == null ? '' : String(filecoinBlock.$tipset.height) || 'filecoin tipset'}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
