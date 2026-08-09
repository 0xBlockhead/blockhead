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

	const pageSelection = $derived(select(EntityType.EulerEvkVault, data.selector, {
		sources: [
			Source.Euler_Rest,
		],
		fields: {
			name: true,
			symbol: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import EulerEvkVaultView from '$/views/EulerEvkVaultView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? (pageSelection.entity == null ? 'Euler EVK vault' : [pageSelection.entity.name, pageSelection.entity.symbol].filter(Boolean).join(' ') || 'Euler EVK vault')} • Euler EVK vault • Blockhead</title>
</svelte:head>


<Page>
	<EulerEvkVaultView
		selection={pageSelection}
	/>
</Page>
