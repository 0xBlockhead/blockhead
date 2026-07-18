<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import { EntityType } from '$/schema/EntityType.ts'
	import HeadingComponent from '$/components/Heading.svelte'
	import WalletAccountPortfolio from '$/components/WalletAccountPortfolio.svelte'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// Components
	import Page from '$/components/Page.svelte'
</script>


<svelte:head>
	<title>Balances • Blockhead</title>
</svelte:head>


<Page>
	<HeadingComponent>Balances</HeadingComponent>

	<WalletAccountPortfolio id='account-balances' />
</Page>
