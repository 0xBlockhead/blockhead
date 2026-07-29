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
	}: EntityListViewProps<EntityType.HederaNft> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.HederaNft}
	bind:open
	resource={
		selection({
			fields: {
				serialNumber: true,
				$token: {
					fields: {
						tokenType: true,
						decimals: true,
					},
				},
				createdTimestamp: true,
			},
		})
	}
>
	{#snippet Item({ item: hederaNft })}
		{@const hederaNftSelector = hederaNft[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.HederaNft}
			entitySelector={hederaNftSelector}
		>
			{#snippet Title()}
				{hederaNftSelector.serialNumber}
			{/snippet}

			{#snippet Value()}
				{hederaNftSelector.$token.tokenId || 'hedera token'}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{hederaNft.createdTimestamp ?? ''}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
