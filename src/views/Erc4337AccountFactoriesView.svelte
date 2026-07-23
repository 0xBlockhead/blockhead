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
		title = 'ERC-4337 account factories',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'Erc4337AccountFactories-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.Erc4337AccountFactory>
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
	entityType={EntityType.Erc4337AccountFactory}
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
	getResourceItems={(erc4337AccountFactories) => [...new Map(erc4337AccountFactories.values.map((erc4337AccountFactory) => [erc4337AccountFactory[EntityMetaKey.SelectorKey], erc4337AccountFactory])).values()]}
	getKey={(erc4337AccountFactory) => erc4337AccountFactory[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No ERC-4337 account factories yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: erc4337AccountFactory })}
		{@const erc4337AccountFactoryFields = { ...erc4337AccountFactory[EntityMetaKey.Selector], ...erc4337AccountFactory }}
		<EntityView
			entityType={EntityType.Erc4337AccountFactory}
			entitySelector={erc4337AccountFactory[EntityMetaKey.Selector]}
			href={
				(
					erc4337AccountFactory[EntityMetaKey.Selector] != null && 'address' in erc4337AccountFactory[EntityMetaKey.Selector]
					&& erc4337AccountFactory[EntityMetaKey.Selector].address != null
					&& erc4337AccountFactory[EntityMetaKey.Selector] != null && '$network' in erc4337AccountFactory[EntityMetaKey.Selector] ?
						erc4337AccountFactory[EntityMetaKey.Selector].$network != null && 'caip2' in erc4337AccountFactory[EntityMetaKey.Selector].$network
						&& erc4337AccountFactory[EntityMetaKey.Selector].$network.caip2 != null ?
							resolve('/network/[network=networkCaip2OrNetworkSlug]/erc-4337/account-factory/[address=evmAddress]', {
						address: String(erc4337AccountFactory[EntityMetaKey.Selector].address ?? ''),
						network: String(caip2StringFromValue(erc4337AccountFactory[EntityMetaKey.Selector].$network.caip2) ?? ''),
					})
					:
							erc4337AccountFactory[EntityMetaKey.Selector].$network != null && 'slug' in erc4337AccountFactory[EntityMetaKey.Selector].$network
							&& erc4337AccountFactory[EntityMetaKey.Selector].$network.slug != null ?
								resolve('/network/[network=networkCaip2OrNetworkSlug]/erc-4337/account-factory/[address=evmAddress]', {
							address: String(erc4337AccountFactory[EntityMetaKey.Selector].address ?? ''),
							network: String(erc4337AccountFactory[EntityMetaKey.Selector].$network.slug ?? ''),
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
				{[String((erc4337AccountFactoryFields.address) ?? '')].filter(Boolean).join(' ') || 'ERC-4337 account factory'}
			{/snippet}

			{#snippet Value()}
				{[String((erc4337AccountFactoryFields.address) ?? '')].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[[String((erc4337AccountFactoryFields.$network.name) ?? '')].filter(Boolean).join(' ') || [erc4337AccountFactoryFields.$network.caip2 == null ? '' : String(`${(erc4337AccountFactoryFields.$network.caip2).namespace}:${(erc4337AccountFactoryFields.$network.caip2).reference}`)].filter(Boolean).join(' ') || 'Network'].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
