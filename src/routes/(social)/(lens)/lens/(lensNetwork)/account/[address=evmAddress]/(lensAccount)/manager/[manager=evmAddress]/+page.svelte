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

	const pageSelection = $derived(select(EntityType.LensAccountManager, {
		$account: data.selector,
		manager: params.manager,
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import LensAccountManagerView from '$/views/LensAccountManagerView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? (pageSelection.entitySelector.manager || 'Lens account manager')} • Lens account manager • Blockhead</title>
</svelte:head>


<Page>
	<LensAccountManagerView
		selection={pageSelection}
	/>
</Page>
