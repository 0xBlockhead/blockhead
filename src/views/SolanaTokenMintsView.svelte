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
		title = 'Token mints',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'SolanaTokenMints-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.SolanaTokenMint>
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
	entityType={EntityType.SolanaTokenMint}
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
				mintAddress: true,
				$network: true,
			},
		})
	}
	{countResource}
	getResourceItems={(solanaTokenMints) => [...new Map(solanaTokenMints.values.map((solanaTokenMint) => [solanaTokenMint[EntityMetaKey.SelectorKey], solanaTokenMint])).values()]}
	getKey={(solanaTokenMint) => solanaTokenMint[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Solana token mints yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: solanaTokenMint })}
		{@const solanaTokenMintFields = { ...solanaTokenMint[EntityMetaKey.Selector], ...solanaTokenMint }}
		<EntityView
			entityType={EntityType.SolanaTokenMint}
			entitySelector={solanaTokenMint[EntityMetaKey.Selector]}
			href={
				(
					solanaTokenMint[EntityMetaKey.Selector] != null && 'mintAddress' in solanaTokenMint[EntityMetaKey.Selector]
					&& solanaTokenMint[EntityMetaKey.Selector].mintAddress != null
					&& solanaTokenMint[EntityMetaKey.Selector] != null && '$network' in solanaTokenMint[EntityMetaKey.Selector] ?
						solanaTokenMint[EntityMetaKey.Selector].$network != null && 'caip2' in solanaTokenMint[EntityMetaKey.Selector].$network
						&& solanaTokenMint[EntityMetaKey.Selector].$network.caip2 != null ?
							resolve('/network/[network=networkCaip2OrNetworkSlug]/token-mint/[mintAddress=stringSegment]', {
						mintAddress: String(solanaTokenMint[EntityMetaKey.Selector].mintAddress ?? ''),
						network: String(caip2StringFromValue(solanaTokenMint[EntityMetaKey.Selector].$network.caip2) ?? ''),
					})
					:
							solanaTokenMint[EntityMetaKey.Selector].$network != null && 'slug' in solanaTokenMint[EntityMetaKey.Selector].$network
							&& solanaTokenMint[EntityMetaKey.Selector].$network.slug != null ?
								resolve('/network/[network=networkCaip2OrNetworkSlug]/token-mint/[mintAddress=stringSegment]', {
							mintAddress: String(solanaTokenMint[EntityMetaKey.Selector].mintAddress ?? ''),
							network: String(solanaTokenMint[EntityMetaKey.Selector].$network.slug ?? ''),
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
				{[String((solanaTokenMintFields.mintAddress) ?? '')].filter(Boolean).join(' ') || 'solana token mint'}
			{/snippet}

			{#snippet Value()}
				{[String((solanaTokenMintFields.mintAddress) ?? '')].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[[String((solanaTokenMintFields.$network.name) ?? '')].filter(Boolean).join(' ') || [solanaTokenMintFields.$network.caip2 == null ? '' : String(`${(solanaTokenMintFields.$network.caip2).namespace}:${(solanaTokenMintFields.$network.caip2).reference}`)].filter(Boolean).join(' ') || 'Network'].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
