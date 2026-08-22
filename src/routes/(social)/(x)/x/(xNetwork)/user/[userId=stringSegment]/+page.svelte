<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		data,
	}: PageProps = $props()

	const pageSelection = $derived(select(EntityType.XUser, data.selector, {
		sources: [
			Source.X_Rest,
			Source.X_FxEmbed_Rest,
		],
		fields: {
			name: true,
			username: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import XUserView from '$/views/XUserView.svelte'
</script>


<svelte:head>
	<title>{data?.title ?? (pageSelection.entity == null ? (pageSelection.entitySelector.id ?? '') || 'X user' : [(pageSelection.entity.name ?? ''), pageSelection.entity.username, pageSelection.entitySelector.id].filter(Boolean).join(' ') || 'X user')} • X user • Blockhead</title>
</svelte:head>


<Page>
	<XUserView
		selection={pageSelection}
	/>
</Page>
