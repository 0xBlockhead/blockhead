<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityProxyEntitiesResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'


	// State
	let {
		selection,
		title = 'MEV-Boost',
		typeAnnotationParagraphs = [],
		emptyText = undefined,
		href,
		open = $bindable(true),
		collapsible = true,
		id = 'MevRelay_ProposerPayloadDeliveredRows-list',
		...MevRelay_ProposerPayloadDeliveredsViewProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.MevRelay_ProposerPayloadDelivered>
			title?: string
			typeAnnotationParagraphs?: string[]
			emptyText?: string
			href?: string
			open?: boolean
			collapsible?: boolean
			id?: string
		},
		ComponentProps<typeof MevRelay_ProposerPayloadDeliveredsView>
	> = $props()


	// Components
	import MevRelay_ProposerPayloadDeliveredsView from '$/views/MevRelay_ProposerPayloadDeliveredsView.svelte'
</script>


<MevRelay_ProposerPayloadDeliveredsView
	{...MevRelay_ProposerPayloadDeliveredsViewProps}
	{selection}
	{title}
	{typeAnnotationParagraphs}
	{emptyText}
	{href}
	bind:open
	{collapsible}
	{id}
/>
