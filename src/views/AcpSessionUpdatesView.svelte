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
	}: EntityListViewProps<EntityType.AcpSessionUpdate> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.AcpSessionUpdate}
	bind:open
	resource={
		selection({
			...{
				fields: {
					sequence: true,
					updateKind: true,
					timestampMs: true,
				},
			},
		})
	}
>
	{#snippet Item({ item: acpSessionUpdate })}
		{@const acpSessionUpdateSelector = acpSessionUpdate[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.AcpSessionUpdate}
			entitySelector={acpSessionUpdateSelector}
			href={
				resolve(
					'/(agents)/agents/acp/session/[sessionId=stringSegment]/(acpSession)/update/[sequence=nonNegativeInteger]',
					{
						sessionId: acpSessionUpdateSelector.$session.sessionId,
						sequence: String(acpSessionUpdateSelector.sequence),
					}
				)
			}
		>
			{#snippet Title()}
				{`Update #${acpSessionUpdateSelector.sequence}`}
			{/snippet}

			{#snippet Value()}
				{acpSessionUpdate.updateKind}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{acpSessionUpdate.timestampMs ?? ''}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
