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
		title = 'Hedera allowances',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'HederaAllowances-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.HederaAllowance>
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
	entityType={EntityType.HederaAllowance}
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
				allowanceKind: true,
				$spender: true,
				$token: true,
				serialNumber: true,
			},
		})
	}
	{countResource}
	getResourceItems={(hederaAllowances) => [...new Map(hederaAllowances.values.map((hederaAllowance) => [hederaAllowance[EntityMetaKey.SelectorKey], hederaAllowance])).values()]}
	getKey={(hederaAllowance) => hederaAllowance[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Hedera allowances yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: hederaAllowance })}
		{@const hederaAllowanceFields = { ...hederaAllowance[EntityMetaKey.Selector], ...hederaAllowance }}
		<EntityView
			entityType={EntityType.HederaAllowance}
			entitySelector={hederaAllowance[EntityMetaKey.Selector]}
			layout={EntityLayout.Summary}
			open={false}
			showTypeAnnotation={false}
		>
			{#snippet Title()}
				{[String((hederaAllowanceFields.allowanceKind) ?? '')].filter(Boolean).join(' ') || 'hedera allowance'}
			{/snippet}

			{#snippet Value()}
				{[[String((hederaAllowanceFields.$spender.accountId) ?? '')].filter(Boolean).join(' ') || 'hedera account'].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[[String((hederaAllowanceFields.$token.tokenId) ?? '')].filter(Boolean).join(' ') || 'hedera token', String((hederaAllowanceFields.serialNumber) ?? '')].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
