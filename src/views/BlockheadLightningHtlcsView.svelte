<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// State
	let {
		selection,
		title = 'Blockhead Lightning HTLCs',
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.BlockheadLightningHtlc> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BlockheadLightningHtlc}
	{title}
	bind:open
	resource={
		selection({
			fields: {
				htlcIndex: true,
				$channel: true,
				direction: true,
			},
		})
	}
>
	{#snippet Item({ item: blockheadLightningHtlc })}
		{@const blockheadLightningHtlcSelector = blockheadLightningHtlc[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.BlockheadLightningHtlc}
			entitySelector={blockheadLightningHtlcSelector}
		>
			{#snippet Title()}
				{'HTLC ' + blockheadLightningHtlcSelector.htlcIndex}
			{/snippet}

			{#snippet Value()}
				{(blockheadLightningHtlc.$channel.shortChannelId ?? '') || blockheadLightningHtlc.$channel.channelId || 'Lightning channel'}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{blockheadLightningHtlc.direction ?? ''}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
