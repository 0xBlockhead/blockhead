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
	}: EntityListViewProps<EntityType.PayjoinEndpoint> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.PayjoinEndpoint}
	bind:open
	resource={
		selection({
			fields: {
				endpointUrl: true,
				protocolVersion: true,
				$directory: true,
			},
		})
	}
>
	{#snippet Item({ item: payjoinEndpoint })}
		{@const payjoinEndpointSelector = payjoinEndpoint[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.PayjoinEndpoint}
			entitySelector={payjoinEndpointSelector}
		>
			{#snippet Title()}
				{payjoinEndpointSelector.endpointUrl || 'payjoin endpoint'}
			{/snippet}

			{#snippet Value()}
				{payjoinEndpoint.protocolVersion ?? ''}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{payjoinEndpoint.$directory == null ? '' : payjoinEndpoint.$directory.directoryUrl || 'payjoin directory'}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
