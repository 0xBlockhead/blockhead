<script lang="ts">
	// Types/constants
	import { specificationRealmBySlug } from '$/constants/SpecificationProposal.ts'

	// State
	let {
		params,
	} = $props()

	const entitySelector = $derived(
		params.specificationRealmSlug in specificationRealmBySlug ?
			{
				realm: specificationRealmBySlug[params.specificationRealmSlug]!.id,
			}
		:
			undefined,
	)


	// Components
	import Page from '$/components/Page.svelte'
	import SpecificationRealmView from '$/views/SpecificationRealmView.svelte'
</script>


<Page>
	{#if entitySelector !== undefined}
		<SpecificationRealmView
			selector={entitySelector}
			open
		/>
	{:else}
		<p role="alert">
			Unknown specification realm.
		</p>
	{/if}
</Page>
