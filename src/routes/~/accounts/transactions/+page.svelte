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
	<title>Transactions • Blockhead</title>
</svelte:head>


<Page>
	<HeadingComponent>Transactions</HeadingComponent>

	<WalletAccountPortfolio
		facet='transactions'
		id='account-transactions'
	/>
</Page>
