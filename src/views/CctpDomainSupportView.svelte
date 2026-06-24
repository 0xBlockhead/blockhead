<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'


	// State
	const view = {
		closed: [
			'cctpVersion',
			'domainId',
		],
		content: {
			dl: [
				[
					'cctpVersion',
					'domainId',
					'name',
					'standardTransferSource',
					'fastTransferSource',
					'forwardingDestination',
					'supportedTokens',
					'tokenMessengerAddress',
					'messageTransmitterAddress',
					'tokenMinterAddress',
				],
			],
		},
		details: {
			tabs: [
				{
					label: 'messages',
					when: 'open',
					items: [
						'$$messages',
					],
				},
				{
					label: 'burn fee timestamps',
					when: 'open',
					items: [
						'$$burnFeeTimestamps',
					],
				},
			],
		},
	} satisfies ComponentProps<typeof EntityView2>['view']

	let {
		selection,
		open = $bindable(true),
		...EntityViewProps
	}: WithRest<
		{
			selection: EntityProxyResource<typeof schema, EntityType.CctpDomainSupport>
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView2>,
			| 'layout'
			| 'showTypeAnnotation'
		>
	> = $props()


	// Components
	import EntityView2 from '$/components/EntityView2.svelte'
</script>


<EntityView2
	{selection}
	entityType={EntityType.CctpDomainSupport}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
