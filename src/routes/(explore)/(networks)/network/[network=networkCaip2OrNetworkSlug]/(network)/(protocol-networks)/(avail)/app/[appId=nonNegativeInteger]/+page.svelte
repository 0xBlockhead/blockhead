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
	}: PageProps = $props()

	const pageSelection = $derived(select(EntityType.AvailAppId, data.selector, {
		fields: {
			label: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import AvailAppIdView from '$/views/AvailAppIdView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? (pageSelection.entity == null ? String(pageSelection.entitySelector.appId ?? '') || 'avail app ID' : (pageSelection.entity.label ?? '') || String(pageSelection.entitySelector.appId) || 'avail app ID')} • avail app ID • Blockhead</title>
</svelte:head>


<Page>
	<AvailAppIdView
		selection={pageSelection}
	/>
</Page>
