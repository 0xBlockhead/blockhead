<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// State
	let {
		selection,
		title = 'SIWE challenges',
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.BlockheadSiweChallenge> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BlockheadSiweChallenge}
	{title}
	bind:open
	resource={
		selection({
			fields: {
				domain: true,
				verified: true,
				issuedAt: true,
			},
		})
	}
>
	{#snippet Item({ item: blockheadSiweChallenge })}
		{@const blockheadSiweChallengeSelector = blockheadSiweChallenge[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.BlockheadSiweChallenge}
			entitySelector={blockheadSiweChallengeSelector}
			href={
				resolve(
					'/~/siwe/challenge/[id=stringSegment]',
					{
						id: blockheadSiweChallengeSelector.id,
					}
				)
			}
		>
			{#snippet Title()}
				{blockheadSiweChallenge.domain || 'blockhead siwe challenge'}
			{/snippet}

			{#snippet Value()}
				{blockheadSiweChallenge.verified}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{blockheadSiweChallenge.issuedAt}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
