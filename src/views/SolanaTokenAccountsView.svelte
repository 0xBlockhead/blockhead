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
		title = 'Token accounts',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'SolanaTokenAccounts-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.SolanaTokenAccount>
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
	entityType={EntityType.SolanaTokenAccount}
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
				tokenAccountPubkey: true,
				$mint: true,
				$network: true,
			},
		})
	}
	{countResource}
	getResourceItems={(solanaTokenAccounts) => [...new Map(solanaTokenAccounts.values.map((solanaTokenAccount) => [solanaTokenAccount[EntityMetaKey.SelectorKey], solanaTokenAccount])).values()]}
	getKey={(solanaTokenAccount) => solanaTokenAccount[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Solana token accounts yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: solanaTokenAccount })}
		{@const solanaTokenAccountFields = { ...solanaTokenAccount[EntityMetaKey.Selector], ...solanaTokenAccount }}
		<EntityView
			entityType={EntityType.SolanaTokenAccount}
			entitySelector={solanaTokenAccount[EntityMetaKey.Selector]}
			href={
				(
					solanaTokenAccount[EntityMetaKey.Selector] != null && 'tokenAccountPubkey' in solanaTokenAccount[EntityMetaKey.Selector]
					&& solanaTokenAccount[EntityMetaKey.Selector].tokenAccountPubkey != null
					&& solanaTokenAccount[EntityMetaKey.Selector] != null && '$network' in solanaTokenAccount[EntityMetaKey.Selector] ?
						solanaTokenAccount[EntityMetaKey.Selector].$network != null && 'caip2' in solanaTokenAccount[EntityMetaKey.Selector].$network
						&& solanaTokenAccount[EntityMetaKey.Selector].$network.caip2 != null ?
							resolve('/network/[network=networkCaip2OrNetworkSlug]/token-account/[tokenAccountPubkey=stringSegment]', {
						tokenAccountPubkey: String(solanaTokenAccount[EntityMetaKey.Selector].tokenAccountPubkey ?? ''),
						network: String(caip2StringFromValue(solanaTokenAccount[EntityMetaKey.Selector].$network.caip2) ?? ''),
					})
					:
							solanaTokenAccount[EntityMetaKey.Selector].$network != null && 'slug' in solanaTokenAccount[EntityMetaKey.Selector].$network
							&& solanaTokenAccount[EntityMetaKey.Selector].$network.slug != null ?
								resolve('/network/[network=networkCaip2OrNetworkSlug]/token-account/[tokenAccountPubkey=stringSegment]', {
							tokenAccountPubkey: String(solanaTokenAccount[EntityMetaKey.Selector].tokenAccountPubkey ?? ''),
							network: String(solanaTokenAccount[EntityMetaKey.Selector].$network.slug ?? ''),
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
				{[String((solanaTokenAccountFields.tokenAccountPubkey) ?? '')].filter(Boolean).join(' ') || 'solana token account'}
			{/snippet}

			{#snippet Value()}
				{[String((solanaTokenAccountFields.tokenAccountPubkey) ?? '')].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[[String((solanaTokenAccountFields.$mint.mintAddress) ?? '')].filter(Boolean).join(' ') || 'solana token mint'].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
