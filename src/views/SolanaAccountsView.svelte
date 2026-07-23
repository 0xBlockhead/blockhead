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
		id = 'SolanaAccounts-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.SolanaAccount>
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
	{countResource}
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
		<EntityView
			entityType={EntityType.SolanaAccount}
			entitySelector={solanaAccount[EntityMetaKey.Selector]}
			href={
				(
					solanaAccount[EntityMetaKey.Selector] != null && 'pubkey' in solanaAccount[EntityMetaKey.Selector]
					&& solanaAccount[EntityMetaKey.Selector].pubkey != null
					&& solanaAccount[EntityMetaKey.Selector] != null && '$network' in solanaAccount[EntityMetaKey.Selector] ?
						solanaAccount[EntityMetaKey.Selector].$network != null && 'caip2' in solanaAccount[EntityMetaKey.Selector].$network
						&& solanaAccount[EntityMetaKey.Selector].$network.caip2 != null ?
							resolve('/network/[network=networkCaip2OrNetworkSlug]/account/[accountId=polkadotAccountIdOrStringSegmentOrEvmAddressOrSolanaPubkey]', {
						accountId: String(solanaAccount[EntityMetaKey.Selector].pubkey ?? ''),
						network: String(caip2StringFromValue(solanaAccount[EntityMetaKey.Selector].$network.caip2) ?? ''),
					})
					:
							solanaAccount[EntityMetaKey.Selector].$network != null && 'slug' in solanaAccount[EntityMetaKey.Selector].$network
							&& solanaAccount[EntityMetaKey.Selector].$network.slug != null ?
								resolve('/network/[network=networkCaip2OrNetworkSlug]/account/[accountId=polkadotAccountIdOrStringSegmentOrEvmAddressOrSolanaPubkey]', {
							accountId: String(solanaAccount[EntityMetaKey.Selector].pubkey ?? ''),
							network: String(solanaAccount[EntityMetaKey.Selector].$network.slug ?? ''),
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
				{[String((solanaAccountFields.pubkey) ?? '')].filter(Boolean).join(' ') || 'solana account'}
			{/snippet}

			{#snippet Value()}
				{[[String((solanaAccountFields.$network.name) ?? '')].filter(Boolean).join(' ') || [solanaAccountFields.$network.caip2 == null ? '' : String(`${(solanaAccountFields.$network.caip2).namespace}:${(solanaAccountFields.$network.caip2).reference}`)].filter(Boolean).join(' ') || 'Network'].filter(Boolean).join(' ')}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
