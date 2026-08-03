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
	import SolanaInstructionView from '$/views/SolanaInstructionView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? 'solana instruction'} • solana instruction • Blockhead</title>
</svelte:head>


<Page>
	<SolanaInstructionView
		selection={
			select(EntityType.SolanaInstruction, {
				$transaction: data.selector.$transaction,
				instructionKind: params.instructionKind,
				indexInTransaction: Number(params.indexInTransaction),
				indexInInstruction: Number(params.indexInInstruction),
			})
		}
	/>
</Page>
