<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntitiesList, { type EntitiesListForwardProps } from '$/components/EntitiesList.svelte'
	import type { RegisteredEntityProxyEntitiesSelection } from '$/client/$proxy.svelte.ts'
	import type { SvelteKitResource } from '$/lib/db/queryResource.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'




	// State
	let {
		selection,
		countResource,
		title = 'Blockhead Logos blockchain wallet key states',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'BlockheadLogosBlockchainWalletKeyStates-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.BlockheadLogosBlockchainWalletKeyState>
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
	entityType={EntityType.BlockheadLogosBlockchainWalletKeyState}
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
				publicKey: true,
				$nodeState: {
					fields: {
						endpoint: true,
					},
				},
			},
		})
	}
	{countResource}
	getResourceItems={(blockheadLogosBlockchainWalletKeyStates) => [...new Map(blockheadLogosBlockchainWalletKeyStates.values.map((blockheadLogosBlockchainWalletKeyState) => [blockheadLogosBlockchainWalletKeyState[EntityMetaKey.SelectorKey], blockheadLogosBlockchainWalletKeyState])).values()]}
	getKey={(blockheadLogosBlockchainWalletKeyState) => blockheadLogosBlockchainWalletKeyState[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Blockhead Logos blockchain wallet key states yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: blockheadLogosBlockchainWalletKeyState })}
		{@const blockheadLogosBlockchainWalletKeyStateFields = { ...blockheadLogosBlockchainWalletKeyState[EntityMetaKey.Selector], ...blockheadLogosBlockchainWalletKeyState }}
		<EntityView
			entityType={EntityType.BlockheadLogosBlockchainWalletKeyState}
			entitySelector={blockheadLogosBlockchainWalletKeyState[EntityMetaKey.Selector]}
			layout={EntityLayout.Summary}
			open={false}
			showTypeAnnotation={false}
		>
			{#snippet Title()}
				{[String((blockheadLogosBlockchainWalletKeyStateFields.publicKey) ?? '')].filter(Boolean).join(' ') || 'blockhead Logos blockchain wallet key state'}
			{/snippet}

			{#snippet Value()}
				{[[String((blockheadLogosBlockchainWalletKeyStateFields.$nodeState.peerId) ?? '')].filter(Boolean).join(' ') || 'blockhead Logos blockchain node state'].filter(Boolean).join(' ')}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
