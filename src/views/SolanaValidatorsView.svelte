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
		title = 'Validators',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'SolanaValidators-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.SolanaValidator>
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
	entityType={EntityType.SolanaValidator}
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
				votePubkey: true,
				$network: true,
			},
		})
	}
	{countResource}
	getResourceItems={(solanaValidators) => [...new Map(solanaValidators.values.map((solanaValidator) => [solanaValidator[EntityMetaKey.SelectorKey], solanaValidator])).values()]}
	getKey={(solanaValidator) => solanaValidator[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Solana validators yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: solanaValidator })}
		{@const solanaValidatorFields = { ...solanaValidator[EntityMetaKey.Selector], ...solanaValidator }}
		<EntityView
			entityType={EntityType.SolanaValidator}
			entitySelector={solanaValidator[EntityMetaKey.Selector]}
			href={
				(
					solanaValidator[EntityMetaKey.Selector] != null && 'votePubkey' in solanaValidator[EntityMetaKey.Selector]
					&& solanaValidator[EntityMetaKey.Selector].votePubkey != null
					&& solanaValidator[EntityMetaKey.Selector] != null && '$network' in solanaValidator[EntityMetaKey.Selector] ?
						solanaValidator[EntityMetaKey.Selector].$network != null && 'caip2' in solanaValidator[EntityMetaKey.Selector].$network
						&& solanaValidator[EntityMetaKey.Selector].$network.caip2 != null ?
							resolve('/network/[network=networkCaip2OrNetworkSlug]/validator/[validatorId=nonNegativeIntegerOrSolanaPubkey]', {
						validatorId: String(solanaValidator[EntityMetaKey.Selector].votePubkey ?? ''),
						network: String(caip2StringFromValue(solanaValidator[EntityMetaKey.Selector].$network.caip2) ?? ''),
					})
					:
							solanaValidator[EntityMetaKey.Selector].$network != null && 'slug' in solanaValidator[EntityMetaKey.Selector].$network
							&& solanaValidator[EntityMetaKey.Selector].$network.slug != null ?
								resolve('/network/[network=networkCaip2OrNetworkSlug]/validator/[validatorId=nonNegativeIntegerOrSolanaPubkey]', {
							validatorId: String(solanaValidator[EntityMetaKey.Selector].votePubkey ?? ''),
							network: String(solanaValidator[EntityMetaKey.Selector].$network.slug ?? ''),
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
				{[String((solanaValidatorFields.votePubkey) ?? '')].filter(Boolean).join(' ') || 'solana validator'}
			{/snippet}

			{#snippet Value()}
				{[String((solanaValidatorFields.votePubkey) ?? '')].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[[String((solanaValidatorFields.$network.name) ?? '')].filter(Boolean).join(' ') || [solanaValidatorFields.$network.caip2 == null ? '' : String(`${(solanaValidatorFields.$network.caip2).namespace}:${(solanaValidatorFields.$network.caip2).reference}`)].filter(Boolean).join(' ') || 'Network'].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
