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
		title = 'Accounts',
		typeAnnotationParagraphs = ['A locally enrolled public account included in Blockhead account-wide views.'],
		placeholderText = undefined,
		emptyText = 'No accounts enrolled.',
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'BlockheadAccounts-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.BlockheadAccount>
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
	entityType={EntityType.BlockheadAccount}
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
				$account: true,
			},
		})
	}
	{countResource}
	getResourceItems={(blockheadAccounts) => [...new Map(blockheadAccounts.values.map((blockheadAccount) => [blockheadAccount[EntityMetaKey.SelectorKey], blockheadAccount])).values()]}
	getKey={(blockheadAccount) => blockheadAccount[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Blockhead accounts yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: blockheadAccount })}
		{@const blockheadAccountFields = { ...blockheadAccount[EntityMetaKey.Selector], ...blockheadAccount }}
		<EntityView
			entityType={EntityType.BlockheadAccount}
			entitySelector={blockheadAccount[EntityMetaKey.Selector]}
			layout={EntityLayout.Summary}
			open={false}
			showTypeAnnotation={false}
		>
			{#snippet Title()}
				{[[blockheadAccountFields.$account.caip10 == null ? '' : String(`${(blockheadAccountFields.$account.caip10).namespace}:${(blockheadAccountFields.$account.caip10).reference}:${(blockheadAccountFields.$account.caip10).accountAddress}`)].filter(Boolean).join(' ') || 'account'].filter(Boolean).join(' ') || 'blockhead account'}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
