<script lang="ts">
	// Types/constants
	import { EntityType } from '$/schema/$EntityType.ts'


	// Components
	import Page from '$/components/Page.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
</script>


<Page>
	<HeadingComponent>
		ERC-20 Allowances
	</HeadingComponent>

	<p data-text="muted">
		ERC-20 token allowances give a spender permission to transfer tokens on the owner's behalf.
		Block explorers do not index every historical <code>Approval</code> event, so allowances cannot be
		listed globally. Check individual token-spender pairs on a network account page.
	</p>

	<p>
		Per-network accounts make it possible to check the current allowance for known
		token and spender combinations via on-chain execution RPC.
	</p>
</Page>
