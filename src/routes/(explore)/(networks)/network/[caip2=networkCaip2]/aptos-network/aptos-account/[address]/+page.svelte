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
	import AptosAccountView from '$/views/AptosAccountView.svelte'
</script>


<Page>
	<AptosAccountView
		selection={select(EntityType.AptosAccount, data.selector)}
	/>
</Page>
