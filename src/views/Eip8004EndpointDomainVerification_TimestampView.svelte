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
			label: 'endpoint URL',
		},
		{
			label: 'observation time',
		},
		'verified',
	],
	content: {
		dl: [
			[
				{
					label: 'endpoint URL',
				},
				{
					label: 'timestamp',
				},
				'source',
				'verified',
			],
			[
				{
					label: 'registration selector',
				},
				'error',
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Endpoint',
				items: [
					{
						label: 'endpoint URL',
					},
				],
			},
			{
				label: 'Registration',
				items: [
					{
						label: 'registration selector JSON',
					},
				],
			},
			{
				label: 'Error',
				items: [
					{
						label: 'error field',
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
			selection: EntityProxyResource<typeof schema, EntityType.Eip8004EndpointDomainVerification_Timestamp>
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
	entityType={EntityType.Eip8004EndpointDomainVerification_Timestamp}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
