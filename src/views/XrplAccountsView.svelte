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
		title = 'XRPL accounts',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'XrplAccounts-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesResource<EntityType.XrplAccount>
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
	import XrplAccountView from '$/views/XrplAccountView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.XrplAccount}
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
				account: true,
				$network: true,
			},
		})
	}
	getResourceItems={(xrplAccounts) => [...new Map(xrplAccounts.values.map((xrplAccount) => [xrplAccount[EntityMetaKey.SelectorKey], xrplAccount])).values()]}
	getKey={(xrplAccount) => xrplAccount[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No XRPL accounts yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: xrplAccount })}
		{@const xrplAccountFields = { ...xrplAccount[EntityMetaKey.Selector], ...xrplAccount }}
		{@const selection = select(EntityType.XrplAccount, xrplAccount[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
		{@const xrplAccountHrefFields = { ...xrplAccount, ...xrplAccount[EntityMetaKey.Selector] }}
		<XrplAccountView
			selection={selection}
			prefetched={xrplAccountFields}
			href={
				(xrplAccountHrefFields.account !== undefined && xrplAccountHrefFields.$network !== undefined && xrplAccountHrefFields.$network.caip2 !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/account/[accountId=polkadotAccountIdOrStringSegmentOrEvmAddressOrSolanaPubkey]', {
					accountId: String(xrplAccountHrefFields.account ?? ''),
					network: String(caip2StringFromValue(xrplAccountHrefFields.$network.caip2) ?? ''),
				}) : xrplAccountHrefFields.account !== undefined && xrplAccountHrefFields.$network !== undefined && xrplAccountHrefFields.$network.slug !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/account/[accountId=polkadotAccountIdOrStringSegmentOrEvmAddressOrSolanaPubkey]', {
					accountId: String(xrplAccountHrefFields.account ?? ''),
					network: String(xrplAccountHrefFields.$network.slug ?? ''),
				}) : undefined)
			}
			layout={EntityLayout.Summary}
			open={false}
		/>
	{/snippet}
</EntitiesList>
