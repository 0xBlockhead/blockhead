<script lang="ts">
	// Types/constants
	import {
		proposalCategoryBySlug,
		proposalKindAllowedInRealm,
		proposalRealmBySlug,
	} from '$/constants/Proposal.ts'


	// Context
	import { resolve } from '$app/paths'


	// State
	let {
		params,
	} = $props()

	const realm = $derived(
		params.proposalRealmSlug in proposalRealmBySlug ?
			proposalRealmBySlug[params.proposalRealmSlug]!.id
		:
			undefined,
	)

	const category = $derived(
		params.proposalKindSlug in proposalCategoryBySlug ?
			proposalCategoryBySlug[params.proposalKindSlug]!.id
		:
			undefined,
	)

	const entityId = $derived(
		realm !== undefined && category !== undefined && proposalKindAllowedInRealm(realm, category) ?
			{
				realm,
				category,
			}
		:
			undefined,
	)


	// Components
	import Page from '$/components/Page.svelte'
	import ProposalKindView from '$/views/ProposalKindView.svelte'
</script>


<Page>
	{#if entityId !== undefined}
		<ProposalKindView
			{entityId}
			href={resolve(`/proposals/${params.proposalRealmSlug}/${params.proposalKindSlug}`)}
			open
		/>
	{:else}
		<p role="alert">
			Unknown proposal kind in this realm.
		</p>
	{/if}
</Page>

