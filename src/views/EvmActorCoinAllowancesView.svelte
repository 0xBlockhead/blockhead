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
		title = 'Allowances',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'EvmActorCoinAllowances-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesResource<EntityType.EvmActorCoinAllowance>
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
	import EvmActorCoinAllowanceView from '$/views/EvmActorCoinAllowanceView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.EvmActorCoinAllowance}
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
				$spender: true,
				$actor: true,
			},
		})
	}
	getResourceItems={(evmActorCoinAllowances) => [...new Map(evmActorCoinAllowances.values.map((evmActorCoinAllowance) => [evmActorCoinAllowance[EntityMetaKey.SelectorKey], evmActorCoinAllowance])).values()]}
	getKey={(evmActorCoinAllowance) => evmActorCoinAllowance[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Allowances yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: evmActorCoinAllowance })}
		{@const evmActorCoinAllowanceFields = { ...evmActorCoinAllowance[EntityMetaKey.Selector], ...evmActorCoinAllowance }}
		{@const selection = select(EntityType.EvmActorCoinAllowance, evmActorCoinAllowance[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
		{@const evmActorCoinAllowanceHrefFields = { ...evmActorCoinAllowance, ...evmActorCoinAllowance[EntityMetaKey.Selector] }}
		<EvmActorCoinAllowanceView
			selection={selection}
			prefetched={evmActorCoinAllowanceFields}
			href={
				(evmActorCoinAllowanceHrefFields.$actor !== undefined && evmActorCoinAllowanceHrefFields.$actor.address !== undefined && evmActorCoinAllowanceHrefFields.$contract !== undefined && evmActorCoinAllowanceHrefFields.$contract.$network !== undefined && evmActorCoinAllowanceHrefFields.$contract.$network.caip2 !== undefined && evmActorCoinAllowanceHrefFields.$contract.$network.caip2.reference !== undefined && evmActorCoinAllowanceHrefFields.$contract.address !== undefined && evmActorCoinAllowanceHrefFields.$spender !== undefined && evmActorCoinAllowanceHrefFields.$spender.address !== undefined ? resolve('/~/accounts/allowance/[chainId=eip155ChainId]/[owner=evmAddress]/[coin=evmAddress]/[spender=evmAddress]', {
					owner: String(evmActorCoinAllowanceHrefFields.$actor.address ?? ''),
					chainId: String(evmActorCoinAllowanceHrefFields.$contract.$network.caip2.reference ?? ''),
					coin: String(evmActorCoinAllowanceHrefFields.$contract.address ?? ''),
					spender: String(evmActorCoinAllowanceHrefFields.$spender.address ?? ''),
				}) : undefined)
			}
			layout={EntityLayout.Summary}
			open={false}
		/>
	{/snippet}
</EntitiesList>
