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
		title = 'Wallet transport sessions',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'BlockheadWalletTransportSessions-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.BlockheadWalletTransportSession>
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
	entityType={EntityType.BlockheadWalletTransportSession}
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
				transportSessionId: true,
				status: true,
				transportKind: true,
			},
		})
	}
	{countResource}
	getResourceItems={(blockheadWalletTransportSessions) => [...new Map(blockheadWalletTransportSessions.values.map((blockheadWalletTransportSession) => [blockheadWalletTransportSession[EntityMetaKey.SelectorKey], blockheadWalletTransportSession])).values()]}
	getKey={(blockheadWalletTransportSession) => blockheadWalletTransportSession[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Blockhead wallet transport sessions yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: blockheadWalletTransportSession })}
		{@const blockheadWalletTransportSessionFields = { ...blockheadWalletTransportSession[EntityMetaKey.Selector], ...blockheadWalletTransportSession }}
		<EntityView
			entityType={EntityType.BlockheadWalletTransportSession}
			entitySelector={blockheadWalletTransportSession[EntityMetaKey.Selector]}
			layout={EntityLayout.Summary}
			open={false}
			showTypeAnnotation={false}
		>
			{#snippet Title()}
				{[String((blockheadWalletTransportSessionFields.transportSessionId) ?? '')].filter(Boolean).join(' ') || 'blockhead wallet transport session'}
			{/snippet}

			{#snippet Value()}
				{[String((blockheadWalletTransportSessionFields.status) ?? ''), String((blockheadWalletTransportSessionFields.transportKind) ?? '')].filter(Boolean).join(' ')}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
