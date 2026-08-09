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
	}: EntityListViewProps<EntityType.AcpPermissionRequest> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.AcpPermissionRequest}
	bind:open
	resource={
		selection({
			...{
				fields: {
					requestId: true,
					requestKind: true,
					decision: true,
				},
			},
		})
	}
>
	{#snippet Item({ item: acpPermissionRequest })}
		{@const acpPermissionRequestSelector = acpPermissionRequest[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.AcpPermissionRequest}
			entitySelector={acpPermissionRequestSelector}
			href={
				resolve(
					'/(agents)/agents/acp/session/[sessionId=stringSegment]/(acpSession)/permission-request/[requestId=stringSegment]',
					{
						sessionId: acpPermissionRequestSelector.$session.sessionId,
						requestId: acpPermissionRequestSelector.requestId,
					}
				)
			}
		>
			{#snippet Title()}
				{acpPermissionRequestSelector.requestId || 'ACP permission request'}
			{/snippet}

			{#snippet Value()}
				{acpPermissionRequest.requestKind}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{acpPermissionRequest.decision ?? ''}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
