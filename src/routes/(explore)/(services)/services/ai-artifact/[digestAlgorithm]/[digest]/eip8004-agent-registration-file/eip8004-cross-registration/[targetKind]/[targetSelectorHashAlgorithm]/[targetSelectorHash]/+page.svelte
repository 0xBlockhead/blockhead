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
	import Eip8004CrossRegistrationView from '$/views/Eip8004CrossRegistrationView.svelte'
</script>


<Page>
	<Eip8004CrossRegistrationView
		selection={select(EntityType.Eip8004CrossRegistration, data.selector)}
	/>
</Page>
