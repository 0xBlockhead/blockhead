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
		title = 'Accounts',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'SolanaAccounts-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesResource<EntityType.SolanaAccount>
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
	import SolanaAccountView from '$/views/SolanaAccountView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.SolanaAccount}
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
				pubkey: true,
				$network: true,
			},
		})
	}
	getResourceItems={(solanaAccounts) => [...new Map(solanaAccounts.values.map((solanaAccount) => [solanaAccount[EntityMetaKey.SelectorKey], solanaAccount])).values()]}
	getKey={(solanaAccount) => solanaAccount[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Solana accounts yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: solanaAccount })}
		{@const solanaAccountFields = { ...solanaAccount[EntityMetaKey.Selector], ...solanaAccount }}
		{@const selection = select(EntityType.SolanaAccount, solanaAccount[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
		{@const solanaAccountHrefFields = { ...solanaAccount, ...solanaAccount[EntityMetaKey.Selector] }}
		<SolanaAccountView
			selection={selection}
			prefetched={solanaAccountFields}
			href={
				(solanaAccountHrefFields.pubkey !== undefined && solanaAccountHrefFields.$network !== undefined && solanaAccountHrefFields.$network.caip2 !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/account/[accountId=polkadotAccountIdOrStringSegmentOrEvmAddressOrSolanaPubkey]', {
					accountId: String(solanaAccountHrefFields.pubkey ?? ''),
					network: String(caip2StringFromValue(solanaAccountHrefFields.$network.caip2) ?? ''),
				}) : solanaAccountHrefFields.pubkey !== undefined && solanaAccountHrefFields.$network !== undefined && solanaAccountHrefFields.$network.slug !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/account/[accountId=polkadotAccountIdOrStringSegmentOrEvmAddressOrSolanaPubkey]', {
					accountId: String(solanaAccountHrefFields.pubkey ?? ''),
					network: String(solanaAccountHrefFields.$network.slug ?? ''),
				}) : undefined)
			}
			layout={EntityLayout.Summary}
			open={false}
		/>
	{/snippet}
</EntitiesList>
