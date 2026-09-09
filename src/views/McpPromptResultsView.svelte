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
		title = 'MCP prompt results',
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.McpPromptResult> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.McpPromptResult}
	{title}
	bind:open
	resource={
		selection({
			fields: {
				timestampMs: true,
				$prompt: {
					fields: {
						title: true,
						$server: {
							fields: {
								transportKind: true,
								endpointUrl: true,
							},
						},
					},
				},
				error: true,
			},
		})
	}
>
	{#snippet Item({ item: mcpPromptResult })}
		{@const mcpPromptResultSelector = mcpPromptResult[EntityMetaKey.Selector]}
		{@const prompt = mcpPromptResultSelector.$prompt}
		<EntityView
			entityType={EntityType.McpPromptResult}
			entitySelector={mcpPromptResultSelector}
			href={
				resolve(
					'/mcp/server/[serverKey=stringSegment]/(mcpServer)/prompt/[name=stringSegment]/(mcpPrompt)/result/[argumentsHashAlgorithm=stringSegment]/[argumentsHash=zeroExHex]/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
					{
						serverKey: prompt.$server.serverKey,
						name: prompt.name,
						argumentsHashAlgorithm: mcpPromptResultSelector.argumentsHashAlgorithm,
						argumentsHash: mcpPromptResultSelector.argumentsHash,
						timestampMs: String(mcpPromptResultSelector.timestampMs),
						source: mcpPromptResultSelector.source,
					}
				)
			}
		>
			{#snippet Title()}
				{mcpPromptResultSelector.timestampMs}
			{/snippet}

			{#snippet Value()}
				{(mcpPromptResult.$prompt.title ?? '') || mcpPromptResultSelector.$prompt.name || 'mcp prompt'}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{mcpPromptResult.error ?? ''}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
