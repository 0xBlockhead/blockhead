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
		title = 'Contract compilations',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'EvmContractCompilations-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.EvmContractCompilation>
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
	entityType={EntityType.EvmContractCompilation}
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
				name: true,
				fullyQualifiedName: true,
				compiler: true,
				compilerVersion: true,
				language: true,
				$contract: true,
			},
		})
	}
	{countResource}
	getResourceItems={(evmContractCompilations) => [...new Map(evmContractCompilations.values.map((evmContractCompilation) => [evmContractCompilation[EntityMetaKey.SelectorKey], evmContractCompilation])).values()]}
	getKey={(evmContractCompilation) => evmContractCompilation[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No EVM contract compilations yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: evmContractCompilation })}
		{@const evmContractCompilationFields = { ...evmContractCompilation[EntityMetaKey.Selector], ...evmContractCompilation }}
		<EntityView
			entityType={EntityType.EvmContractCompilation}
			entitySelector={evmContractCompilation[EntityMetaKey.Selector]}
			layout={EntityLayout.Summary}
			open={false}
			showTypeAnnotation={false}
		>
			{#snippet Title()}
				{[String((evmContractCompilationFields.name) ?? ''), String((evmContractCompilationFields.fullyQualifiedName) ?? ''), String((evmContractCompilationFields.compiler) ?? '')].filter(Boolean).join(' ') || 'EVM contract compilation'}
			{/snippet}

			{#snippet Value()}
				{[String((evmContractCompilationFields.compilerVersion) ?? ''), String((evmContractCompilationFields.language) ?? '')].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[[String((evmContractCompilationFields.$contract.precompileName) ?? ''), String((evmContractCompilationFields.$contract.address) ?? '')].filter(Boolean).join(' ') || 'EVM contract'].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
