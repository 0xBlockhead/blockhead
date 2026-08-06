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
	}: EntityListViewProps<EntityType.BitcoinRune> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BitcoinRune}
	bind:open
	resource={
		selection({
			fields: {
				spacedRune: true,
				rune: true,
				runeId: true,
			},
		})
	}
>
	{#snippet Item({ item: bitcoinRune })}
		{@const bitcoinRuneSelector = bitcoinRune[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.BitcoinRune}
			entitySelector={bitcoinRuneSelector}
		>
			{#snippet Title()}
				{[(bitcoinRune.spacedRune ?? ''), (bitcoinRune.rune ?? '')].filter(Boolean).join(' ') || 'Bitcoin Rune'}
			{/snippet}

			{#snippet Value()}
				{bitcoinRuneSelector.runeId}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
