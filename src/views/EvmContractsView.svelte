<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { SubscribeEntityReferenceResult } from '$/client/$client.svelte.ts'
	import type { EntityProxyEntitiesResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		title = 'EVM contracts',
		typeAnnotationParagraphs = ['A smart contract account and its contract-specific metadata on an EVM-compatible network.'],
		placeholderText,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'EvmContracts-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.EvmContract>
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


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import EvmContractView from '$/views/EvmContractView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

{#if open}
	<ResourceBoundary
		resource={
			selection({
				fields: {
					precompileName: true,
					address: true,
					$network: true,
				},
			})
		}
		{placeholderText}
	>
		{#snippet children(evmContracts)}
			{@const uniqueEvmContracts = [...new Map(evmContracts.values.map((evmContract) => [evmContract[EntityMetaKey.SelectorKey], evmContract])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.EvmContract}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				totalCount={evmContracts.totalCount}
				getKey={(evmContract) => evmContract[EntityMetaKey.SelectorKey]}
				items={uniqueEvmContracts}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No EVM contracts yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: evmContract }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType.EvmContract> })}
					{@const evmContractFields = { ...evmContract[EntityMetaKey.Selector], ...evmContract }}
					{@const evmContractHrefFields = { ...evmContract, ...evmContract[EntityMetaKey.Selector] }}
					<EvmContractView
						selection={select(EntityType.EvmContract, evmContract[EntityMetaKey.Selector])}
						prefetched={evmContractFields}
						href={
							(evmContractHrefFields.$network !== undefined && evmContractHrefFields.$network.caip2 !== undefined && evmContractHrefFields.$network.caip2.namespace !== undefined && evmContractHrefFields.$network !== undefined && evmContractHrefFields.$network.caip2 !== undefined && evmContractHrefFields.$network.caip2.reference !== undefined && evmContractHrefFields.address !== undefined ? resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/(contracts)/contract/[address=evmAddress]', {
								caip2: `${String(evmContractHrefFields.$network.caip2.namespace ?? '')}:${String(evmContractHrefFields.$network.caip2.reference ?? '')}`,
								address: String(evmContractHrefFields.address ?? ''),
							}) : undefined)
						}
						layout={EntityLayout.Summary}
						open={false}
					/>
				{/snippet}
			</EntitiesList>
		{/snippet}
	</ResourceBoundary>
{:else}
	<EntitiesList
		{...EntitiesListProps}
		entityType={EntityType.EvmContract}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}
