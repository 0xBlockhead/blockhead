<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntitiesList, { type EntitiesListForwardProps } from '$/components/EntitiesList.svelte'
	import type { RegisteredEntityProxyEntitiesSelection } from '$/client/$proxy.svelte.ts'
	import type { SvelteKitResource } from '$/lib/db/queryResource.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'




	// State
	let {
		selection,
		countResource,
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
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.EvmContractSourceBundle>
			countResource?: SvelteKitResource<number>
			title?: string
			typeAnnotationParagraphs?: string[]
			placeholderText?: string
			emptyText?: string
			open?: boolean
			collapsible?: boolean
			showTypeAnnotation?: boolean
			id?: string
		},
		EntitiesListForwardProps
	> = $props()


	// Components
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
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
	{countResource}
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
		<EntityView
			entityType={EntityType.EvmContractSourceBundle}
			entitySelector={evmContractSourceBundle[EntityMetaKey.Selector]}
			layout={EntityLayout.Summary}
			open={false}
			showTypeAnnotation={false}
		>
			{#snippet Title()}
				{[[String((evmContractSourceBundleFields.$contract.precompileName) ?? ''), String((evmContractSourceBundleFields.$contract.address) ?? '')].filter(Boolean).join(' ') || 'EVM contract'].filter(Boolean).join(' ') || 'EVM contract source bundle'}
			{/snippet}

			{#snippet Value()}
				{[[String((evmContractSourceBundleFields.$contract.precompileName) ?? ''), String((evmContractSourceBundleFields.$contract.address) ?? '')].filter(Boolean).join(' ') || 'EVM contract'].filter(Boolean).join(' ')}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
