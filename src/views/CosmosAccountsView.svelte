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
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.CosmosAccount>
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
	{countResource}
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
		<EntityView
			entityType={EntityType.CosmosAccount}
			entitySelector={cosmosAccount[EntityMetaKey.Selector]}
			href={
				(
					cosmosAccount[EntityMetaKey.Selector] != null && 'address' in cosmosAccount[EntityMetaKey.Selector]
					&& cosmosAccount[EntityMetaKey.Selector].address != null
					&& cosmosAccount[EntityMetaKey.Selector] != null && '$network' in cosmosAccount[EntityMetaKey.Selector] ?
						cosmosAccount[EntityMetaKey.Selector].$network != null && 'caip2' in cosmosAccount[EntityMetaKey.Selector].$network
						&& cosmosAccount[EntityMetaKey.Selector].$network.caip2 != null ?
							resolve('/network/[network=networkCaip2OrNetworkSlug]/account/[accountId=polkadotAccountIdOrStringSegmentOrEvmAddressOrSolanaPubkey]', {
						accountId: String(cosmosAccount[EntityMetaKey.Selector].address ?? ''),
						network: String(caip2StringFromValue(cosmosAccount[EntityMetaKey.Selector].$network.caip2) ?? ''),
					})
					:
							cosmosAccount[EntityMetaKey.Selector].$network != null && 'slug' in cosmosAccount[EntityMetaKey.Selector].$network
							&& cosmosAccount[EntityMetaKey.Selector].$network.slug != null ?
								resolve('/network/[network=networkCaip2OrNetworkSlug]/account/[accountId=polkadotAccountIdOrStringSegmentOrEvmAddressOrSolanaPubkey]', {
							accountId: String(cosmosAccount[EntityMetaKey.Selector].address ?? ''),
							network: String(cosmosAccount[EntityMetaKey.Selector].$network.slug ?? ''),
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
				{[String((cosmosAccountFields.address) ?? '')].filter(Boolean).join(' ') || 'Cosmos account'}
			{/snippet}

			{#snippet Value()}
				{[String((cosmosAccountFields.address) ?? '')].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[[String((cosmosAccountFields.$network.name) ?? '')].filter(Boolean).join(' ') || [cosmosAccountFields.$network.caip2 == null ? '' : String(`${(cosmosAccountFields.$network.caip2).namespace}:${(cosmosAccountFields.$network.caip2).reference}`)].filter(Boolean).join(' ') || 'Network'].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
