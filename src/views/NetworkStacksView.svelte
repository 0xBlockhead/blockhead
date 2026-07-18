<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { RegisteredEntityProxyEntitiesResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		title = 'Network stacks',
		typeAnnotationParagraphs = ['A curated protocol-stack classification used by network catalog rows.'],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'NetworkStacks-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesResource<EntityType.NetworkStack>
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
	import NetworkStackView from '$/views/NetworkStackView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.NetworkStack}
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
				label: true,
				networkStackId: true,
			},
		})
	}
	getResourceItems={(networkStacks) => [...new Map(networkStacks.values.map((networkStack) => [networkStack[EntityMetaKey.SelectorKey], networkStack])).values()]}
	getKey={(networkStack) => networkStack[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Network stacks yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: networkStack })}
		{@const networkStackFields = { ...networkStack[EntityMetaKey.Selector], ...networkStack }}
		{@const selection = select(EntityType.NetworkStack, networkStack[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
		{@const networkStackHrefFields = { ...networkStack, ...networkStack[EntityMetaKey.Selector] }}
		<NetworkStackView
			selection={selection}
			prefetched={networkStackFields}
			href={
				(networkStackHrefFields.networkStackId !== undefined ? resolve('/network-stack/[networkStackId=stringSegment]', {
					networkStackId: String(networkStackHrefFields.networkStackId ?? ''),
				}) : undefined)
			}
			layout={EntityLayout.Summary}
			open={false}
		/>
	{/snippet}
</EntitiesList>
