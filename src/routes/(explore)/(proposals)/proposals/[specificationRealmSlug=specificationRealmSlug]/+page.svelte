<script lang="ts">
	import { EntityType } from '$/schema/EntityType.ts'
	import { select } from '$/routes/+layout.svelte'
	// Types/constants
	import { specificationRealmBySlug } from '$/constants/SpecificationProposal.ts'

	// State
	let {
		params,
	} = $props()

	const selector = $derived(
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
	{#if selector !== undefined}
		<SpecificationRealmView
			selection={select(EntityType.SpecificationRealm, selector)}
			open
		/>
	{:else}
		<p role="alert">
			Unknown specification realm.
		</p>
	{/if}
</Page>
