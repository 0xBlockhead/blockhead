<!-- Generated from APP.ts. Do not edit by hand. -->

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

	const pageSelection = $derived(select(EntityType.SolanaProgram, data.selector, {
		fields: {
			name: true,
			$programAccount: true,
			$upgradeAuthority: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import SolanaProgramView from '$/views/SolanaProgramView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? (pageSelection.entitySelector.programId || 'solana program')} • solana program • Blockhead</title>
</svelte:head>


<Page>
	<SolanaProgramView
		selection={pageSelection}
	/>
</Page>
