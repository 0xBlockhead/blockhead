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
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.Erc4337SmartAccount>
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
	{countResource}
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
		<EntityView
			entityType={EntityType.Erc4337SmartAccount}
			entitySelector={erc4337SmartAccount[EntityMetaKey.Selector]}
			href={
				(
					erc4337SmartAccount[EntityMetaKey.Selector] != null && 'address' in erc4337SmartAccount[EntityMetaKey.Selector]
					&& erc4337SmartAccount[EntityMetaKey.Selector].address != null
					&& erc4337SmartAccount[EntityMetaKey.Selector] != null && '$network' in erc4337SmartAccount[EntityMetaKey.Selector] ?
						erc4337SmartAccount[EntityMetaKey.Selector].$network != null && 'caip2' in erc4337SmartAccount[EntityMetaKey.Selector].$network
						&& erc4337SmartAccount[EntityMetaKey.Selector].$network.caip2 != null ?
							resolve('/network/[network=networkCaip2OrNetworkSlug]/erc-4337/smart-account/[address=evmAddress]', {
						address: String(erc4337SmartAccount[EntityMetaKey.Selector].address ?? ''),
						network: String(caip2StringFromValue(erc4337SmartAccount[EntityMetaKey.Selector].$network.caip2) ?? ''),
					})
					:
							erc4337SmartAccount[EntityMetaKey.Selector].$network != null && 'slug' in erc4337SmartAccount[EntityMetaKey.Selector].$network
							&& erc4337SmartAccount[EntityMetaKey.Selector].$network.slug != null ?
								resolve('/network/[network=networkCaip2OrNetworkSlug]/erc-4337/smart-account/[address=evmAddress]', {
							address: String(erc4337SmartAccount[EntityMetaKey.Selector].address ?? ''),
							network: String(erc4337SmartAccount[EntityMetaKey.Selector].$network.slug ?? ''),
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
				{[String((erc4337SmartAccountFields.address) ?? '')].filter(Boolean).join(' ') || 'ERC-4337 smart account'}
			{/snippet}

			{#snippet Value()}
				{[String((erc4337SmartAccountFields.address) ?? '')].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[[String((erc4337SmartAccountFields.$network.name) ?? '')].filter(Boolean).join(' ') || [erc4337SmartAccountFields.$network.caip2 == null ? '' : String(`${(erc4337SmartAccountFields.$network.caip2).namespace}:${(erc4337SmartAccountFields.$network.caip2).reference}`)].filter(Boolean).join(' ') || 'Network'].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
