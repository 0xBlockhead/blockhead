<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2StringFromValue } from '$/lib/caip2.ts'
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
		{@const network = filecoinBlockSelector.$network}
		<EntityView
			entityType={EntityType.FilecoinBlock}
			entitySelector={filecoinBlockSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(blocks)/block/cid/[cid=stringSegment]',
					{
						network: (
							network.caip2 !== undefined ?
								caip2StringFromValue(network.caip2)
							:
								network.slug
						),
						cid: filecoinBlockSelector.cid,
					}
				)
			}
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
