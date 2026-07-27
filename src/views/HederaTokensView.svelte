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
	}: EntityListViewProps<EntityType.HederaToken> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.HederaToken}
	bind:open
	resource={
		selection({
			fields: {
				tokenId: true,
				tokenType: true,
				decimals: true,
			},
		})
	}
>
	{#snippet Item({ item: hederaToken })}
		{@const hederaTokenSelector = hederaToken[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.HederaToken}
			entitySelector={hederaTokenSelector}
		>
			{#snippet Title()}
				{hederaTokenSelector.tokenId || 'hedera token'}
			{/snippet}

			{#snippet Value()}
				{hederaToken.tokenType}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{String(hederaToken.decimals ?? '')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
