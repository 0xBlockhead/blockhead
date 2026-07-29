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
	}: EntityListViewProps<EntityType.LitecoinMwebPegOut> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.LitecoinMwebPegOut}
	bind:open
	resource={
		selection({
			fields: {
				$transaction: true,
				pegOutIndex: true,
				$transparentOutput: true,
			},
		})
	}
>
	{#snippet Item({ item: litecoinMwebPegOut })}
		{@const litecoinMwebPegOutSelector = litecoinMwebPegOut[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.LitecoinMwebPegOut}
			entitySelector={litecoinMwebPegOutSelector}
		>
			{#snippet Title()}
				{`Block #${litecoinMwebPegOutSelector.$transaction.$mwebBlock.$block.height}`}
			{/snippet}

			{#snippet Value()}
				{litecoinMwebPegOutSelector.pegOutIndex}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{litecoinMwebPegOut.$transparentOutput == null ? '' : `Output #${litecoinMwebPegOut.$transparentOutput.indexInTransaction}`}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
