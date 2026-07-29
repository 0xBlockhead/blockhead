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
	}: EntityListViewProps<EntityType.BlockheadPayjoinSession> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BlockheadPayjoinSession}
	bind:open
	resource={
		selection({
			fields: {
				sessionId: true,
				status: true,
				role: true,
				amountSats: true,
			},
		})
	}
>
	{#snippet Item({ item: blockheadPayjoinSession })}
		{@const blockheadPayjoinSessionSelector = blockheadPayjoinSession[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.BlockheadPayjoinSession}
			entitySelector={blockheadPayjoinSessionSelector}
		>
			{#snippet Title()}
				{blockheadPayjoinSessionSelector.sessionId || 'blockhead payjoin session'}
			{/snippet}

			{#snippet Value()}
				{[blockheadPayjoinSession.status, blockheadPayjoinSession.role].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{blockheadPayjoinSession.amountSats ?? ''}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
