<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { getAppClient } from '$/routes/applicationClient.ts'
	const select = getAppClient().select


	// State
	let {
		params,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import IssuerActionView from '$/views/IssuerActionView.svelte'
</script>


<svelte:head>
	<title>issuer action • issuer action • Blockhead</title>
</svelte:head>


<Page>
	<IssuerActionView
		selection={
			select(EntityType.IssuerAction, {
				issuerActionId: params.issuerActionId,
			})
		}
	/>
</Page>
