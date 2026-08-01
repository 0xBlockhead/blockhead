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
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.XUser_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.XUser_Timestamp}
	bind:open
	resource={
		selection({
			fields: {
				$user: true,
				timestampMs: true,
				source: true,
			},
		})
	}
>
	{#snippet Item({ item: xUserTimestamp })}
		{@const xUserTimestampSelector = xUserTimestamp[EntityMetaKey.Selector]}
		{@const user = xUserTimestampSelector.$user}
		<EntityView
			entityType={EntityType.XUser_Timestamp}
			entitySelector={xUserTimestampSelector}
			href={
				'id' in user ?
					resolve(
						'/(social)/(x)/x/(xNetwork)/user/[userId=stringSegment]/(xUser)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
						{
							userId: user.id,
							timestampMs: String(xUserTimestampSelector.timestampMs),
							source: xUserTimestampSelector.source,
						}
					)
				:
					undefined
			}
		>
			{#snippet Title()}
				{[(xUserTimestamp.$user.name ?? ''), xUserTimestampSelector.$user.username, xUserTimestampSelector.$user.id].filter(Boolean).join(' ') || 'X user'}
			{/snippet}

			{#snippet Value()}
				{xUserTimestampSelector.timestampMs}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{xUserTimestampSelector.source}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
