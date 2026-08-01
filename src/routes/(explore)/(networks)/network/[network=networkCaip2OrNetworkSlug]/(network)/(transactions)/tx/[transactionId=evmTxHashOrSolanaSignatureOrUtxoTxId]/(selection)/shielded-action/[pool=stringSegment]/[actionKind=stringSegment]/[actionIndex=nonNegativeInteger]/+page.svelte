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

	const pageSelection = $derived(select(EntityType.ZcashShieldedAction, data.selector, {
		fields: {
			nullifier: true,
			noteCommitment: true,
			$pool: true,
			valueCommitment: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import ZcashShieldedActionView from '$/views/ZcashShieldedActionView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? ([pageSelection.entitySelector.actionKind, String(pageSelection.entitySelector.indexInTransaction)].filter(Boolean).join(' ') || 'Zcash shielded action')} • Zcash shielded action • Blockhead</title>
</svelte:head>


<Page>
	<ZcashShieldedActionView
		selection={pageSelection}
	/>
</Page>
