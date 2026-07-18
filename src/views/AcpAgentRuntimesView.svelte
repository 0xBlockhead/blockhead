<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { RegisteredEntityProxyEntitiesResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		title = 'ACP agent runtimes',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'AcpAgentRuntimes-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesResource<EntityType.AcpAgentRuntime>
			title?: string
			typeAnnotationParagraphs?: string[]
			placeholderText?: string
			emptyText?: string
			open?: boolean
			collapsible?: boolean
			showTypeAnnotation?: boolean
			id?: string
		},
		Pick<
			ComponentProps<typeof EntitiesList>,
			| 'href'
			| 'CollapsibleProps'
		>
	> = $props()

	const collectionSelection = $derived(selection)


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import AcpAgentRuntimeView from '$/views/AcpAgentRuntimeView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.AcpAgentRuntime}
	{id}
	{title}
	bind:open
	{collapsible}
	{showTypeAnnotation}
	TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	resource={
		selection({
			sources: selection.sources,
			fields: {
				runtimeId: true,
				$programVersion: true,
				transportKind: true,
			},
		})
	}
	getResourceItems={(acpAgentRuntimes) => [...new Map(acpAgentRuntimes.values.map((acpAgentRuntime) => [acpAgentRuntime[EntityMetaKey.SelectorKey], acpAgentRuntime])).values()]}
	getKey={(acpAgentRuntime) => acpAgentRuntime[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No ACP agent runtimes yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: acpAgentRuntime })}
		{@const acpAgentRuntimeFields = { ...acpAgentRuntime[EntityMetaKey.Selector], ...acpAgentRuntime }}
		{@const selection = select(EntityType.AcpAgentRuntime, acpAgentRuntime[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
		<AcpAgentRuntimeView
			selection={selection}
			prefetched={acpAgentRuntimeFields}
			layout={EntityLayout.Summary}
			open={false}
		/>
	{/snippet}
</EntitiesList>
