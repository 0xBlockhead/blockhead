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
	}: EntityListViewProps<EntityType.AcpTerminal_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.AcpTerminal_Timestamp}
	bind:open
	resource={
		selection({
			fields: {
				timestampMs: true,
				status: true,
				exitCode: true,
			},
		})
	}
>
	{#snippet Item({ item: acpTerminalTimestamp })}
		{@const acpTerminalTimestampSelector = acpTerminalTimestamp[EntityMetaKey.Selector]}
		{@const terminal = acpTerminalTimestampSelector.$terminal}
		<EntityView
			entityType={EntityType.AcpTerminal_Timestamp}
			entitySelector={acpTerminalTimestampSelector}
			href={
				resolve(
					'/(agents)/agents/acp/session/[sessionId=stringSegment]/(acpSession)/terminal/[terminalId=stringSegment]/(acpTerminal)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
					{
						sessionId: terminal.$session.sessionId,
						terminalId: terminal.terminalId,
						timestampMs: String(acpTerminalTimestampSelector.timestampMs),
						source: acpTerminalTimestampSelector.source,
					}
				)
			}
		>
			{#snippet Title()}
				{acpTerminalTimestampSelector.timestampMs}
			{/snippet}

			{#snippet Value()}
				{acpTerminalTimestamp.status ?? ''}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{acpTerminalTimestamp.exitCode ?? ''}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
