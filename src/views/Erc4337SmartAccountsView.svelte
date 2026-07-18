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
		title = 'ERC-4337 smart accounts',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'Erc4337SmartAccounts-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesResource<EntityType.Erc4337SmartAccount>
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
	import Erc4337SmartAccountView from '$/views/Erc4337SmartAccountView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.Erc4337SmartAccount}
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
	getResourceItems={(erc4337SmartAccounts) => [...new Map(erc4337SmartAccounts.values.map((erc4337SmartAccount) => [erc4337SmartAccount[EntityMetaKey.SelectorKey], erc4337SmartAccount])).values()]}
	getKey={(erc4337SmartAccount) => erc4337SmartAccount[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No ERC-4337 smart accounts yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: erc4337SmartAccount })}
		{@const erc4337SmartAccountFields = { ...erc4337SmartAccount[EntityMetaKey.Selector], ...erc4337SmartAccount }}
		{@const selection = select(EntityType.Erc4337SmartAccount, erc4337SmartAccount[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
		{@const erc4337SmartAccountHrefFields = { ...erc4337SmartAccount, ...erc4337SmartAccount[EntityMetaKey.Selector] }}
		<Erc4337SmartAccountView
			selection={selection}
			prefetched={erc4337SmartAccountFields}
			href={
				(erc4337SmartAccountHrefFields.address !== undefined && erc4337SmartAccountHrefFields.$network !== undefined && erc4337SmartAccountHrefFields.$network.caip2 !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/erc-4337/smart-account/[address=evmAddress]', {
					address: String(erc4337SmartAccountHrefFields.address ?? ''),
					network: String(caip2StringFromValue(erc4337SmartAccountHrefFields.$network.caip2) ?? ''),
				}) : erc4337SmartAccountHrefFields.address !== undefined && erc4337SmartAccountHrefFields.$network !== undefined && erc4337SmartAccountHrefFields.$network.slug !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/erc-4337/smart-account/[address=evmAddress]', {
					address: String(erc4337SmartAccountHrefFields.address ?? ''),
					network: String(erc4337SmartAccountHrefFields.$network.slug ?? ''),
				}) : undefined)
			}
			layout={EntityLayout.Summary}
			open={false}
		/>
	{/snippet}
</EntitiesList>
