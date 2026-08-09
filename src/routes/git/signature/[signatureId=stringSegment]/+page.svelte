<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		params,
	}: PageProps = $props()

	const pageSelection = $derived(select(EntityType.GitSignature, {
		signatureId: params.signatureId,
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import GitSignatureView from '$/views/GitSignatureView.svelte'
</script>


<svelte:head>
	<title>{pageSelection.entitySelector.signatureId || 'Git signature'} • Git signature • Blockhead</title>
</svelte:head>


<Page>
	<GitSignatureView
		selection={pageSelection}
	/>
</Page>
