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
		id = 'PolkadotAccounts-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesResource<EntityType.PolkadotAccount>
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
	import PolkadotAccountView from '$/views/PolkadotAccountView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.PolkadotAccount}
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
				accountId: true,
				$network: true,
			},
		})
	}
	getResourceItems={(polkadotAccounts) => [...new Map(polkadotAccounts.values.map((polkadotAccount) => [polkadotAccount[EntityMetaKey.SelectorKey], polkadotAccount])).values()]}
	getKey={(polkadotAccount) => polkadotAccount[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Polkadot accounts yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: polkadotAccount })}
		{@const polkadotAccountFields = { ...polkadotAccount[EntityMetaKey.Selector], ...polkadotAccount }}
		{@const selection = select(EntityType.PolkadotAccount, polkadotAccount[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
		{@const polkadotAccountHrefFields = { ...polkadotAccount, ...polkadotAccount[EntityMetaKey.Selector] }}
		<PolkadotAccountView
			selection={selection}
			prefetched={polkadotAccountFields}
			href={
				(polkadotAccountHrefFields.accountId !== undefined && polkadotAccountHrefFields.$network !== undefined && polkadotAccountHrefFields.$network.caip2 !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/account/[accountId=polkadotAccountIdOrStringSegmentOrEvmAddressOrSolanaPubkey]', {
					accountId: String(polkadotAccountHrefFields.accountId ?? ''),
					network: String(caip2StringFromValue(polkadotAccountHrefFields.$network.caip2) ?? ''),
				}) : polkadotAccountHrefFields.accountId !== undefined && polkadotAccountHrefFields.$network !== undefined && polkadotAccountHrefFields.$network.slug !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/account/[accountId=polkadotAccountIdOrStringSegmentOrEvmAddressOrSolanaPubkey]', {
					accountId: String(polkadotAccountHrefFields.accountId ?? ''),
					network: String(polkadotAccountHrefFields.$network.slug ?? ''),
				}) : undefined)
			}
			layout={EntityLayout.Summary}
			open={false}
		/>
	{/snippet}
</EntitiesList>
