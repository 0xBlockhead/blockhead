<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
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
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.EvmActorCoinAllowance>
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
	{countResource}
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
		<EntityView
			entityType={EntityType.EvmActorCoinAllowance}
			entitySelector={evmActorCoinAllowance[EntityMetaKey.Selector]}
			href={
				(
					evmActorCoinAllowance[EntityMetaKey.Selector] != null && '$actor' in evmActorCoinAllowance[EntityMetaKey.Selector]
					&& evmActorCoinAllowance[EntityMetaKey.Selector].$actor != null && 'address' in evmActorCoinAllowance[EntityMetaKey.Selector].$actor
					&& evmActorCoinAllowance[EntityMetaKey.Selector].$actor.address != null
					&& evmActorCoinAllowance[EntityMetaKey.Selector] != null && '$contract' in evmActorCoinAllowance[EntityMetaKey.Selector]
					&& evmActorCoinAllowance[EntityMetaKey.Selector].$contract != null && '$network' in evmActorCoinAllowance[EntityMetaKey.Selector].$contract
					&& evmActorCoinAllowance[EntityMetaKey.Selector].$contract.$network != null && 'caip2' in evmActorCoinAllowance[EntityMetaKey.Selector].$contract.$network
					&& evmActorCoinAllowance[EntityMetaKey.Selector].$contract.$network.caip2 != null && 'reference' in evmActorCoinAllowance[EntityMetaKey.Selector].$contract.$network.caip2
					&& evmActorCoinAllowance[EntityMetaKey.Selector].$contract.$network.caip2.reference != null
					&& evmActorCoinAllowance[EntityMetaKey.Selector].$contract != null && 'address' in evmActorCoinAllowance[EntityMetaKey.Selector].$contract
					&& evmActorCoinAllowance[EntityMetaKey.Selector].$contract.address != null
					&& evmActorCoinAllowance[EntityMetaKey.Selector] != null && '$spender' in evmActorCoinAllowance[EntityMetaKey.Selector]
					&& evmActorCoinAllowance[EntityMetaKey.Selector].$spender != null && 'address' in evmActorCoinAllowance[EntityMetaKey.Selector].$spender
					&& evmActorCoinAllowance[EntityMetaKey.Selector].$spender.address != null ?
						resolve('/~/accounts/allowance/[chainId=eip155ChainId]/[owner=evmAddress]/[coin=evmAddress]/[spender=evmAddress]', {
					owner: String(evmActorCoinAllowance[EntityMetaKey.Selector].$actor.address ?? ''),
					chainId: String(evmActorCoinAllowance[EntityMetaKey.Selector].$contract.$network.caip2.reference ?? ''),
					coin: String(evmActorCoinAllowance[EntityMetaKey.Selector].$contract.address ?? ''),
					spender: String(evmActorCoinAllowance[EntityMetaKey.Selector].$spender.address ?? ''),
				})
				:
						undefined
				)
			}
			layout={EntityLayout.Summary}
			open={false}
			showTypeAnnotation={false}
		>
			{#snippet Title()}
				{[[String((evmActorCoinAllowanceFields.$contract.precompileName) ?? ''), String((evmActorCoinAllowanceFields.$contract.address) ?? '')].filter(Boolean).join(' ') || 'EVM contract'].filter(Boolean).join(' ') || 'allowance'}
			{/snippet}

			{#snippet Value()}
				{[[String((evmActorCoinAllowanceFields.$spender.address) ?? '')].filter(Boolean).join(' ') || 'EVM account'].filter(Boolean).join(' ')}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
