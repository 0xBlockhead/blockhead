<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { resolve } from '$app/paths'
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		data,
		params,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import PolkadotValidatorView from '$/views/PolkadotValidatorView.svelte'
</script>


<svelte:head>
	<title>Polkadot validator • Blockhead</title>
</svelte:head>


<Page>
	<PolkadotValidatorView
		href={
			resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]/polkadot/validator/[stashAccountId]', {
				networkSlug: params.networkSlug,
				stashAccountId: params.stashAccountId,
			})
		}
		selection={select(EntityType.PolkadotValidator, data.selector)}
	/>
</Page>
