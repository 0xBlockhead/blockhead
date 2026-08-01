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
	}: EntityListViewProps<EntityType.LitecoinMwebPegIn> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.LitecoinMwebPegIn}
	bind:open
	resource={
		selection({
			fields: {
				$transaction: true,
				pegInIndex: true,
				$transparentOutput: true,
			},
		})
	}
>
	{#snippet Item({ item: litecoinMwebPegIn })}
		{@const litecoinMwebPegInSelector = litecoinMwebPegIn[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.LitecoinMwebPegIn}
			entitySelector={litecoinMwebPegInSelector}
		>
			{#snippet Title()}
				{`Block #${litecoinMwebPegInSelector.$transaction.$mwebBlock.$block.height}`}
			{/snippet}

			{#snippet Value()}
				{litecoinMwebPegInSelector.pegInIndex}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{litecoinMwebPegIn.$transparentOutput == null ? '' : `Output #${litecoinMwebPegIn.$transparentOutput.indexInTransaction}`}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
