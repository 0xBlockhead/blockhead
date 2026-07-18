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
		title = 'Monero stealth outputs',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'MoneroStealthOutputs-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesResource<EntityType.MoneroStealthOutput>
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
	import MoneroStealthOutputView from '$/views/MoneroStealthOutputView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.MoneroStealthOutput}
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
				outputIndex: true,
				publicKey: true,
				commitment: true,
			},
		})
	}
	getResourceItems={(moneroStealthOutputs) => [...new Map(moneroStealthOutputs.values.map((moneroStealthOutput) => [moneroStealthOutput[EntityMetaKey.SelectorKey], moneroStealthOutput])).values()]}
	getKey={(moneroStealthOutput) => moneroStealthOutput[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Monero stealth outputs yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: moneroStealthOutput })}
		{@const moneroStealthOutputFields = { ...moneroStealthOutput[EntityMetaKey.Selector], ...moneroStealthOutput }}
		{@const selection = select(EntityType.MoneroStealthOutput, moneroStealthOutput[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
		<MoneroStealthOutputView
			selection={selection}
			prefetched={moneroStealthOutputFields}
			layout={EntityLayout.Summary}
			open={false}
		/>
	{/snippet}
</EntitiesList>
