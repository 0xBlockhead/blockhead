<script lang="ts">
	import { EntityType } from '$/schema/EntityType.ts'
	import { select } from '$/routes/+layout.svelte'
	// Types/constants
	import { type as arktype } from 'arktype'
	import { EvmAddress } from '$/schema/ZeroExHex.ts'


	// State
	let {
		params,
	} = $props()
	const selector = $derived(
		((address) => (
			address instanceof arktype.errors ?
				undefined
			:
				{ address }
		))(EvmAddress(params.accountId)),
	)

	// Components
	import Page from '$/components/Page.svelte'
	import EvmAccountView from '$/views/EvmAccountView.svelte'
</script>


<Page>
	{#if selector}
		<EvmAccountView
			selection={select(EntityType.EvmAccount, selector)}
		/>
	{/if}
</Page>
