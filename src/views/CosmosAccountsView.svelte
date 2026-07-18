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
		id = 'CosmosAccounts-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesResource<EntityType.CosmosAccount>
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
	import CosmosAccountView from '$/views/CosmosAccountView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.CosmosAccount}
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
	getResourceItems={(cosmosAccounts) => [...new Map(cosmosAccounts.values.map((cosmosAccount) => [cosmosAccount[EntityMetaKey.SelectorKey], cosmosAccount])).values()]}
	getKey={(cosmosAccount) => cosmosAccount[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Cosmos accounts yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: cosmosAccount })}
		{@const cosmosAccountFields = { ...cosmosAccount[EntityMetaKey.Selector], ...cosmosAccount }}
		{@const selection = select(EntityType.CosmosAccount, cosmosAccount[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
		{@const cosmosAccountHrefFields = { ...cosmosAccount, ...cosmosAccount[EntityMetaKey.Selector] }}
		<CosmosAccountView
			selection={selection}
			prefetched={cosmosAccountFields}
			href={
				(cosmosAccountHrefFields.address !== undefined && cosmosAccountHrefFields.$network !== undefined && cosmosAccountHrefFields.$network.caip2 !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/account/[accountId=polkadotAccountIdOrStringSegmentOrEvmAddressOrSolanaPubkey]', {
					accountId: String(cosmosAccountHrefFields.address ?? ''),
					network: String(caip2StringFromValue(cosmosAccountHrefFields.$network.caip2) ?? ''),
				}) : cosmosAccountHrefFields.address !== undefined && cosmosAccountHrefFields.$network !== undefined && cosmosAccountHrefFields.$network.slug !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/account/[accountId=polkadotAccountIdOrStringSegmentOrEvmAddressOrSolanaPubkey]', {
					accountId: String(cosmosAccountHrefFields.address ?? ''),
					network: String(cosmosAccountHrefFields.$network.slug ?? ''),
				}) : undefined)
			}
			layout={EntityLayout.Summary}
			open={false}
		/>
	{/snippet}
</EntitiesList>
