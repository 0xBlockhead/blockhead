<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { getAppClient } from '$/routes/applicationClient.ts'
	const select = getAppClient().select


	// State
	let {
		params,
	}: PageProps = $props()

	const pageSelection = $derived(select(EntityType.XUser, {
		username: params.username,
	}, {
		sources: [
			Source.X_Rest,
			Source.X_FxEmbed_Rest,
		],
		fields: {
			name: true,
			id: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import XUserView from '$/views/XUserView.svelte'
</script>


<svelte:head>
	<title>{pageSelection.entity == null ? (pageSelection.entitySelector.username ?? '') || 'X user' : [(pageSelection.entity.name ?? ''), pageSelection.entitySelector.username, pageSelection.entity.id].filter(Boolean).join(' ') || 'X user'} • X user • Blockhead</title>
</svelte:head>


<Page>
	<XUserView
		selection={pageSelection}
	/>
</Page>
