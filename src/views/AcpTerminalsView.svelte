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
	}: EntityListViewProps<EntityType.AcpTerminal> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.AcpTerminal}
	bind:open
	resource={
		selection({
			fields: {
				terminalId: true,
				command: true,
				cwd: true,
			},
		})
	}
>
	{#snippet Item({ item: acpTerminal })}
		{@const acpTerminalSelector = acpTerminal[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.AcpTerminal}
			entitySelector={acpTerminalSelector}
			href={
				resolve(
					'/(agents)/agents/acp/session/[sessionId=stringSegment]/(acpSession)/terminal/[terminalId=stringSegment]',
					{
						sessionId: acpTerminalSelector.$session.sessionId,
						terminalId: acpTerminalSelector.terminalId,
					}
				)
			}
		>
			{#snippet Title()}
				{acpTerminalSelector.terminalId || 'ACP terminal'}
			{/snippet}

			{#snippet Value()}
				{acpTerminal.command ?? ''}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{acpTerminal.cwd ?? ''}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
