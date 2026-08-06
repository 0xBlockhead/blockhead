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
	}: EntityListViewProps<EntityType.BitcoinRuneBalance> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BitcoinRuneBalance}
	bind:open
	resource={
		selection({
			fields: {
				amount: true,
				$rune: {
					fields: {
						spacedRune: true,
						rune: true,
						number: true,
					},
				},
			},
		})
	}
>
	{#snippet Item({ item: bitcoinRuneBalance })}
		<EntityView
			entityType={EntityType.BitcoinRuneBalance}
			entitySelector={bitcoinRuneBalance[EntityMetaKey.Selector]}
		>
			{#snippet Title()}
				{bitcoinRuneBalance.amount || 'Bitcoin Rune balance'}
			{/snippet}

			{#snippet Value()}
				{[(bitcoinRuneBalance.$rune.spacedRune ?? ''), (bitcoinRuneBalance.$rune.rune ?? '')].filter(Boolean).join(' ') || 'Bitcoin Rune'}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
