<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { getAppClient } from '$/routes/applicationClient.ts'
	const select = getAppClient().select


	// State
	let {
		params,
	}: PageProps = $props()

	const pageSelection = $derived(select(EntityType.LensFeedRule, {
		$feed: {
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
	import LensFeedRuleView from '$/views/LensFeedRuleView.svelte'
</script>


<svelte:head>
	<title>{pageSelection.entity == null ? 'Lens feed rule' : pageSelection.entity.ruleType || 'Lens feed rule'} • Lens feed rule • Blockhead</title>
</svelte:head>


<Page>
	<LensFeedRuleView
		selection={pageSelection}
	/>
</Page>
