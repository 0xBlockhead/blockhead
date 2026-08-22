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


	// Components
	import Page from '$/components/Page.svelte'
	import CardanoStakeCredentialView from '$/views/CardanoStakeCredentialView.svelte'
</script>


<svelte:head>
	<title>{data?.title ?? 'Cardano stake credential'} • Cardano stake credential • Blockhead</title>
</svelte:head>


<Page>
	<CardanoStakeCredentialView
		selection={select(EntityType.CardanoStakeCredential, data.selector)}
	/>
</Page>
