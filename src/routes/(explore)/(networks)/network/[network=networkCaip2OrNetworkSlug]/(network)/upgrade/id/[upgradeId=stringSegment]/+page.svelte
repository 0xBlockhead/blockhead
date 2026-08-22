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

	const pageSelection = $derived(select(EntityType.NetworkUpgrade, data.selector, {
		sources: [
			Source.Constants_Internal,
		],
		fields: {
			name: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import NetworkUpgradeView from '$/views/NetworkUpgradeView.svelte'
</script>


<svelte:head>
	<title>{data?.title ?? (pageSelection.entity == null ? (pageSelection.entitySelector.upgradeId ?? '') || 'network upgrade' : [pageSelection.entity.name, pageSelection.entitySelector.upgradeId].filter(Boolean).join(' ') || 'network upgrade')} • network upgrade • Blockhead</title>
</svelte:head>


<Page>
	<NetworkUpgradeView
		selection={pageSelection}
	/>
</Page>
