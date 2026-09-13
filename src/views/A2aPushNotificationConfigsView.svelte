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
	}: EntityListViewProps<EntityType.A2aPushNotificationConfig> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.A2aPushNotificationConfig}
	bind:open
	resource={
		selection({
			fields: {
				configId: true,
				status: true,
				url: true,
			},
		})
	}
>
	{#snippet Item({ item: a2aPushNotificationConfig })}
		{@const a2aPushNotificationConfigSelector = a2aPushNotificationConfig[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.A2aPushNotificationConfig}
			entitySelector={a2aPushNotificationConfigSelector}
			href={
				a2aPushNotificationConfigSelector.$task.taskId !== undefined ?
					resolve(
						'/(agents)/agents/a2a/task/[taskId=stringSegment]/(a2aTask)/push-notification/[configId=stringSegment]',
						{
							taskId: a2aPushNotificationConfigSelector.$task.taskId,
							configId: a2aPushNotificationConfigSelector.configId,
						}
					)
				:
					undefined
			}
		>
			{#snippet Title()}
				{a2aPushNotificationConfigSelector.configId || 'A2A push notification config'}
			{/snippet}

			{#snippet Value()}
				{a2aPushNotificationConfig.status ?? ''}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{a2aPushNotificationConfig.url ?? ''}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
