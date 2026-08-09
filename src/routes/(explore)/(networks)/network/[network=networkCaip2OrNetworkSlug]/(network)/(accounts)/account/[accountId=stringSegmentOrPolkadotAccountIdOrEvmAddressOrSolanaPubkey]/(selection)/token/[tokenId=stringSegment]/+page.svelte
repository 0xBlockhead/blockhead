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
	import HederaTokenAssociationView from '$/views/HederaTokenAssociationView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? 'hedera token association'} • hedera token association • Blockhead</title>
</svelte:head>


<Page>
	<HederaTokenAssociationView
		selection={select(EntityType.HederaTokenAssociation, data.selector)}
	/>
</Page>
