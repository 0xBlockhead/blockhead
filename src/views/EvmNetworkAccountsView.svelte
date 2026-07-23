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
		title = 'EVM network accounts',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'EvmNetworkAccounts-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.EvmNetworkAccount>
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
	entityType={EntityType.EvmNetworkAccount}
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
				$actor: true,
				$network: true,
			},
		})
	}
	{countResource}
	getResourceItems={(evmNetworkAccounts) => [...new Map(evmNetworkAccounts.values.map((evmNetworkAccount) => [evmNetworkAccount[EntityMetaKey.SelectorKey], evmNetworkAccount])).values()]}
	getKey={(evmNetworkAccount) => evmNetworkAccount[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No EVM network accounts yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: evmNetworkAccount })}
		{@const evmNetworkAccountFields = { ...evmNetworkAccount[EntityMetaKey.Selector], ...evmNetworkAccount }}
		<EntityView
			entityType={EntityType.EvmNetworkAccount}
			entitySelector={evmNetworkAccount[EntityMetaKey.Selector]}
			href={
				(
					evmNetworkAccount[EntityMetaKey.Selector] != null && '$actor' in evmNetworkAccount[EntityMetaKey.Selector]
					&& evmNetworkAccount[EntityMetaKey.Selector].$actor != null && 'address' in evmNetworkAccount[EntityMetaKey.Selector].$actor
					&& evmNetworkAccount[EntityMetaKey.Selector].$actor.address != null
					&& evmNetworkAccount[EntityMetaKey.Selector] != null && '$network' in evmNetworkAccount[EntityMetaKey.Selector] ?
						evmNetworkAccount[EntityMetaKey.Selector].$network != null && 'caip2' in evmNetworkAccount[EntityMetaKey.Selector].$network
						&& evmNetworkAccount[EntityMetaKey.Selector].$network.caip2 != null ?
							resolve('/network/[network=networkCaip2OrNetworkSlug]/account/[accountId=polkadotAccountIdOrStringSegmentOrEvmAddressOrSolanaPubkey]', {
						accountId: String(evmNetworkAccount[EntityMetaKey.Selector].$actor.address ?? ''),
						network: String(caip2StringFromValue(evmNetworkAccount[EntityMetaKey.Selector].$network.caip2) ?? ''),
					})
					:
							evmNetworkAccount[EntityMetaKey.Selector].$network != null && 'slug' in evmNetworkAccount[EntityMetaKey.Selector].$network
							&& evmNetworkAccount[EntityMetaKey.Selector].$network.slug != null ?
								resolve('/network/[network=networkCaip2OrNetworkSlug]/account/[accountId=polkadotAccountIdOrStringSegmentOrEvmAddressOrSolanaPubkey]', {
							accountId: String(evmNetworkAccount[EntityMetaKey.Selector].$actor.address ?? ''),
							network: String(evmNetworkAccount[EntityMetaKey.Selector].$network.slug ?? ''),
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
				{[[String((evmNetworkAccountFields.$actor.address) ?? '')].filter(Boolean).join(' ') || 'EVM account'].filter(Boolean).join(' ') || 'EVM network account'}
			{/snippet}

			{#snippet Value()}
				{[[String((evmNetworkAccountFields.$network.name) ?? '')].filter(Boolean).join(' ') || [evmNetworkAccountFields.$network.caip2 == null ? '' : String(`${(evmNetworkAccountFields.$network.caip2).namespace}:${(evmNetworkAccountFields.$network.caip2).reference}`)].filter(Boolean).join(' ') || 'Network'].filter(Boolean).join(' ')}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
