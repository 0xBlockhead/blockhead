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
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.XrplAccount>
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
	{countResource}
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
		<EntityView
			entityType={EntityType.XrplAccount}
			entitySelector={xrplAccount[EntityMetaKey.Selector]}
			href={
				(
					xrplAccount[EntityMetaKey.Selector] != null && 'account' in xrplAccount[EntityMetaKey.Selector]
					&& xrplAccount[EntityMetaKey.Selector].account != null
					&& xrplAccount[EntityMetaKey.Selector] != null && '$network' in xrplAccount[EntityMetaKey.Selector] ?
						xrplAccount[EntityMetaKey.Selector].$network != null && 'caip2' in xrplAccount[EntityMetaKey.Selector].$network
						&& xrplAccount[EntityMetaKey.Selector].$network.caip2 != null ?
							resolve('/network/[network=networkCaip2OrNetworkSlug]/account/[accountId=polkadotAccountIdOrStringSegmentOrEvmAddressOrSolanaPubkey]', {
						accountId: String(xrplAccount[EntityMetaKey.Selector].account ?? ''),
						network: String(caip2StringFromValue(xrplAccount[EntityMetaKey.Selector].$network.caip2) ?? ''),
					})
					:
							xrplAccount[EntityMetaKey.Selector].$network != null && 'slug' in xrplAccount[EntityMetaKey.Selector].$network
							&& xrplAccount[EntityMetaKey.Selector].$network.slug != null ?
								resolve('/network/[network=networkCaip2OrNetworkSlug]/account/[accountId=polkadotAccountIdOrStringSegmentOrEvmAddressOrSolanaPubkey]', {
							accountId: String(xrplAccount[EntityMetaKey.Selector].account ?? ''),
							network: String(xrplAccount[EntityMetaKey.Selector].$network.slug ?? ''),
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
				{[String((xrplAccountFields.account) ?? '')].filter(Boolean).join(' ') || 'XRPL account'}
			{/snippet}

			{#snippet Value()}
				{[[String((xrplAccountFields.$network.name) ?? '')].filter(Boolean).join(' ') || [xrplAccountFields.$network.caip2 == null ? '' : String(`${(xrplAccountFields.$network.caip2).namespace}:${(xrplAccountFields.$network.caip2).reference}`)].filter(Boolean).join(' ') || 'Network'].filter(Boolean).join(' ')}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
