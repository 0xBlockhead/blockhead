<script lang="ts">
	// Types/constants
	import {
		proposalCategoryBySlug,
		proposalKindAllowedInRealmByKey,
		specificationRealmBySlug,
	} from '$/constants/SpecificationProposal.ts'

	import { stringify } from 'devalue'


	// Context
	import { resolve } from '$app/paths'


	// State
	let {
		children,
		params,
	} = $props()

	const realm = $derived(
		specificationRealmBySlug[params.specificationRealmSlug]?.id,
	)

	const category = $derived(
		proposalCategoryBySlug[params.proposalKindSlug]?.id,
	)

	const entityId = $derived(
		realm != null && category != null && proposalKindAllowedInRealmByKey[`${realm}:${category}`] != null ?
			{
				realm,
				category,
			}
		:
			undefined,
	)


	// Components
	import { EntityLayout } from '$/components/EntityView.svelte'
	import ParentPageCollapsible from '$/components/ParentPageCollapsible.svelte'
	import ProposalKindView from '$/views/SpecificationProposalKindView.svelte'
</script>


{#if entityId !== undefined}
	<ParentPageCollapsible
		href={resolve('/(explore)/(proposals)/proposals/[specificationRealmSlug=specificationRealmSlug]/(specificationRealm)/[proposalKindSlug=proposalKindSlug]', {
			specificationRealmSlug: params.specificationRealmSlug,
			proposalKindSlug: params.proposalKindSlug,
		})}
		id={stringify(entityId)}
	>
		{#snippet Summary({ open: _open })}
			<ProposalKindView
				{entityId}
				layout={EntityLayout.SummaryInline}
			/>
		{/snippet}

		{@render children()}
	</ParentPageCollapsible>
{:else}
	{@render children()}
{/if}
