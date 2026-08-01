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
	}: EntityListViewProps<EntityType.QuilibriumFrame> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.QuilibriumFrame}
	bind:open
	resource={
		selection({
			fields: {
				frameNumber: true,
				shardKey: true,
				frameHash: true,
			},
		})
	}
>
	{#snippet Item({ item: quilibriumFrame })}
		{@const quilibriumFrameSelector = quilibriumFrame[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.QuilibriumFrame}
			entitySelector={quilibriumFrameSelector}
		>
			{#snippet Title()}
				{quilibriumFrameSelector.frameNumber}
			{/snippet}

			{#snippet Value()}
				{quilibriumFrameSelector.shardKey}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{quilibriumFrame.frameHash ?? ''}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
