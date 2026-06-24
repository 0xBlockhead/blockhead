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
			'transactionId',
		],
		content: {
			dl: [
				[
					'transactionId',
					'version',
					'lockTime',
					'subnetworkId',
					'gas',
					'payloadHash',
					'payloadLength',
					'mass',
					'blockHashes',
				],
			],
		},
		details: {
			tabs: [
				{
					label: 'inputs',
					when: 'open',
					items: [
						'$$inputs',
					],
				},
				{
					label: 'outputs',
					when: 'open',
					items: [
						'$$outputs',
					],
				},
				{
					label: 'acceptances',
					when: 'open',
					items: [
						'$$acceptances',
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
			selection: EntityProxyResource<typeof schema, EntityType.KaspaTransaction>
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
	entityType={EntityType.KaspaTransaction}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
