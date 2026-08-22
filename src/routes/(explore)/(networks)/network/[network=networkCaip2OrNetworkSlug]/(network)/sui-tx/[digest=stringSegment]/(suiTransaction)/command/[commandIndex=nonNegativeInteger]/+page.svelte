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
		params,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import SuiProgrammableTransactionCommandView from '$/views/SuiProgrammableTransactionCommandView.svelte'
</script>


<svelte:head>
	<title>{data?.title ?? 'Sui programmable transaction command'} • Sui programmable transaction command • Blockhead</title>
</svelte:head>


<Page>
	<SuiProgrammableTransactionCommandView
		selection={
			select(EntityType.SuiProgrammableTransactionCommand, {
				$transaction: data.selector,
				commandIndex: Number(params.commandIndex),
			})
		}
	/>
</Page>
