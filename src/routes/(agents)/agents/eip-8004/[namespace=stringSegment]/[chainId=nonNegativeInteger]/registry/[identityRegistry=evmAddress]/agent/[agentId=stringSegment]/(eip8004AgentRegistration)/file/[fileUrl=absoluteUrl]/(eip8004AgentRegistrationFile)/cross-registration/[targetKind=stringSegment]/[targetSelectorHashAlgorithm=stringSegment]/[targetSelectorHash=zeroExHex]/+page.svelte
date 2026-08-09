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
		params,
	}: PageProps = $props()

	const pageSelection = $derived(select(EntityType.Eip8004CrossRegistration, {
		$registrationFile: data.selector,
		targetKind: params.targetKind,
		targetSelectorHashAlgorithm: params.targetSelectorHashAlgorithm,
		targetSelectorHash: params.targetSelectorHash,
	}, {
		sources: [
			Source.Eip8004Scan_Rest,
		],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import Eip8004CrossRegistrationView from '$/views/Eip8004CrossRegistrationView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? (pageSelection.entitySelector.targetKind || 'EIP-8004 cross registration')} • EIP-8004 cross registration • Blockhead</title>
</svelte:head>


<Page>
	<Eip8004CrossRegistrationView
		selection={pageSelection}
	/>
</Page>
