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
	}: EntityListViewProps<EntityType.CashuMint_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.CashuMint_Timestamp}
	bind:open
	resource={
		selection({
			fields: {
				timestampMs: true,
				name: true,
				version: true,
				reachable: true,
			},
		})
	}
>
	{#snippet Item({ item: cashuMintTimestamp })}
		{@const cashuMintTimestampSelector = cashuMintTimestamp[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.CashuMint_Timestamp}
			entitySelector={cashuMintTimestampSelector}
		>
			{#snippet Title()}
				{String(cashuMintTimestampSelector.timestampMs) || 'Cashu mint timestamp'}
			{/snippet}

			{#snippet Value()}
				{[(cashuMintTimestamp.name ?? ''), (cashuMintTimestamp.version ?? '')].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{String(cashuMintTimestamp.reachable ?? '')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
