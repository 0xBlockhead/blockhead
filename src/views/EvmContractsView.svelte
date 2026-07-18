<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { RegisteredEntityProxyEntitiesResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2StringFromValue } from '$/lib/caip2.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		title = 'EVM contracts',
		typeAnnotationParagraphs = ['A smart contract account and its contract-specific metadata on an EVM-compatible network.'],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'EvmContracts-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesResource<EntityType.EvmContract>
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
	import EvmContractView from '$/views/EvmContractView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.EvmContract}
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
				precompileName: true,
				address: true,
				$network: true,
			},
		})
	}
	getResourceItems={(evmContracts) => [...new Map(evmContracts.values.map((evmContract) => [evmContract[EntityMetaKey.SelectorKey], evmContract])).values()]}
	getKey={(evmContract) => evmContract[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No EVM contracts yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: evmContract })}
		{@const evmContractFields = { ...evmContract[EntityMetaKey.Selector], ...evmContract }}
		{@const selection = select(EntityType.EvmContract, evmContract[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
		{@const evmContractHrefFields = { ...evmContract, ...evmContract[EntityMetaKey.Selector] }}
		<EvmContractView
			selection={selection}
			prefetched={evmContractFields}
			href={
				(evmContractHrefFields.address !== undefined && evmContractHrefFields.$network !== undefined && evmContractHrefFields.$network.caip2 !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/contract/[address=evmAddress]', {
					address: String(evmContractHrefFields.address ?? ''),
					network: String(caip2StringFromValue(evmContractHrefFields.$network.caip2) ?? ''),
				}) : evmContractHrefFields.address !== undefined && evmContractHrefFields.$network !== undefined && evmContractHrefFields.$network.slug !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/contract/[address=evmAddress]', {
					address: String(evmContractHrefFields.address ?? ''),
					network: String(evmContractHrefFields.$network.slug ?? ''),
				}) : undefined)
			}
			layout={EntityLayout.Summary}
			open={false}
		/>
	{/snippet}
</EntitiesList>
