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
		title = 'Wallet connection methods',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'WalletConnectionMethods-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.WalletConnectionMethod>
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
	entityType={EntityType.WalletConnectionMethod}
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
				label: true,
				protocol: true,
				implementationStatus: true,
			},
		})
	}
	{countResource}
	getResourceItems={(walletConnectionMethods) => [...new Map(walletConnectionMethods.values.map((walletConnectionMethod) => [walletConnectionMethod[EntityMetaKey.SelectorKey], walletConnectionMethod])).values()]}
	getKey={(walletConnectionMethod) => walletConnectionMethod[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Wallet connection methods yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: walletConnectionMethod })}
		{@const walletConnectionMethodFields = { ...walletConnectionMethod[EntityMetaKey.Selector], ...walletConnectionMethod }}
		<EntityView
			entityType={EntityType.WalletConnectionMethod}
			entitySelector={walletConnectionMethod[EntityMetaKey.Selector]}
			layout={EntityLayout.Summary}
			open={false}
			showTypeAnnotation={false}
		>
			{#snippet Title()}
				{[String((walletConnectionMethodFields.label) ?? '')].filter(Boolean).join(' ') || 'wallet connection method'}
			{/snippet}

			{#snippet Value()}
				{[String((walletConnectionMethodFields.protocol) ?? ''), String((walletConnectionMethodFields.implementationStatus) ?? '')].filter(Boolean).join(' ')}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
