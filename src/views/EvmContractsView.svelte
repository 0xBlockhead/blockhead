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
	import { caip2StringFromValue } from '$/lib/caip2.ts'




	// State
	let {
		selection,
		countResource,
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
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.EvmContract>
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
	{countResource}
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
		<EntityView
			entityType={EntityType.EvmContract}
			entitySelector={evmContract[EntityMetaKey.Selector]}
			href={
				(
					evmContract[EntityMetaKey.Selector] != null && 'address' in evmContract[EntityMetaKey.Selector]
					&& evmContract[EntityMetaKey.Selector].address != null
					&& evmContract[EntityMetaKey.Selector] != null && '$network' in evmContract[EntityMetaKey.Selector] ?
						evmContract[EntityMetaKey.Selector].$network != null && 'caip2' in evmContract[EntityMetaKey.Selector].$network
						&& evmContract[EntityMetaKey.Selector].$network.caip2 != null ?
							resolve('/network/[network=networkCaip2OrNetworkSlug]/contract/[address=evmAddress]', {
						address: String(evmContract[EntityMetaKey.Selector].address ?? ''),
						network: String(caip2StringFromValue(evmContract[EntityMetaKey.Selector].$network.caip2) ?? ''),
					})
					:
							evmContract[EntityMetaKey.Selector].$network != null && 'slug' in evmContract[EntityMetaKey.Selector].$network
							&& evmContract[EntityMetaKey.Selector].$network.slug != null ?
								resolve('/network/[network=networkCaip2OrNetworkSlug]/contract/[address=evmAddress]', {
							address: String(evmContract[EntityMetaKey.Selector].address ?? ''),
							network: String(evmContract[EntityMetaKey.Selector].$network.slug ?? ''),
						})
						:
							undefined
				:
						undefined
				)
			}
			layout={EntityLayout.Summary}
			open={false}
			showTypeAnnotation={false}
		>
			{#snippet Title()}
				{[String((evmContractFields.precompileName) ?? ''), String((evmContractFields.address) ?? '')].filter(Boolean).join(' ') || 'EVM contract'}
			{/snippet}

			{#snippet Value()}
				{[String((evmContractFields.precompileName) ?? ''), String((evmContractFields.address) ?? '')].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[[String((evmContractFields.$network.name) ?? '')].filter(Boolean).join(' ') || [evmContractFields.$network.caip2 == null ? '' : String(`${(evmContractFields.$network.caip2).namespace}:${(evmContractFields.$network.caip2).reference}`)].filter(Boolean).join(' ') || 'Network'].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
