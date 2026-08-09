<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		data,
		params,
	}: PageProps = $props()

	const pageSelection = $derived(select(EntityType.Eip7702Authorization, {
		$transaction: data.selector,
		authorizationIndex: Number(params.authorizationIndex),
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import Eip7702AuthorizationView from '$/views/Eip7702AuthorizationView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? (String(pageSelection.entitySelector.authorizationIndex) || 'eip7702 authorization')} • eip7702 authorization • Blockhead</title>
</svelte:head>


<Page>
	<Eip7702AuthorizationView
		selection={pageSelection}
	/>
</Page>
