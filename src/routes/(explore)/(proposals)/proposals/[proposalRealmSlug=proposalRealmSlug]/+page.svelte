<script lang="ts">
	// Types/constants
	import { proposalRealmBySlug } from '$/constants/Proposal.ts'


	// Context
	import { resolve } from '$app/paths'


	// Props
	let {
		params,
	} = $props()

	const entityId = $derived(
		params.proposalRealmSlug in proposalRealmBySlug ?
			{
				realm: proposalRealmBySlug[params.proposalRealmSlug]!.id,
			}
		:
			undefined,
	)


	// Components
	import Page from '$/components/Page.svelte'
	import ProposalRealmView from '$/views/ProposalRealmView.svelte'
</script>


<Page>
	{#if entityId !== undefined}
		<ProposalRealmView
			{entityId}
			href={resolve(`/proposals/${params.proposalRealmSlug}`)}
			open
		/>
	{:else}
		<p role="alert">
			Unknown proposal realm.
		</p>
	{/if}
</Page>

