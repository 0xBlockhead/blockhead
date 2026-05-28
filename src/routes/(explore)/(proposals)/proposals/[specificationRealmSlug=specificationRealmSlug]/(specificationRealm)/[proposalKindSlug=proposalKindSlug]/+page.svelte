<script lang="ts">
	// Types/constants
	import {
		proposalCategoryBySlug,
		proposalKindAllowedInRealmByKey,
		specificationRealmBySlug,
	} from '$/constants/SpecificationProposal.ts'

	// State
	let {
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
	import Page from '$/components/Page.svelte'
	import ProposalKindView from '$/views/SpecificationProposalKindView.svelte'
</script>


<Page>
	{#if entityId !== undefined}
		<ProposalKindView
			{entityId}
			open
		/>
	{:else}
		<p role="alert">
			Unknown proposal kind in this realm.
		</p>
	{/if}
</Page>
