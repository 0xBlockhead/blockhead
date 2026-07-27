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
	}: EntityListViewProps<EntityType.A2aAgentInterface> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.A2aAgentInterface}
	bind:open
	resource={
		selection({
			fields: {
				protocolBinding: true,
				url: true,
				transportKind: true,
			},
		})
	}
>
	{#snippet Item({ item: a2aAgentInterface })}
		{@const a2aAgentInterfaceSelector = a2aAgentInterface[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.A2aAgentInterface}
			entitySelector={a2aAgentInterfaceSelector}
		>
			{#snippet Title()}
				{a2aAgentInterfaceSelector.protocolBinding || 'A2A agent interface'}
			{/snippet}

			{#snippet Value()}
				{String(a2aAgentInterfaceSelector.url)}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{(a2aAgentInterface.transportKind ?? '')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
