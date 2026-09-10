<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2StringFromValue } from '$/lib/caip2.ts'


	// State
	let {
		selection,
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.QuilibriumShard> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.QuilibriumShard}
	bind:open
	resource={
		selection({
			fields: {
				shardKey: true,
				$network: true,
				shardKind: true,
			},
		})
	}
>
	{#snippet Item({ item: quilibriumShard })}
		{@const quilibriumShardSelector = quilibriumShard[EntityMetaKey.Selector]}
		{@const network = quilibriumShardSelector.$network}
		<EntityView
			entityType={EntityType.QuilibriumShard}
			entitySelector={quilibriumShardSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/shard/[shardKey=stringSegment]',
					{
						network: (
							'caip2' in network ?
								caip2StringFromValue(network.caip2)
							:
								network.slug
						),
						shardKey: quilibriumShardSelector.shardKey,
					}
				)
			}
		>
			{#snippet Title()}
				{quilibriumShardSelector.shardKey || 'quilibrium shard'}
			{/snippet}

			{#snippet Value()}
				{quilibriumShard.$network.name || (quilibriumShard.$network.caip2 == null ? '' : `${quilibriumShard.$network.caip2.namespace}:${quilibriumShard.$network.caip2.reference}`) || 'Network'}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{quilibriumShard.shardKind ?? ''}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
