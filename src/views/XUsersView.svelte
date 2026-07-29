<!-- Generated from APP.ts. Do not edit by hand. -->

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
	}: EntityListViewProps<EntityType.XUser> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.XUser}
	bind:open
	resource={
		selection({
			fields: {
				id: true,
				$icon: true,
				name: true,
				username: true,
				createdAt: true,
			},
		})
	}
>
	{#snippet Item({ item: xUser })}
		{@const xUserSelector = xUser[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.XUser}
			entitySelector={xUserSelector}
			href={
				resolve(
					'/(social)/(x)/x/(xNetwork)/user/[userId=stringSegment]',
					{
						userId: xUser.id,
					}
				)
			}
		>
			{#snippet Title()}
				{[(xUser.name ?? ''), xUserSelector.username, xUserSelector.id].filter(Boolean).join(' ') || 'X user'}
			{/snippet}

			{#snippet Value()}
				{['@' + xUserSelector.username, xUserSelector.id].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{xUser.createdAt ?? ''}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
