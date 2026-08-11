<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		params,
	}: PageProps = $props()

	const pageSelection = $derived(select(EntityType.LensUsernameNamespaceRule, {
		$namespace: {
			address: params.address,
		},
		ruleId: params.ruleId,
	}, {
		fields: {
			ruleType: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import LensUsernameNamespaceRuleView from '$/views/LensUsernameNamespaceRuleView.svelte'
</script>


<svelte:head>
	<title>{pageSelection.entity == null ? 'Lens username namespace rule' : pageSelection.entity.ruleType || 'Lens username namespace rule'} • Lens username namespace rule • Blockhead</title>
</svelte:head>


<Page>
	<LensUsernameNamespaceRuleView
		selection={pageSelection}
	/>
</Page>
