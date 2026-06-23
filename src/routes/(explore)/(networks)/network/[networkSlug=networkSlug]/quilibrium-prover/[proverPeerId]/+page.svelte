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
	import QuilibriumProverView from '$/views/QuilibriumProverView.svelte'
</script>


<Page>
	<QuilibriumProverView
		selection={select(EntityType.QuilibriumProver, data.selector)}
	/>
</Page>
