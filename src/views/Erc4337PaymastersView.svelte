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
		title = 'ERC-4337 paymasters',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'Erc4337Paymasters-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.Erc4337Paymaster>
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
	entityType={EntityType.Erc4337Paymaster}
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
				address: true,
				$network: true,
			},
		})
	}
	{countResource}
	getResourceItems={(erc4337Paymasters) => [...new Map(erc4337Paymasters.values.map((erc4337Paymaster) => [erc4337Paymaster[EntityMetaKey.SelectorKey], erc4337Paymaster])).values()]}
	getKey={(erc4337Paymaster) => erc4337Paymaster[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No ERC-4337 paymasters yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: erc4337Paymaster })}
		{@const erc4337PaymasterFields = { ...erc4337Paymaster[EntityMetaKey.Selector], ...erc4337Paymaster }}
		<EntityView
			entityType={EntityType.Erc4337Paymaster}
			entitySelector={erc4337Paymaster[EntityMetaKey.Selector]}
			href={
				(
					erc4337Paymaster[EntityMetaKey.Selector] != null && 'address' in erc4337Paymaster[EntityMetaKey.Selector]
					&& erc4337Paymaster[EntityMetaKey.Selector].address != null
					&& erc4337Paymaster[EntityMetaKey.Selector] != null && '$network' in erc4337Paymaster[EntityMetaKey.Selector] ?
						erc4337Paymaster[EntityMetaKey.Selector].$network != null && 'caip2' in erc4337Paymaster[EntityMetaKey.Selector].$network
						&& erc4337Paymaster[EntityMetaKey.Selector].$network.caip2 != null ?
							resolve('/network/[network=networkCaip2OrNetworkSlug]/erc-4337/paymaster/[address=evmAddress]', {
						address: String(erc4337Paymaster[EntityMetaKey.Selector].address ?? ''),
						network: String(caip2StringFromValue(erc4337Paymaster[EntityMetaKey.Selector].$network.caip2) ?? ''),
					})
					:
							erc4337Paymaster[EntityMetaKey.Selector].$network != null && 'slug' in erc4337Paymaster[EntityMetaKey.Selector].$network
							&& erc4337Paymaster[EntityMetaKey.Selector].$network.slug != null ?
								resolve('/network/[network=networkCaip2OrNetworkSlug]/erc-4337/paymaster/[address=evmAddress]', {
							address: String(erc4337Paymaster[EntityMetaKey.Selector].address ?? ''),
							network: String(erc4337Paymaster[EntityMetaKey.Selector].$network.slug ?? ''),
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
				{[String((erc4337PaymasterFields.address) ?? '')].filter(Boolean).join(' ') || 'ERC-4337 paymaster'}
			{/snippet}

			{#snippet Value()}
				{[String((erc4337PaymasterFields.address) ?? '')].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[[String((erc4337PaymasterFields.$network.name) ?? '')].filter(Boolean).join(' ') || [erc4337PaymasterFields.$network.caip2 == null ? '' : String(`${(erc4337PaymasterFields.$network.caip2).namespace}:${(erc4337PaymasterFields.$network.caip2).reference}`)].filter(Boolean).join(' ') || 'Network'].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
