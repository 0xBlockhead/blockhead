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
	}: EntityListViewProps<EntityType.AcpFileOperation> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.AcpFileOperation}
	bind:open
	resource={
		selection({
			...{
				fields: {
					operationId: true,
					operationKind: true,
					path: true,
				},
			},
		})
	}
>
	{#snippet Item({ item: acpFileOperation })}
		{@const acpFileOperationSelector = acpFileOperation[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.AcpFileOperation}
			entitySelector={acpFileOperationSelector}
			href={
				resolve(
					'/(agents)/agents/acp/session/[sessionId=stringSegment]/(acpSession)/file-operation/[operationId=stringSegment]',
					{
						sessionId: acpFileOperationSelector.$session.sessionId,
						operationId: acpFileOperationSelector.operationId,
					}
				)
			}
		>
			{#snippet Title()}
				{acpFileOperationSelector.operationId || 'ACP file operation'}
			{/snippet}

			{#snippet Value()}
				{acpFileOperation.operationKind}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{acpFileOperation.path ?? ''}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
