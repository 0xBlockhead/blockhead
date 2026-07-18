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
		title = 'A2A agent interfaces',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'A2aAgentInterfaces-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesResource<EntityType.A2aAgentInterface>
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
	import A2aAgentInterfaceView from '$/views/A2aAgentInterfaceView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.A2aAgentInterface}
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
				protocolBinding: true,
				url: true,
				transportKind: true,
			},
		})
	}
	getResourceItems={(a2aAgentInterfaces) => [...new Map(a2aAgentInterfaces.values.map((a2aAgentInterface) => [a2aAgentInterface[EntityMetaKey.SelectorKey], a2aAgentInterface])).values()]}
	getKey={(a2aAgentInterface) => a2aAgentInterface[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No A2A agent interfaces yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: a2aAgentInterface })}
		{@const a2aAgentInterfaceFields = { ...a2aAgentInterface[EntityMetaKey.Selector], ...a2aAgentInterface }}
		{@const selection = select(EntityType.A2aAgentInterface, a2aAgentInterface[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
		<A2aAgentInterfaceView
			selection={selection}
			prefetched={a2aAgentInterfaceFields}
			layout={EntityLayout.Summary}
			open={false}
		/>
	{/snippet}
</EntitiesList>
