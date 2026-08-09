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
	}: EntityListViewProps<EntityType.AcpSession> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.AcpSession}
	bind:open
	resource={
		selection({
			...{
				fields: {
					sessionId: true,
					$runtime: true,
					workspaceUri: true,
				},
			},
		})
	}
>
	{#snippet Item({ item: acpSession })}
		{@const acpSessionSelector = acpSession[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.AcpSession}
			entitySelector={acpSessionSelector}
			href={
				resolve(
					'/(agents)/agents/acp/session/[sessionId=stringSegment]',
					{
						sessionId: acpSessionSelector.sessionId,
					}
				)
			}
		>
			{#snippet Title()}
				{acpSessionSelector.sessionId || 'ACP session'}
			{/snippet}

			{#snippet Value()}
				{acpSession.$runtime == null ? '' : acpSession.$runtime.runtimeId || 'ACP agent runtime'}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{acpSession.workspaceUri ?? ''}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
