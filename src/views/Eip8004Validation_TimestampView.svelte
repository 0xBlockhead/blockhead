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
			{
				label: 'request hash',
			},
			{
				label: 'validator',
			},
			'response',
		],
		content: {
			dl: [
				[
					{
						label: 'request hash algorithm/hash',
					},
					{
						label: 'registration',
					},
					{
						label: 'validator',
					},
					'response',
				],
				[
					{
						label: 'request URI',
					},
					{
						label: 'response URI/hash algorithm/hash',
					},
					'tag',
					{
						label: 'last update',
					},
				],
			],
		},
		details: {
			tabs: [
				{
					label: 'Registration',
					items: [
						{
							label: 'Eip8004AgentRegistration when known',
						},
					],
				},
				{
					label: 'Evidence',
					items: [
						{
							label: 'request/response URI/hash algorithm/hash',
						},
					],
				},
				{
					label: 'On-chain evidence',
					items: [
						{
							label: 'block/transaction',
						},
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
			selection: EntityProxyResource<typeof schema, EntityType.Eip8004Validation_Timestamp>
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
	entityType={EntityType.Eip8004Validation_Timestamp}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
