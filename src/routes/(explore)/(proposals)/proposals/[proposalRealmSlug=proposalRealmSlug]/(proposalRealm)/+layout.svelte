<script lang="ts">
	// Types/constants
	import { proposalRealmBySlug } from '$/constants/Proposal.ts'
	import { stringify } from 'devalue'


	// Context
	import { resolve } from '$app/paths'


	// State
	let {
		children,
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
	import ParentPageCollapsible from '$/components/ParentPageCollapsible.svelte'
	import ProposalRealmView from '$/views/ProposalRealmView.svelte'


	// Components
	import { EntityLayout } from '$/components/EntityView.svelte'
</script>


{#if entityId !== undefined}
	<ParentPageCollapsible
		href={resolve(`/proposals/${params.proposalRealmSlug}`)}
		id={stringify(entityId)}
	>
		{#snippet Summary({ open: _open })}
			<ProposalRealmView
				{entityId}
				layout={EntityLayout.SummaryInline}
			/>
		{/snippet}

		{@render children()}
	</ParentPageCollapsible>
{:else}
	{@render children()}
{/if}

