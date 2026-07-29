<!-- Generated from APP.ts. Do not edit by hand. -->

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
		<EntityView
			entityType={EntityType.QuilibriumShard}
			entitySelector={quilibriumShardSelector}
		>
			{#snippet Title()}
				{quilibriumShardSelector.shardKey || 'quilibrium shard'}
			{/snippet}

			{#snippet Value()}
				{quilibriumShard.$network.name || (quilibriumShardSelector.$network.caip2 == null ? '' : `${quilibriumShardSelector.$network.caip2.namespace}:${quilibriumShardSelector.$network.caip2.reference}`) || 'Network'}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{quilibriumShard.shardKind ?? ''}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
