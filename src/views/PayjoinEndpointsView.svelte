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
		title = 'Payjoin endpoints',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'PayjoinEndpoints-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesResource<EntityType.PayjoinEndpoint>
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
	import PayjoinEndpointView from '$/views/PayjoinEndpointView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.PayjoinEndpoint}
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
				endpointUrl: true,
				protocolVersion: true,
				$directory: true,
			},
		})
	}
	getResourceItems={(payjoinEndpoints) => [...new Map(payjoinEndpoints.values.map((payjoinEndpoint) => [payjoinEndpoint[EntityMetaKey.SelectorKey], payjoinEndpoint])).values()]}
	getKey={(payjoinEndpoint) => payjoinEndpoint[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Payjoin endpoints yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: payjoinEndpoint })}
		{@const payjoinEndpointFields = { ...payjoinEndpoint[EntityMetaKey.Selector], ...payjoinEndpoint }}
		{@const selection = select(EntityType.PayjoinEndpoint, payjoinEndpoint[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
		<PayjoinEndpointView
			selection={selection}
			prefetched={payjoinEndpointFields}
			layout={EntityLayout.Summary}
			open={false}
		/>
	{/snippet}
</EntitiesList>
