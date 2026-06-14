<script lang="ts">
	// Types/constants
	import { type as arktype } from 'arktype'
	import { EvmAddress } from '$/schema/ZeroExHex.ts'


	// State
	let {
		params,
	} = $props()
	const entitySelector = $derived(
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
	{#if entitySelector}
		<EvmAccountView
			selector={selector}
		/>
	{/if}
</Page>
