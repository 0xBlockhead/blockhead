<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { UrlString } from '$/schema/UrlString.ts'


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
		>
			{#snippet Title()}
				{a2aPushNotificationConfigSelector.configId || 'A2A push notification config'}
			{/snippet}

			{#snippet Value()}
				{(a2aPushNotificationConfig.status ?? '')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{String(a2aPushNotificationConfig.url ?? '')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
