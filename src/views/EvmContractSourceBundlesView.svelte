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
		title = 'Contract source bundles',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'EvmContractSourceBundles-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesResource<EntityType.EvmContractSourceBundle>
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
	import EvmContractSourceBundleView from '$/views/EvmContractSourceBundleView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.EvmContractSourceBundle}
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
				$contract: true,
			},
		})
	}
	getResourceItems={(evmContractSourceBundles) => [...new Map(evmContractSourceBundles.values.map((evmContractSourceBundle) => [evmContractSourceBundle[EntityMetaKey.SelectorKey], evmContractSourceBundle])).values()]}
	getKey={(evmContractSourceBundle) => evmContractSourceBundle[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No EVM contract source bundles yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: evmContractSourceBundle })}
		{@const evmContractSourceBundleFields = { ...evmContractSourceBundle[EntityMetaKey.Selector], ...evmContractSourceBundle }}
		{@const selection = select(EntityType.EvmContractSourceBundle, evmContractSourceBundle[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
		<EvmContractSourceBundleView
			selection={selection}
			prefetched={evmContractSourceBundleFields}
			layout={EntityLayout.Summary}
			open={false}
		/>
	{/snippet}
</EntitiesList>
